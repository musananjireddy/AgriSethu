import { useRef, useState } from 'react'
import {
  Leaf,
  Camera,
  Sprout,
  CloudSun,
  TrendingUp,
  MessageCircle,
} from 'lucide-react'
import './App.css'
import { getWeather, getMarket } from './services/farmApi'

const copy = {
  en: {
    brandName: 'AgriSethu',
    heading: 'How can we help you today?',
    support: 'Get simple help for your crop, weather, and market information.',
    checkCrop: 'Check My Crop',
    weather: {
      title: 'Weather',
      temperature: 'Temperature',
      humidity: 'Humidity',
      condition: 'Weather',
      wind: 'Wind',
      rain: 'Rain (last 1h)',
    },
    market: {
      title: 'Market Prices',
      market: 'Market',
      average: 'Average Price',
      minimum: 'Minimum',
      maximum: 'Maximum',
      trend: 'Trend',
      latestDate: 'Latest Date',
    },
    chat: {
      title: 'Farmer Chat',
      close: 'Close',
    },
    cards: [
      { title: 'Crop Health', text: 'Check your crop' },
      { title: 'Weather', text: 'Know your farm weather' },
      { title: 'Market Prices', text: 'See current prices' },
      { title: 'Farmer Chat', text: 'Ask your farming questions' },
    ],
  },
  te: {
    brandName: '\u0c05\u0c17\u0c4d\u0c30\u0c3f\u0c38\u0c47\u0c24\u0c41',
    heading: '\u0c08\u0c30\u0c4b\u0c1c\u0c41 \u0c2e\u0c47\u0c2e\u0c41 \u0c2e\u0c40\u0c15\u0c41 \u0c0e\u0c32\u0c3e \u0c38\u0c39\u0c3e\u0c2f\u0c02 \u0c1a\u0c47\u0c2f\u0c17\u0c32\u0c2e\u0c41?',
    support: '\u0c2e\u0c40 \u0c2a\u0c02\u0c1f, \u0c35\u0c3e\u0c24\u0c3e\u0c35\u0c30\u0c23\u0c02 \u0c2e\u0c30\u0c3f\u0c2f\u0c41 \u0c2e\u0c3e\u0c30\u0c4d\u0c15\u0c46\u0c1f\u0c4d \u0c38\u0c2e\u0c3e\u0c1a\u0c3e\u0c30\u0c02 \u0c15\u0c4b\u0c38\u0c02 \u0c38\u0c41\u0c32\u0c2d\u0c2e\u0c48\u0c28 \u0c38\u0c39\u0c3e\u0c2f\u0c02 \u0c2a\u0c4a\u0c02\u0c26\u0c02\u0c21\u0c3f.',
    checkCrop: '\u0c28\u0c3e \u0c2a\u0c02\u0c1f\u0c28\u0c41 \u0c2a\u0c30\u0c3f\u0c36\u0c40\u0c32\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f',
    weather: {
      title: '\u0c35\u0c3e\u0c24\u0c3e\u0c35\u0c30\u0c23\u0c02',
      temperature: '\u0c09\u0c37\u0c4d\u0c23\u0c4b\u0c17\u0c4d\u0c30\u0c24',
      humidity: '\u0c24\u0c47\u0c2e',
      condition: '\u0c35\u0c3e\u0c24\u0c3e\u0c35\u0c30\u0c23 \u0c2a\u0c30\u0c3f\u0c38\u0c4d\u0c25\u0c3f\u0c24\u0c3f',
      wind: '\u0c17\u0c3e\u0c32\u0c3f \u0c35\u0c47\u0c17\u0c02',
      rain: '\u0c35\u0c30\u0c4d\u0c37\u0c2a\u0c3e\u0c24\u0c02 (1 \u0c17\u0c02\u0c1f\u0c32\u0c4b)',
    },
    market: {
      title: '\u0c2e\u0c3e\u0c30\u0c4d\u0c15\u0c46\u0c1f\u0c4d \u0c27\u0c30\u0c32\u0c41',
      market: '\u0c2e\u0c3e\u0c30\u0c4d\u0c15\u0c46\u0c1f\u0c4d',
      average: '\u0c38\u0c3e\u0c27\u0c3e\u0c30\u0c23 \u0c27\u0c30',
      minimum: '\u0c15\u0c28\u0c40\u0c38 \u0c27\u0c30',
      maximum: '\u0c17\u0c30\u0c3f\u0c37\u0c4d\u0c20 \u0c27\u0c30',
      trend: '\u0c27\u0c4b\u0c30\u0c23\u0c3f',
      latestDate: '\u0c07\u0c24\u0c40\u0c35\u0c32\u0c3f \u0c24\u0c47\u0c26\u0c40',
    },
    chat: {
      title: '\u0c30\u0c48\u0c24\u0c41 \u0c38\u0c39\u0c3e\u0c2f\u0c15\u0c41\u0c21\u0c3f\u0c24\u0c4b \u0c1a\u0c3e\u0c1f\u0c4d',
      close: '\u0c2e\u0c42\u0c38\u0c3f\u0c35\u0c47\u0c2f\u0c02\u0c21\u0c3f',
    },
    cards: [
      { title: '\u0c2a\u0c02\u0c1f \u0c06\u0c30\u0c4b\u0c17\u0c4d\u0c2f\u0c02', text: '\u0c2e\u0c40 \u0c2a\u0c02\u0c1f\u0c28\u0c41 \u0c2a\u0c30\u0c3f\u0c36\u0c40\u0c32\u0c3f\u0c02\u0c1a\u0c02\u0c21\u0c3f' },
      { title: '\u0c35\u0c3e\u0c24\u0c3e\u0c35\u0c30\u0c23\u0c02', text: '\u0c2e\u0c40 \u0c35\u0c4d\u0c2f\u0c35\u0c38\u0c3e\u0c2f \u0c35\u0c3e\u0c24\u0c3e\u0c35\u0c30\u0c23\u0c3e\u0c28\u0c4d\u0c28\u0c3f \u0c24\u0c46\u0c32\u0c41\u0c38\u0c41\u0c15\u0c4b\u0c02\u0c21\u0c3f' },
      { title: '\u0c2e\u0c3e\u0c30\u0c4d\u0c15\u0c46\u0c1f\u0c4d \u0c27\u0c30\u0c32\u0c41', text: '\u0c2a\u0c4d\u0c30\u0c38\u0c4d\u0c24\u0c41\u0c24 \u0c27\u0c30\u0c32\u0c28\u0c41 \u0c1a\u0c42\u0c21\u0c02\u0c21\u0c3f' },
      { title: '\u0c30\u0c48\u0c24\u0c41 \u0c38\u0c39\u0c3e\u0c2f\u0c15\u0c41\u0c21\u0c41', text: '\u0c2e\u0c40 \u0c35\u0c4d\u0c2f\u0c35\u0c38\u0c3e\u0c2f \u0c2a\u0c4d\u0c30\u0c36\u0c4d\u0c28\u0c32\u0c28\u0c41 \u0c05\u0c21\u0c17\u0c02\u0c21\u0c3f' },
    ],
  },
  hi: {
    brandName: '\u090f\u0917\u094d\u0930\u093f\u0938\u0947\u0924\u0941',
    heading: '\u0906\u091c \u0939\u092e \u0906\u092a\u0915\u0940 \u0915\u0948\u0938\u0947 \u092e\u0926\u0926 \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902?',
    support: '\u0905\u092a\u0928\u0940 \u092b\u0938\u0932, \u092e\u094c\u0938\u092e \u0914\u0930 \u092c\u093e\u091c\u093e\u0930 \u0915\u0940 \u091c\u093e\u0928\u0915\u093e\u0930\u0940 \u0915\u0947 \u0932\u093f\u090f \u0906\u0938\u093e\u0928 \u092e\u0926\u0926 \u092a\u093e\u090f\u0902\u0964',
    checkCrop: '\u092e\u0947\u0930\u0940 \u092b\u0938\u0932 \u091c\u093e\u0902\u091a\u0947\u0902',
    weather: {
      title: '\u092e\u094c\u0938\u092e',
      temperature: '\u0924\u093e\u092a\u092e\u093e\u0928',
      humidity: '\u0928\u092e\u0940',
      condition: '\u092e\u094c\u0938\u092e \u0915\u0940 \u0938\u094d\u0925\u093f\u0924\u093f',
      wind: '\u0939\u0935\u093e \u0915\u0940 \u0917\u0924\u093f',
      rain: '\u092c\u093e\u0930\u093f\u0936 (1 \u0918\u0902\u091f\u0947 \u092e\u0947\u0902)',
    },
    market: {
      title: '\u092c\u093e\u091c\u093e\u0930 \u092d\u093e\u0935',
      market: '\u092c\u093e\u091c\u093e\u0930',
      average: '\u0914\u0938\u0924 \u092d\u093e\u0935',
      minimum: '\u0928\u094d\u092f\u0942\u0928\u0924\u092e',
      maximum: '\u0905\u0927\u093f\u0915\u0924\u092e',
      trend: '\u0930\u0941\u091d\u093e\u0928',
      latestDate: '\u0928\u0935\u0940\u0928\u0924\u092e \u0924\u093e\u0930\u0940\u0916',
    },
    chat: {
      title: '\u0915\u093f\u0938\u093e\u0928 \u091a\u0948\u091f',
      close: '\u092c\u0902\u0926 \u0915\u0930\u0947\u0902',
    },
    cards: [
      { title: '\u092b\u0938\u0932 \u0938\u094d\u0935\u093e\u0938\u094d\u0925\u094d\u092f', text: '\u0905\u092a\u0928\u0940 \u092b\u0938\u0932 \u0915\u0940 \u091c\u093e\u0902\u091a \u0915\u0930\u0947\u0902' },
      { title: '\u092e\u094c\u0938\u092e', text: '\u0905\u092a\u0928\u0947 \u0916\u0947\u0924 \u0915\u093e \u092e\u094c\u0938\u092e \u091c\u093e\u0928\u0947\u0902' },
      { title: '\u092c\u093e\u091c\u093e\u0930 \u092d\u093e\u0935', text: '\u0935\u0930\u094d\u0924\u092e\u093e\u0928 \u092d\u093e\u0935 \u0926\u0947\u0916\u0947\u0902' },
      { title: '\u0915\u093f\u0938\u093e\u0928 \u0938\u0939\u093e\u092f\u0915', text: '\u0905\u092a\u0928\u0947 \u0916\u0947\u0924\u0940 \u0915\u0947 \u0938\u0935\u093e\u0932 \u092a\u0942\u091b\u0947\u0902' },
    ],
  },
}

