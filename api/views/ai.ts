import { Context } from 'hono';
import { getGenerateValid, getRefineValid, parseAIResponse } from "../validations.ts";

export async function generateRecipe(c: Context) {
    try {
        const { prompt } = await c.req.json();
        console.log(await c.req.json());
        const recipeIngredients = getGenerateValid(prompt);
        if (!recipeIngredients.length) {
            return c.json({
                error: 'Invalid prompt'
            }, 422);
        }

        const aiPrompt = `You are a creative professional chef. Create an exciting and detailed recipe using these main ingredients: ${recipeIngredients.join(', ')}.

Be creative and add complementary ingredients to enhance flavors. Include spices, herbs, aromatics, and other ingredients that would make this dish exceptional. Think about texture, flavor balance, and visual appeal.

Consider these elements:
- Add appropriate seasonings, spices, and herbs
- Include complementary vegetables, proteins, or grains if needed
- Suggest cooking techniques that enhance flavors
- Make the instructions detailed and helpful
- Choose an appealing, descriptive recipe name
- Consider flavor profiles: sweet, salty, umami, acidic, bitter

IMPORTANT: Format ingredients as separate items in an array, not as a single string. Use raw strings in the arrays, not objects.

Format your response as valid JSON with this exact structure:
{
    "title": "Creative and appealing recipe name",
    "ingredients": [
        "1 cup main ingredient 1",
        "2 tbsp main ingredient 2", 
        "1 tsp complementary ingredient 1",
        "Salt and pepper to taste",
        "Fresh herbs for garnish"
    ],
    "instructions": [
        "detailed step 1 with technique", 
        "detailed step 2 with timing", 
        "detailed step 3 with tips"
    ],
    "totalTime": realistic_total_minutes
}

Make this recipe memorable and delicious!`;

        const aiResponse = await fetch(`${process.env.OLLAMA_URL}api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: process.env.OLLAMA_MODEL || 'gemma:2b',
                prompt: aiPrompt,
                stream: false,
                format: 'json'
            })
        });

        console.log(aiResponse);
        if (!aiResponse.ok) {
            const error = await aiResponse.text();
            console.log(error);
            throw new Error(error);
        }

        const responseData = await aiResponse.json();
        const recipe = parseAIResponse(responseData.response);
        if (!recipe) {
            const jsonString = JSON.stringify(responseData.response);
            throw new Error(`Failed to parse response, ${jsonString}`);
        }

        return c.json({
            recipe: recipe,
            usedIngredients: recipeIngredients
        });
    } catch (error) {
        console.error(error);
        return c.json({
            'error': 'Something went wrong'
        }, 500);
    }
}

export async function refineRecipe(c: Context) {
    try {
        const { prompt, recipe } = await c.req.json();
        const [refine2Add, refine2Remove] = getRefineValid(prompt);
        if (!refine2Add.length && !refine2Remove.length) {
            return c.json({
                error: 'Invalid prompt'
            }, 422);
        }

        let aiPrompt = `You are a creative professional chef. Please refine this recipe by adding and removing the specified ingredients:

Original Recipe: ${recipe.title || 'Recipe'}
Current Ingredients: ${(recipe.ingredients || []).join(', ')}
Current Instructions: ${(recipe.instructions || []).join(' ')}

Changes to make:`;

        if (refine2Add.length) {
            aiPrompt += `\n- Add these ingredients: ${refine2Add.join(', ')}`;
        }
        if (refine2Remove.length) {
            aiPrompt += `\n- Remove these ingredients: ${refine2Remove.join(', ')}`;
        }
        
        aiPrompt += `

Please provide a refined recipe that incorporates these ingredient changes. Update the instructions accordingly to include the new ingredients and remove references to removed ingredients. Keep the same cooking style and overall approach.

IMPORTANT: Format ingredients as separate items in an array, not as a single string. Use raw strings in the arrays, not objects.

Format your response as valid JSON with this exact structure:
{
    "title": "Updated recipe name",
    "ingredients": [
        "1 cup ingredient 1",
        "2 tbsp ingredient 2", 
        "Salt and pepper to taste"
    ],
    "instructions": [
        "detailed step 1", 
        "detailed step 2"
    ],
    "totalTime": total_minutes
}

Ensure the refined recipe is practical and delicious!`;
        const aiResponse = await fetch(`${process.env.OLLAMA_URL}api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: process.env.OLLAMA_MODEL || 'gemma:2b',
                prompt: aiPrompt,
                stream: false,
                format: 'json'
            })
        });

        console.log(aiResponse);
        if (!aiResponse.ok) {
            const error = await aiResponse.text();
            console.log(error);
            throw new Error(error);
        }

        const responseData = await aiResponse.json();
        const aiRecipe = parseAIResponse(responseData.response);
        if (!aiRecipe) {
            const jsonString = JSON.stringify(responseData.response);
            throw new Error(`Failed to parse response, ${jsonString}`);
        }

        return c.json({
            recipe: aiRecipe,
        });
    } catch (error) {
        console.error(error);
        return c.json({
            'error': 'Something went wrong'
        }, 500);
    }
}
