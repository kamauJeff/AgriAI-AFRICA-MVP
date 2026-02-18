import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFarmForecast } from '@/api/endpoints/weather';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  farmId: string;
}

export default function ForecastCard({ farmId }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['forecast', farmId],
    queryFn: () => getFarmForecast(farmId),
    enabled: !!farmId,
    retry: 1,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>5-Day Forecast</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {[1,2,3,4,5].map(i => (
              <Skeleton key={i} className="h-24 w-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.data?.length) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to load weather forecast. Please check your location settings.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {data.data.map((day: any) => (
            <div key={day.date} className="min-w-[100px] text-center p-2 border rounded-lg">
              <p className="font-medium">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <img 
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                alt={day.description}
                className="w-12 h-12 mx-auto"
              />
              <p className="text-lg font-bold">{Math.round(day.temp)}°C</p>
              <p className="text-xs text-muted-foreground capitalize truncate">
                {day.description}
              </p>
              {day.rain > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  {day.rain}mm rain
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}