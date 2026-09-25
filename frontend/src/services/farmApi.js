export async function getWeather(city) {
  const response = await fetch(
    `/farm-api/weather?city=${encodeURIComponent(city)}`
  )

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`)
  }

  return response.json()
}

export async function getMarket(commodity, state) {
  const response = await fetch(
    `/farm-api/market?commodity=${encodeURIComponent(commodity)}&state=${encodeURIComponent(state)}`
  )

  if (!response.ok) {
    throw new Error(`Market API error: ${response.status}`)
  }

  return response.json()
}
