import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import weatherService from "@/services/api/weatherService";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await weatherService.getAll();
      setWeather(data.current);
      setForecast(data.forecast);
    } catch (error) {
      setError("Failed to load weather data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading text="Loading weather..." />;
  if (error) return <Error message={error} onRetry={loadWeather} />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Weather</h1>

      {weather && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Current Conditions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-info/10 rounded-2xl flex items-center justify-center">
                <ApperIcon name={weather.icon} size={64} className="text-info" />
              </div>
              <div>
                <p className="text-6xl font-bold text-gray-900">{weather.temp}°F</p>
                <p className="text-2xl text-gray-600 mt-2">{weather.condition}</p>
                <p className="text-lg text-gray-500 mt-1">
                  Feels like {weather.feelsLike}°F
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="Droplets" size={20} className="text-info" />
                  <span className="text-sm text-gray-600">Humidity</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{weather.humidity}%</p>
              </div>

              <div className="p-4 bg-surface rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="Wind" size={20} className="text-info" />
                  <span className="text-sm text-gray-600">Wind Speed</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{weather.windSpeed} mph</p>
              </div>

              <div className="p-4 bg-surface rounded-lg col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="CloudRain" size={20} className="text-info" />
                  <span className="text-sm text-gray-600">Precipitation Chance</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{weather.precipitation}%</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">5-Day Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {forecast.map((day, index) => (
            <Card key={index} hover>
              <div className="text-center space-y-3">
                <p className="font-bold text-gray-900">{day.day}</p>
                <div className="w-16 h-16 bg-info/10 rounded-lg flex items-center justify-center mx-auto">
                  <ApperIcon name={day.icon} size={32} className="text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{day.high}°</p>
                  <p className="text-gray-500">{day.low}°</p>
                </div>
                <p className="text-sm text-gray-600">{day.condition}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <ApperIcon name="Droplets" size={16} />
                  <span>{day.precipitation}%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Info" size={24} className="text-warning" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Weather Planning Tips</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <ApperIcon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Plan irrigation based on precipitation forecasts to conserve water</span>
              </li>
              <li className="flex items-start gap-2">
                <ApperIcon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Schedule outdoor tasks during optimal temperature and wind conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <ApperIcon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Monitor humidity levels to prevent fungal diseases in crops</span>
              </li>
              <li className="flex items-start gap-2">
                <ApperIcon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span>Adjust planting and harvesting schedules based on extended forecasts</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Weather;