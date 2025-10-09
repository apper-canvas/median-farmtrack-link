const delay = () => new Promise(resolve => setTimeout(resolve, 500));

const mockWeatherData = {
  current: {
    temp: 72,
    feelsLike: 70,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 8,
    precipitation: 20,
    icon: "Cloud"
  },
  forecast: [
    {
      day: "Today",
      high: 75,
      low: 62,
      condition: "Partly Cloudy",
      precipitation: 20,
      icon: "Cloud"
    },
    {
      day: "Tomorrow",
      high: 78,
      low: 64,
      condition: "Sunny",
      precipitation: 10,
      icon: "Sun"
    },
    {
      day: "Thursday",
      high: 73,
      low: 60,
      condition: "Rain",
      precipitation: 80,
      icon: "CloudRain"
    },
    {
      day: "Friday",
      high: 70,
      low: 58,
      condition: "Cloudy",
      precipitation: 40,
      icon: "Cloud"
    },
    {
      day: "Saturday",
      high: 76,
      low: 61,
      condition: "Sunny",
      precipitation: 5,
      icon: "Sun"
    }
  ]
};

const weatherService = {
  getCurrent: async () => {
    await delay();
    return { ...mockWeatherData.current };
  },

  getForecast: async () => {
    await delay();
    return [...mockWeatherData.forecast];
  },

  getAll: async () => {
    await delay();
    return {
      current: { ...mockWeatherData.current },
      forecast: [...mockWeatherData.forecast]
    };
  }
};

export default weatherService;