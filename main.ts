import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import "https://deno.land/std@0.207.0/dotenv/load.ts";

const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
if (!OPENWEATHER_API_KEY) {
  console.error("OPENWEATHER_API_KEY environment variable is not set");
  Deno.exit(1);
}

interface WeatherData {
  date: string;
  temperature: number;
  conditions: string;
}

const router = new Router();

router.get("/api/weather/:city", async (ctx) => {
  const city = ctx.params.city?.trim();
  if (!city) {
    ctx.response.status = 400;
    ctx.response.body = { error: "City parameter is required" };
    return;
  }

  const unit = ctx.request.url.searchParams.get("unit");
  if (unit && !["C", "F"].includes(unit)) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Unit must be either 'C' or 'F'" };
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=${unit === 'C' ? 'metric' : 'imperial'}`
    );
    
    if (!response.ok) {
      ctx.response.status = 404;
      ctx.response.body = { error: "City not found" };
      return;
    }

    const data = await response.json();
    
    const dailyForecasts = data.list.reduce((acc: WeatherData[], curr: any) => {
      const date = new Date(curr.dt * 1000).toISOString().split('T')[0];
      if (!acc.find(f => f.date === date) && acc.length < 5) {
        acc.push({
          date,
          temperature: curr.main.temp,
          conditions: curr.weather[0].description,
        });
      }
      return acc;
    }, []);

    ctx.response.body = dailyForecasts;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: "Failed to fetch weather data" };
  }
});

router.get("/", async (ctx) => {
  await ctx.send({
    root: `${Deno.cwd()}/public`,
    index: "index.html",
  });
});

const app = new Application();

// Serve static files from public directory
app.use(async (ctx, next) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

// Error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
});

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

const port = 8000;
console.log(`Server running on http://localhost:${port}`);
await app.listen({ port }); 