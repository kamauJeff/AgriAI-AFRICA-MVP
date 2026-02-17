import axios from 'axios';

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface ForecastDay {
  date: string;
  temp: number; // in Celsius
  description: string;
  icon: string;
  rain?: number; // mm
}

export async function getForecast(lat: number, lon: number): Promise<ForecastDay[]> {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await axios.get(url);
  // Process response – group by day, take one per day (simplified)
  const dailyData: Record<string, any> = {};
  response.data.list.forEach((item: any) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        temp: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        rain: item.rain ? item.rain['3h'] : 0,
      };
    }
  });
  return Object.values(dailyData).slice(0, 5); // 5 days
}