const analysisUi = {
  en: {
    kicker: 'AI CROP HEALTH',
    title: 'Crop Analysis',
    completed: '✓ Completed',
    analyze: 'Analyze Crop',
    analyzing: 'Analyzing...',
    listen: '🔊 Listen',
    pause: '⏸ Pause',
    resume: '▶ Resume',
    restart: '↻ Restart',
    stop: '⏹ Stop',
  },
  te: {
    kicker: 'AI పంట ఆరోగ్యం',
    title: 'పంట విశ్లేషణ',
    completed: '✓ పూర్తయింది',
    analyze: 'పంటను విశ్లేషించండి',
    analyzing: 'విశ్లేషిస్తోంది...',
    listen: '🔊 వినండి',
    pause: '⏸ ఆపండి',
    resume: '▶ కొనసాగించండి',
    restart: '↻ మొదటి నుండి',
    stop: '⏹ ఆపివేయండి',
  },
  hi: {
    kicker: 'AI फसल स्वास्थ्य',
    title: 'फसल विश्लेषण',
    completed: '✓ पूरा हुआ',
    analyze: 'फसल की जांच करें',
    analyzing: 'जांच की जा रही है...',
    listen: '🔊 सुनें',
    pause: '⏸ रोकें',
    resume: '▶ जारी रखें',
    restart: '↻ फिर से शुरू करें',
    stop: '⏹ रोकें',
  },
}
const cardMeta = [
  { icon: Sprout, className: 'health' },
  { icon: CloudSun, className: 'weather' },
  { icon: TrendingUp, className: 'market' },
  { icon: MessageCircle, className: 'chat' },
]

