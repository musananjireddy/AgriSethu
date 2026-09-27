export async function getWeather(city) {
  const response = await fetch(
    `https://musananjireddy--agrisethu-farm-api-api.modal.run/weather?city=${encodeURIComponent(city)}`
  )

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`)
  }

  return response.json()
}

export async function getMarket(commodity, state) {
  const marketCropMap = { '?????': 'Tomato', '?????': 'Tomato', '??????????': 'Potato', '??????????': 'Maize', '?????': 'Tomato', '???': 'Potato' }
  commodity = marketCropMap[commodity] || commodity
  const response = await fetch(
    `https://musananjireddy--agrisethu-farm-api-api.modal.run/market?commodity=${encodeURIComponent(commodity)}&state=${encodeURIComponent(state)}`
  )

  if (!response.ok) {
    throw new Error(`Market API error: ${response.status}`)
  }

  return response.json()
}

