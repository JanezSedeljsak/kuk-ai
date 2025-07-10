import { prisma } from "../util.js";

export async function generateRecipe(req, res) {
    try {
        const { prompt } = req.body;
        const recipeIngredients = prompt.split(', ');
    } catch (error) {
        res.status(500).json({
            'error': 'Something went wrong'
        });
    }
}