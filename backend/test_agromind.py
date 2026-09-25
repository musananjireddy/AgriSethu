import json
import torch
import timm
from PIL import Image
from torchvision import transforms
from safetensors.torch import load_file
from huggingface_hub import hf_hub_download

REPO = "Arko007/agromind-plant-disease-nfnet"

model_path = hf_hub_download(REPO, "model.safetensors")
config_path = hf_hub_download(REPO, "config.json")

with open(config_path, encoding="utf-8") as f:
    config = json.load(f)

model = timm.create_model(
    config["architecture"],
    pretrained=False,
    num_classes=config["num_classes"],
)

model.load_state_dict(load_file(model_path))
model.eval()

transform = transforms.Compose([
    transforms.Resize((512, 512)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.5, 0.5, 0.5],
        std=[0.5, 0.5, 0.5],
    ),
])

image_path = r"C:\Users\Anji Reddy\Downloads\Potato-leaf-blight_disease.webp"
image = Image.open(image_path).convert("RGB")

with torch.no_grad():
    output = model(transform(image).unsqueeze(0))
    probabilities = torch.softmax(output, dim=1)[0]
    confidence, index = torch.max(probabilities, dim=0)

label = config["class_names"][index.item()]

print("MODEL LOADED")
print("PREDICTION:", label)
print("CONFIDENCE:", f"{confidence.item():.2%}")
