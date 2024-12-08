const { useState } = React;
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

function WeatherApp() {
    const [city, setCity] = useState('');
    const [unit, setUnit] = useState('C');
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getUnitName = (u) => u === 'C' ? 'Celsius' : 'Fahrenheit';

    const toggleUnit = () => {
        const newUnit = unit === 'C' ? 'F' : 'C';
        setUnit(newUnit);
        if (city.trim() && weatherData) {
            fetchWeather(newUnit);
        }
    };

    const fetchWeather = async (currentUnit = unit) => {
        if (!city.trim()) {
            setError('Please enter a city');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/weather/${encodeURIComponent(city.trim())}?unit=${currentUnit}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Could not fetch weather data');
            }
            
            setWeatherData(data);
        } catch (err) {
            setError(err.message);
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    const formatDateShort = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(navigator.language, { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric'
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchWeather();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="weather-card">
                <h1 className="text-3xl font-bold mb-6 text-center">Weather Forecast</h1>
                
                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter city"
                        className="flex-1 p-2 border rounded"
                    />
                    
                    <div 
                        onClick={toggleUnit} 
                        className={`
                            relative w-16 h-8 rounded-full cursor-pointer
                            flex items-center p-1
                            ${unit === 'C' ? 'bg-green-500' : 'bg-gray-300'}
                        `}
                    >
                        <div className={`
                            absolute w-6 h-6 bg-white rounded-full shadow transition-transform
                            ${unit === 'C' ? 'translate-x-8' : 'translate-x-0'}
                        `}></div>
                        <span className={`
                            absolute w-full text-xs font-bold text-white
                            flex justify-between px-2
                        `}>
                            <span>°C</span>
                            <span>°F</span>
                        </span>
                    </div>

                    <button
                        onClick={() => fetchWeather()}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Show Weather
                    </button>
                </div>

                {error && (
                    <div className="text-red-500 text-center mb-4">{error}</div>
                )}

                {loading && (
                    <div className="text-center py-4">
                        <div className="loading">Loading weather data...</div>
                    </div>
                )}

                {weatherData && (
                    <div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer>
                                <LineChart data={weatherData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tickFormatter={formatDateShort} />
                                    <YAxis 
                                        label={{ 
                                            value: `Temperatur (°${unit})`, 
                                            angle: -90, 
                                            position: 'insideLeft' 
                                        }}
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="temperature"
                                        stroke="#2563eb"
                                        name={`Temperatur (°${unit})`}
                                        strokeWidth={2}
                                        dot={{ stroke: '#2563eb', strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-4 space-y-2">
                            {weatherData.map((day, idx) => (
                                <div key={idx} className="flex items-center justify-between border-b pb-2">
                                    <span className="font-medium">{formatDateShort(day.date)}</span>
                                    <div>
                                        <span>{day.temperature.toFixed(1)}°{unit}</span>
                                        <span className="ml-2">{day.conditions}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

ReactDOM.render(
    <WeatherApp />,
    document.getElementById('root')
); 