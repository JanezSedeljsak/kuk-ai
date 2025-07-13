import { Context } from 'hono';
import { prisma } from "../util.ts";

export async function saveRecipe(c: Context) {
  try {
    const { title, ingredients, instructions, totalTime } = await c.req.json();
    const user = c.get('jwtPayload');
    
    const recipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        instructions,
        totalTime,
        userId: user.userId,
      },
    });

    if (recipe) {
      return c.json({
        message: "Recipe saved",
      });
    } else {
      return c.json({
        error: "Recipe failed to save",
      }, 500);
    }
  } catch (error) {
    console.error(error);
    return c.json({
      error: "Something went wrong",
    }, 500);
  }
}

export async function getMyRecipes(c: Context) {
  try {
    const user = c.get('jwtPayload');
    const recipes = await prisma.recipe.findMany({
      where: {
        userId: user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json({
      recipes: recipes,
    });
  } catch (error) {
    console.error(error);
    return c.json({
      error: "Something went wrong",
    }, 500);
  }
}
