// api/endpoints/weather.ts
export async function getFarmForecast(farmId: string) {
  const response = await fetch(`/api/weather/forecast?farmId=${farmId}`);
  if (!response.ok) throw new Error('Failed to fetch');
  const data = await response.json();
  return data; // should have a `data` property containing an array of forecast days
}