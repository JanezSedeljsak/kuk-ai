import { prisma } from '../util.js';

export async function saveRecipe(req, res) {
  try {
        const { title, ingredients, instructions, totalTime } = req.body;
        const recipe = await prisma.recipe.create({
            data: { 
              title, ingredients, instructions, totalTime, 
              userId: req.user.id 
            }
        });

        if (recipe) {
          res.json({
            'message': 'Recipe saved'
          });
        } else {
          res.status(500).json({
            'error': 'Recipe failed to save'
          });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            'error': 'Something went wrong'
        });
    }
}