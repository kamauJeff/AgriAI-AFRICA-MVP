import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFarmForecast } from '@/api/endpoints/weather';

interface Props {
  farmId: string;
}

export default function ForecastCard({ farmId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['forecast', farmId],
    queryFn: () => getFarmForecast(farmId),
    enabled: !!farmId,
  });

  if (isLoading) return <div>Loading weather...</div>;
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4 overflow-x-auto">
        {data.data.map((day: any) => (
          <div key={day.date} className="min-w-[100px] text-center">
            <p className="font-medium">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <img src={`http://openweathermap.org/img/wn/${day.icon}.png`} alt={day.description} className="mx-auto" />
            <p>{day.temp}°C</p>
            <p className="text-sm text-muted-foreground capitalize">{day.description}</p>
            {day.rain > 0 && <p className="text-xs">Rain: {day.rain}mm</p>}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}