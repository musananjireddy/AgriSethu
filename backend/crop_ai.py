import os
import json
import base64
from io import BytesIO

import torch
import timm
from PIL import Image
from torchvision import transforms
from safetensors.torch import load_file
from huggingface_hub import hf_hub_download
from openai import OpenAI
from language_labels import OUTPUT_LABELS
from display_names import DISPLAY_NAMES


# ---------------------------------------------------------
# AgroMind model
# ---------------------------------------------------------

REPO = "Arko007/agromind-plant-disease-nfnet"

model_path = hf_hub_download(REPO, "model.safetensors")
config_path = hf_hub_download(REPO, "config.json")

with open(config_path, encoding="utf-8") as f:
    CONFIG = json.load(f)

MODEL = timm.create_model(
    CONFIG["architecture"],
    pretrained=False,
    num_classes=CONFIG["num_classes"],
)

MODEL.load_state_dict(load_file(model_path))
MODEL.eval()

TRANSFORM = transforms.Compose([
    transforms.Resize((512, 512)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.5, 0.5, 0.5],
        std=[0.5, 0.5, 0.5],
    ),
])


# ---------------------------------------------------------
# Language names
# ---------------------------------------------------------

LANGUAGE_NAMES = {
    "en": "English",
    "te": "Telugu",
    "hi": "Hindi",
}


# ---------------------------------------------------------
# AgroMind prediction
# ---------------------------------------------------------

def predict_crop_disease(image_bytes):
    image = Image.open(BytesIO(image_bytes)).convert("RGB")

    tensor = TRANSFORM(image).unsqueeze(0)

    with torch.no_grad():
        output = MODEL(tensor)
        probabilities = torch.softmax(output, dim=1)[0]
        confidence, index = torch.max(probabilities, dim=0)

    label = CONFIG["class_names"][index.item()]

    return label, confidence.item()


# ---------------------------------------------------------
# Qwen explanation
# ---------------------------------------------------------

def explain_with_qwen(
    image_bytes,
    detected_label,
    confidence,
    language,
):
    api_key = __import__("os").getenv("HF_TOKEN")

    if not api_key:
        raise RuntimeError("HF_TOKEN is not available.")

    client = OpenAI(
        base_url="https://router.huggingface.co/v1",
        api_key=api_key,
    )

    encoded = base64.b64encode(image_bytes).decode("utf-8")
    data_url = f"data:image/jpeg;base64,{encoded}"

    selected_language = LANGUAGE_NAMES.get(language, "English")

    if "__" in detected_label:
        crop, problem = detected_label.split("__", 1)
    else:
        crop = detected_label
        problem = "Needs confirmation"

    prompt = f"""
You are a careful agricultural assistant for farmers.

The image classifier has already predicted:

Crop: {crop}
Possible Problem: {problem}
Model Confidence: {confidence:.0%}

IMPORTANT RULES:

1. Do NOT replace the predicted crop with another crop.
2. Do NOT invent a different disease.
3. Do NOT contradict the classifier.
4. If the image does not clearly support the predicted disease,
   say that the disease needs confirmation.
5. Do not provide dangerous pesticide doses.
6. Give simple, practical farmer-friendly advice.
7. Respond ONLY in {selected_language}.

Return ONLY these six sections, with these exact English section names:

SEVERITY:
...

SYMPTOMS:
- ...

ACTIONS:
- ...

TIP:
- ...

Do not write Crop, Possible Problem, or Confidence.
Do not write any section names in Telugu or Hindi.
Do not mention pesticide names, chemical doses, or application schedules.
"""

    response = client.chat.completions.create(
        model="Qwen/Qwen3-VL-30B-A3B-Instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": data_url
                        },
                    },
                    {
                        "type": "text",
                        "text": prompt,
                    },
                ],
            }
        ],
    )

    return response.choices[0].message.content.strip()


# ---------------------------------------------------------
# Main Crop Health function
# ---------------------------------------------------------

# ---------------------------------------------------------
# Image Type Gate
# ---------------------------------------------------------