function App() {
  const teluguAudioRef = useRef(null)
  const [language, setLanguage] = useState('en')
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [analysisMessage, setAnalysisMessage] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSpeechPaused, setIsSpeechPaused] = useState(false)
  const [cropHealthOpen, setCropHealthOpen] = useState(false)
  const [weatherData, setWeatherData] = useState(null)
  const [marketData, setMarketData] = useState(null)
  const [activeFeature, setActiveFeature] = useState('')
  const [farmDataLoading, setFarmDataLoading] = useState(false)
  const [farmDataError, setFarmDataError] = useState('')
  const [weatherCity, setWeatherCity] = useState('Hyderabad')
  const [marketCommodity, setMarketCommodity] = useState('Tomato')
  const [marketState, setMarketState] = useState('Telangana')

  const text = copy[language]

  const loadWeather = async () => {
    setActiveFeature('weather')
    setFarmDataLoading(true)
    setFarmDataError('')

    try {
      const data = await getWeather(weatherCity)
      setWeatherData(data)
    } catch (error) {
      console.error('Weather error:', error)
      setFarmDataError('Unable to load weather data.')
    } finally {
      setFarmDataLoading(false)
    }
  }

  const loadMarket = async () => {
    setActiveFeature('market')
    setFarmDataLoading(true)
    setFarmDataError('')

    try {
      const data = await getMarket(marketCommodity, marketState)
      setMarketData(data)
    } catch (error) {
      console.error('Market error:', error)
      setFarmDataError('Unable to load market data.')
    } finally {
      setFarmDataLoading(false)
    }
  }

  const analyzeCrop = async () => {
    if (isAnalyzing) return
    if (!selectedFile) {
      setAnalysisMessage('Please upload a crop image first.')
      return
    }

    setIsAnalyzing(true)
    setAnalysisMessage('Analyzing your crop...')

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('language', language)

    try {
      const response = await fetch('http://localhost:8000/api/crop/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      const analysisText = data.analysis || data.message || 'Crop analysis completed.'
      const cropMatch = analysisText.match(/^(?:Crop|పంట|फसल)\s*:\s*(.+)$/im)
      if (cropMatch) {
        const detectedCrop = cropMatch[1].replace(/\*\*/g, '').trim()
        setMarketCommodity(detectedCrop)
      }

      setMarketData(null)
      setActiveFeature('')
      setFarmDataError('')

      setAnalysisMessage(
        data.analysis || data.message || 'Crop analysis completed.'
      )
    } catch (error) {
      console.error('Crop analysis error:', error)
      setAnalysisMessage('Crop analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const speakAnalysis = async () => {
    if (!analysisMessage) return

    if (language === 'te') {
      try {
        window.speechSynthesis?.cancel()
        if (teluguAudioRef.current) {
          teluguAudioRef.current.pause()
          teluguAudioRef.current.currentTime = 0
        }

        setIsSpeaking(false)
        setIsSpeechPaused(false)

        const formData = new FormData()
        formData.append(
          'text',
          analysisMessage.replace(/\r?\n/g, '. ')
        )

        const response = await fetch('http://127.0.0.1:8000/api/tts/telugu', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Telugu TTS request failed')
        }

        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)

        teluguAudioRef.current = audio

        audio.onplay = () => {
          setIsSpeaking(true)
          setIsSpeechPaused(false)
        }

        audio.onpause = () => {
          if (!audio.ended) {
            setIsSpeaking(false)
            setIsSpeechPaused(true)
          }
        }

        audio.onended = () => {
          setIsSpeaking(false)
          setIsSpeechPaused(false)
          URL.revokeObjectURL(audioUrl)
        }

        audio.onerror = () => {
          setIsSpeaking(false)
          setIsSpeechPaused(false)
          URL.revokeObjectURL(audioUrl)
        }

        await audio.play()
      } catch (error) {
        console.error('Telugu TTS error:', error)
        setIsSpeaking(false)
        setIsSpeechPaused(false)
      }

      return
    }

    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsSpeechPaused(false)

    const speechLanguages = {
      en: 'en-IN',
      hi: 'hi-IN',
    }

    const targetLanguage = speechLanguages[language] || 'en-IN'

    const startSpeech = () => {
      const voices = window.speechSynthesis.getVoices()

      const matchingVoice =
        voices.find(
          (voice) =>
            voice.lang.toLowerCase() === targetLanguage.toLowerCase()
        ) ||
        voices.find(
          (voice) =>
            voice.lang
              .toLowerCase()
              .startsWith(targetLanguage.split('-')[0])
        )

      const utterance = new SpeechSynthesisUtterance(
        analysisMessage.replace(/\r?\n/g, '. ')
      )

      utterance.lang = targetLanguage
      utterance.voice = matchingVoice || null
      utterance.rate = language === 'hi' ? 0.86 : 0.9
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => {
        setIsSpeaking(true)
        setIsSpeechPaused(false)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setIsSpeechPaused(false)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
        setIsSpeechPaused(false)
      }

      window.speechSynthesis.speak(utterance)
    }

    const voices = window.speechSynthesis.getVoices()

    if (voices.length > 0) {
      startSpeech()
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null
        startSpeech()
      }
    }
  }

  const pauseAnalysis = () => {
    if (language === 'te') {
      const audio = teluguAudioRef.current

      if (audio && !audio.paused && !audio.ended) {
        audio.pause()
        setIsSpeaking(false)
        setIsSpeechPaused(true)
      }

      return
    }

    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause()
      setIsSpeaking(false)
      setIsSpeechPaused(true)
    }
  }

  const resumeAnalysis = () => {
    if (!isSpeechPaused) return

    if (language === 'te') {
      const audio = teluguAudioRef.current

      if (audio && audio.paused && !audio.ended) {
        audio.play()
          .then(() => {
            setIsSpeaking(true)
            setIsSpeechPaused(false)
          })
          .catch((error) => {
            console.error('Telugu audio resume error:', error)
          })
      }

      return
    }

    if (!('speechSynthesis' in window)) return

    const synth = window.speechSynthesis
    synth.resume()

    setTimeout(() => {
      synth.resume()
      setIsSpeaking(true)
      setIsSpeechPaused(false)
    }, 100)
  }

  const stopAnalysis = () => {
    if (language === 'te') {
      const audio = teluguAudioRef.current

      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }

      setIsSpeaking(false)
      setIsSpeechPaused(false)
      return
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setIsSpeechPaused(false)
    }
  }

  const restartAnalysis = () => {
    if (!analysisMessage) return

    if (language === 'te') {
      const audio = teluguAudioRef.current

      if (audio) {
        audio.pause()
        audio.currentTime = 0
        audio.play()
          .then(() => {
            setIsSpeaking(true)
            setIsSpeechPaused(false)
          })
          .catch((error) => {
            console.error('Telugu audio restart error:', error)
          })
      } else {
        speakAnalysis()
      }

      return
    }

    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsSpeechPaused(false)

    setTimeout(() => {
      speakAnalysis()
    }, 150)
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]

    if (file) {
      setSelectedFile(file)
      setSelectedImage(URL.createObjectURL(file))
      setAnalysisMessage('')
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">
            <Leaf size={26} strokeWidth={2.2} />
          </span>
          <h1 className="brand-name">{text.brandName}</h1>
        </div>

        <select
          className="language"
          value={language}
          aria-label="Language"
          onChange={(event) => setLanguage(event.target.value)}
        >
          <option value="en">English</option>
          <option value="te">{'\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41'}</option>
          <option value="hi">{'\u0939\u093f\u0902\u0926\u0940'}</option>
        </select>
      </header>

      <section className="welcome">
        <h2>{text.heading}</h2>
        <p>{text.support}</p>
      </section>


      <section id="crop-health">
        <button
          type="button"
          className="main-action"
          onClick={() => document.getElementById('crop-upload').click()}
        >
          <Camera size={32} strokeWidth={2.3} aria-hidden="true" />
          {text.checkCrop}
        </button>

        <input
          id="crop-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {selectedImage && (
          <section className="crop-preview">
            <img src={selectedImage} alt="Selected crop" />
          </section>
        )}

        <button
          type="button"
          className="analyze-button"
          onClick={analyzeCrop}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? analysisUi[language].analyzing : analysisUi[language].analyze}
        </button>

        {analysisMessage && (
          <div className="analysis-result">
            <div className="analysis-result-header">
              <div>
                <span className="analysis-kicker">{analysisUi[language].kicker}</span>
                <h3>{analysisUi[language].title}</h3>
              </div>
              <span className="analysis-status">{analysisUi[language].completed}</span>
            </div>

            <div className="analysis-voice-controls">
              <button
                type="button"
                className="voice-control listen"
                onClick={speakAnalysis}
                disabled={!analysisMessage || isSpeaking}
              >
                {analysisUi[language].listen}
              </button>

              <button
                type="button"
                className="voice-control"
                onClick={pauseAnalysis}
                disabled={!isSpeaking}
              >
                {analysisUi[language].pause}
              </button>

              <button
                type="button"
                className="voice-control"
                onClick={resumeAnalysis}
                disabled={isSpeaking || !analysisMessage}
              >
                {analysisUi[language].resume}
              </button>

              <button
                type="button"
                className="voice-control"
                onClick={restartAnalysis}
                disabled={!analysisMessage}
              >
                {analysisUi[language].restart}
              </button>

              <button
                type="button"
                className="voice-control"
                onClick={stopAnalysis}
                disabled={!isSpeaking}
              >
                {analysisUi[language].stop}
              </button>
            </div>
            <div className="analysis-text">
              {analysisMessage.split(/\r?\n/).map((line, index) => {
                const trimmed = line.trim()

                if (!trimmed) {
                  return <div key={index} className="analysis-spacer" />
                }

                const match = trimmed.match(/^([^:]+):\s*(.*)$/)

                if (match && ['Crop', 'Possible Problem', 'Confidence', 'Severity', 'పంట', 'సంభావ్య సమస్య', 'నమ్మకస్థాయి', 'తీవ్రత', 'फसल', 'संभावित समस्या', 'विश्वास स्तर', 'गंभीरता'].includes(match[1])) {
                  return (
                    <div key={index} className="analysis-info-row">
                      <span>{match[1]}</span>
                      <strong>{match[2]}</strong>
                    </div>
                  )
                }

                if (trimmed === 'Visible Symptoms:' || trimmed === 'Recommended Action:' || trimmed === 'Farmer Tip:' || trimmed === 'కనిపించే లక్షణాలు:' || trimmed === 'సిఫార్సు చేసిన చర్యలు:' || trimmed === 'రైతు సూచన:' || trimmed === 'दिखाई देने वाले लक्षण:' || trimmed === 'अनुशंसित कार्रवाई:' || trimmed === 'किसान के लिए सुझाव:') {
                  return (
                    <h4 key={index} className="analysis-section-title">
                      {trimmed}
                    </h4>
                  )
                }

                if (trimmed.startsWith('-') || trimmed.startsWith('\-')) {
                  return (
                    <div key={index} className="analysis-bullet">
                      <span>•</span>
                      <p>{trimmed.replace(/^\-/, '').trim()}</p>
                    </div>
                  )
                }

                return <p key={index} className="analysis-paragraph">{trimmed}</p>
              })}
            </div>
          </div>
        )}
      </section>
      <section className="cards" aria-label="Features">
        {text.cards.slice(1).map((card, index) => {
          const Icon = cardMeta[index + 1].icon

          return (
            <button type="button" className="card" key={card.title} onClick={() => { if (index === 0) loadWeather(); if (index === 1) loadMarket(); if (index === 2) setActiveFeature('chat') }}>
              <span
                className={`card-icon ${cardMeta[index + 1].className}`}
                aria-hidden="true"
              >
                <Icon size={26} strokeWidth={2.2} />
              </span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </button>
          )
        })}
      </section>

      {activeFeature === 'chat' && (
        <section className="chat-panel">
          <div className="chat-panel-header">
            <h3>{text.chat.title}</h3>
            <button type="button" onClick={() => setActiveFeature('')}>{text.chat.close}</button>
          </div>
          <iframe
            title="Farmer Chatbot"
            src={`http://127.0.0.1:5000/?lang=${language}`}
            className="chat-frame" allow="microphone"
          />
        </section>
      )}

      {(farmDataLoading || farmDataError || weatherData || marketData) && (
        <section className="farm-data-panel">
          {farmDataLoading && <p className="farm-data-message">Loading...</p>}

          {farmDataError && <p className="farm-data-error">{farmDataError}</p>}

          {!farmDataLoading && activeFeature === 'weather' && weatherData && (
            <div>
              <h3>{text.weather.title} — {weatherData.location}</h3>
              <p>{text.weather.temperature}: {weatherData.temperature_c} °C</p>
              <p>{text.weather.humidity}: {weatherData.humidity_percent}%</p>
              <p>{text.weather.condition}: {weatherData.weather}</p>
              <p>{text.weather.wind}: {weatherData.wind_speed_mps} m/s</p>
              <p>{text.weather.rain}: {weatherData.rain_last_1h_mm} mm</p>
            </div>
          )}

          {!farmDataLoading && activeFeature === 'market' && marketData && (
            <div>
              <h3>{text.market.title} — {marketData.commodity} — {marketData.state}</h3>
              <p>{text.market.market}: {marketData.market}</p>
              <p>{text.market.average}: ₹{marketData.modal_price_average}</p>
              <p>{text.market.minimum}: ₹{marketData.modal_price_min}</p>
              <p>{text.market.maximum}: ₹{marketData.modal_price_max}</p>
              <p>{text.market.trend}: {marketData.trend}</p>
              <p>{text.market.latestDate}: {marketData.latest_arrival_date}</p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

export default App










































