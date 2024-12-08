# Deno Weather App

## Deployment on Deno Deploy

1. Go to [Deno Deploy](https://deno.com/deploy)
2. Click "New Project"
3. Choose "Deploy from GitHub" and:
   - Select your repository
   - Select the branch (usually main)
   - Set production branch to main
   - Entry point: `main.ts`

### Environment Variables
Add the following environment variable in your Deno Deploy project settings:
```
OPENWEATHER_API_KEY=your_api_key_here
```

### Project Structure
Make sure your repository has this structure:
```
/
├── main.ts
├── public/
│   ├── index.html
│   └── app.js
└── .env  (for local development only)
```

## Setup og deployment

1. Opret en konto på [Deno Deploy](https://deno.com/deploy)

2. Installer Deno CLI hvis du ikke allerede har det:
   ```bash
   curl -fsSL https://deno.land/x/install/install.sh | sh
   ```

3. Opret en .env fil med din OpenWeatherMap API nøgle:
   ```
   OPENWEATHER_API_KEY=din_api_nøgle_her
   ```

4. Test lokalt:
   ```bash
   deno task start
   ```

5. Deploy til Deno Deploy:
   - Fork dette repository til GitHub
   - Gå til Deno Deploy
   - Klik "New Project"
   - Vælg dit GitHub repository
   - Tilføj Environment Variable "OPENWEATHER_API_KEY"
   - Deploy!

## Funktioner

- Søg efter vejrudsigt for enhver by
- Se 5-dages prognose
- Vælg mellem Celsius og Fahrenheit
- Interaktiv graf med temperaturudvikling
- Responsive design der virker på alle enheder
- Auto-detect user's city on load
- Toggle switch for temperature units
- Keyboard support (Enter to search)

## Tech Stack

- Deno + Oak (Backend)
- React (Frontend)
- Recharts (Grafer)
- TailwindCSS (Styling)
- IPInfo API (Location detection)

## Features

- 🌍 Automatic location detection using IP geolocation
- 🌡️ Toggle between Celsius and Fahrenheit
- 📊 Interactive temperature chart using Recharts
- 🔍 Search for any city worldwide
- 📱 Responsive design with Tailwind CSS
- 🌐 Localized date formatting based on user's browser settings

## Prerequisites

- [Deno](https://deno.land/) installed on your machine
- OpenWeather API key (get one at [OpenWeather](https://openweathermap.org/api))

## Installation

1. Clone the repository: 