def check_if_plant_image(image_bytes):
    api_key = os.getenv("HF_TOKEN")

    if not api_key:
        return None

    try:
        client = OpenAI(
            base_url="https://router.huggingface.co/v1",
            api_key=api_key,
        )

        encoded = base64.b64encode(image_bytes).decode("utf-8")
        data_url = f"data:image/jpeg;base64,{encoded}"

        prompt = """
Look carefully at this image.

Determine whether the image clearly contains a real crop, plant,
leaf, fruit, stem, or other visible plant material.

Return ONLY ONE of these exact answers:

PLANT_IMAGE

or

NOT_PLANT_IMAGE

Rules:
- A clear crop leaf or plant = PLANT_IMAGE
- A field/crop containing visible plants = PLANT_IMAGE
- A close-up plant disease image = PLANT_IMAGE
- Person, face, animal, vehicle, building, document, screenshot,
  food dish, random object, or unrelated image = NOT_PLANT_IMAGE
- If you are uncertain whether it is a plant image = NOT_PLANT_IMAGE
"""

        response = client.chat.completions.create(
            model="Qwen/Qwen3-VL-30B-A3B-Instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": data_url
                            },
                        },
                        {
                            "type": "text",
                            "text": prompt,
                        },
                    ],
                }
            ],
        )

        answer = response.choices[0].message.content.strip().upper()

        if "NOT_PLANT_IMAGE" in answer:
            return False

        if "PLANT_IMAGE" in answer:
            return True

        return None

    except Exception:
        return None

def analyze_crop_image(
    image_bytes,
    mime_type="image/jpeg",
    language="en",
):
    try:
        # First reject images that do not appear to contain a plant.
        plant_check = check_if_plant_image(image_bytes)

        if plant_check is False:
            return (
                "This doesn't appear to be a crop or plant image. "
                "Please upload a clear photo of a crop leaf or plant."
            )

        if plant_check is None:
            return (
                "Image check could not be completed. "
                "Please try again with a clear crop or plant photo."
            )

        detected_label, confidence = predict_crop_disease(image_bytes)

        # Low-confidence result: do not pretend to know the diagnosis.
        if confidence < 0.60:
            return (
                "Crop analysis is uncertain.\n\n"
                "Please upload a clearer photo showing the affected "
                "leaves and the whole plant if possible."
            )

        try:
            explanation = explain_with_qwen(
                image_bytes=image_bytes,
                detected_label=detected_label,
                confidence=confidence,
                language=language,
            )

            return format_result(explanation, detected_label, confidence, language)

        except Exception as error:
            print("QWEN ERROR:", repr(error))

            if "__" in detected_label:
                crop, problem = detected_label.split("__", 1)
            else:
                crop = detected_label
                problem = "Needs confirmation"

            return (
                f"Crop: {crop}\n"
                f"Possible Problem: {problem}\n"
                f"Confidence: {confidence:.0%}\n\n"
                "Detailed explanation is temporarily unavailable."
            )

    except Exception as error:
        print("AGROMIND ERROR:", repr(error))
        raise



def format_result(raw_text, detected_label, confidence, language):
    labels = OUTPUT_LABELS.get(language, OUTPUT_LABELS["en"])
    names = DISPLAY_NAMES.get(language, DISPLAY_NAMES["en"])

    sections = {
        "severity": "",
        "symptoms": [],
        "actions": [],
        "tip": "",
    }

    current = None

    for raw_line in raw_text.splitlines():
        line = raw_line.strip()

        if not line:
            continue

        upper = line.upper()

        if upper.startswith("SEVERITY:"):
            current = "severity"
            sections["severity"] = line.split(":", 1)[1].strip()

        elif upper.startswith("SYMPTOMS:"):
            current = "symptoms"

        elif upper.startswith("ACTIONS:"):
            current = "actions"

        elif upper.startswith("TIP:"):
            current = "tip"

        elif current == "symptoms":
            sections["symptoms"].append(line.lstrip(chr(92) + "- ").strip())

        elif current == "actions":
            sections["actions"].append(line.lstrip(chr(92) + "- ").strip())

        elif current == "tip":
            if sections["tip"]:
                sections["tip"] += " " + line.lstrip(chr(92) + "- ").strip()
            else:
                sections["tip"] = line.lstrip(chr(92) + "- ").strip()

    if "__" in detected_label:
        crop_key, problem_key = detected_label.split("__", 1)
    else:
        crop_key = detected_label
        problem_key = "needs_confirmation"

    crop = names.get(crop_key.lower(), crop_key)
    problem = names.get(problem_key.lower(), problem_key)

    result = [
        f"{labels['crop']}: {crop}",
        f"{labels['problem']}: {problem}",
        f"{labels['confidence']}: {confidence:.0%}",
        f"{labels['severity']}: {sections['severity'] or names.get('needs_confirmation', 'Needs confirmation')}",
        "",
        f"{labels['symptoms']}:",
    ]

    for item in sections["symptoms"]:
        result.append(f"- {item}")

    result.extend([
        "",
        f"{labels['action']}:",
    ])

    for item in sections["actions"]:
        result.append(f"- {item}")

    result.extend([
        "",
        f"{labels['tip']}:",
        f"- {sections['tip'] or names.get('needs_confirmation', 'Needs confirmation')}",
    ])

    return "\n".join(result)









