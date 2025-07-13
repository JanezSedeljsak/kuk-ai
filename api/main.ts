import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import { register, login } from './views/auth.ts';
import { saveRecipe, getMyRecipes } from './views/recipes.ts';
import { generateRecipe, refineRecipe } from './views/ai.ts';

const app = new Hono();

app.use('/*', cors());

app.get('/api/v1/health', (c) => {
  return c.json({
    message: 'test123'
  });
});

app.post('/api/v1/auth/register', register);
app.post('/api/v1/auth/login', login);

const jwtMiddleware = jwt({
  secret: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
});

app.post('/api/v1/recipes', jwtMiddleware, saveRecipe);
app.get('/api/v1/recipes', jwtMiddleware, getMyRecipes);

app.post('/api/v1/ai/generate-recipe', generateRecipe);
app.post('/api/v1/ai/refine-recipe', refineRecipe);

const port = 3000;
console.log(`API is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
