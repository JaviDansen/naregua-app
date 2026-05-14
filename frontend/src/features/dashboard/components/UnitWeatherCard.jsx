import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import Card from '../../../components/ui/Card';
import Skeleton from '../../../components/ui/Skeleton';

const UNIT_WEATHER = {
  label: 'Sao Luis, MA',
  latitude: -2.5297,
  longitude: -44.3028,
};

const getWeatherDescription = (weathercode) => {
  if (weathercode === 0) {
    return '☀️ Ensolarado';
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(weathercode)) {
    return '🌧️ Chuvoso';
  }

  return '☁️ Nublado';
};

const UnitWeatherCard = () => {
  const { data: weather, isLoading } = useQuery({
    queryKey: ['weather', 'unit'],
    queryFn: async () => {
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${UNIT_WEATHER.latitude}&longitude=${UNIT_WEATHER.longitude}&current_weather=true`
      );

      return res.data;
    },
  });

  if (isLoading) {
    return <Skeleton className="h-24" />;
  }

  if (!weather?.current_weather) {
    return (
      <Card className="border border-zinc-800">
        <p className="text-zinc-400">
          Nao foi possivel carregar o clima da unidade.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border border-zinc-800">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-400">Clima da unidade</p>
          <p className="text-3xl font-bold mt-2">
            {weather.current_weather.temperature ?? '--'}°C
          </p>
          <p className="text-zinc-400 text-sm mt-1">
            Vento: {weather.current_weather.windspeed ?? '--'} km/h
          </p>
        </div>

        <div className="text-right">
          <p className="text-zinc-300 font-medium">
            {getWeatherDescription(weather.current_weather.weathercode)}
          </p>
          <p className="text-zinc-500 text-sm mt-1">{UNIT_WEATHER.label}</p>
          <p className="text-zinc-500 text-sm">Dados em tempo real</p>
        </div>
      </div>
    </Card>
  );
};

export default UnitWeatherCard;
