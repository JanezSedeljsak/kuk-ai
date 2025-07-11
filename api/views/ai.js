import { getGenerateValid, getRefineValid, parseAIResponse } from "../validations.js";

export async function generateRecipe(req, res) {
    try {
        const { prompt } = req.body;
        console.log(req.body);
        const recipeIngredients = getGenerateValid(prompt);
        if (!recipeIngredients.length) {
            return res.status(422).json({
                error: 'Invalid prompt'
            });
        }

        const aiPrompt = [
            "You are a creative professional chef. Create an exciting and detailed recipe using these main ingredients:",
            `${recipeIngredients.join(', ')}.`,
            "",
            "Be creative and add complementary ingredients to enhance flavors. Include spices, herbs, aromatics, and other ingredients that would make this dish exceptional. Think about texture, flavor balance, and visual appeal.",
            "",
            "Consider these elements:",
            "- Add appropriate seasonings, spices, and herbs",
            "- Include complementary vegetables, proteins, or grains if needed",
            "- Suggest cooking techniques that enhance flavors",
            "- Make the instructions detailed and helpful",
            "- Choose an appealing, descriptive recipe name",
            "- Consider flavor profiles: sweet, salty, umami, acidic, bitter",
            "",
            "IMPORTANT: Format ingredients as separate items in an array, not as a single string.",
            "",
            "Format your response as valid JSON with this exact structure:",
            "{",
            '    "title": "Creative and appealing recipe name",',
            '    "ingredients": [',
            '        "1 cup main ingredient 1",',
            '        "2 tbsp main ingredient 2",',
            '        "1 tsp complementary ingredient 1",',
            '        "Salt and pepper to taste",',
            '        "Fresh herbs for garnish"',
            "    ],",
            '    "instructions": [',
            '        "detailed step 1 with technique",',
            '        "detailed step 2 with timing",',
            '        "detailed step 3 with tips"',
            "    ],",
            '    "totalTime": realistic_total_minutes',
            "}",
            "",
            "Make this recipe memorable and delicious!"
        ].join('\n');

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

        res.json({
            recipe: recipe,
            usedIngredients: recipeIngredients
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            'error': 'Something went wrong'
        });
    }
}

export async function refineRecipe(req, res) {
    try {
        const { prompt, recipe } = req.body;
        const [refine2Add, refine2Remove] = getRefineValid(prompt);
        if (!refine2Add.length && !refine2Remove.length) {
            return res.status(422).json({
                error: 'Invalid prompt'
            });
        }

        const aiPrompt = [
            "You are a creative professional chef. Please refine this recipe by adding and removing the specified ingredients:",
            "",
            `Original Recipe: ${recipe.title || 'Recipe'}`,
            `Current Ingredients: ${(recipe.ingredients || []).join(', ')}`,
            `Current Instructions: ${(recipe.instructions || []).join(' ')}`,
            "",
            "Changes to make:"
        ];

        if (refine2Add.length) {
            aiPrompt.push(
                `Add these ingredients: ${refine2Add.join(', ')}`
            );
        }

        if (refine2Remove.length) {
            aiPrompt.push(
                `Remove these ingredients: ${refine2Remove.join(', ')}`
            );
        }

        aiPrompt.push(
            "",
            "Please provide a refined recipe that incorporates these ingredient changes. Update the instructions accordingly to include the new ingredients and remove references to removed ingredients. Keep the same cooking style and overall approach.",
            "",
            "IMPORTANT: Format ingredients as separate items in an array, not as a single string.",
            "",
            "Format your response as valid JSON with this exact structure:",
            "{",
            '    "title": "Updated recipe name",',
            '    "ingredients": [',
            '        "1 cup ingredient 1",',
            '        "2 tbsp ingredient 2",',
            '        "Salt and pepper to taste"',
            "    ],",
            '    "instructions": [',
            '        "detailed step 1",',
            '        "detailed step 2"',
            "    ],",
            '    "totalTime": total_minutes',
            "}",
            "",
            "Ensure the refined recipe is practical and delicious!"
        );

        const finalAiPrompt = aiPrompt.join('\n');
        const aiResponse = await fetch(`${process.env.OLLAMA_URL}api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: process.env.OLLAMA_MODEL || 'gemma:2b',
                prompt: finalAiPrompt,
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

        res.json({
            recipe: recipe,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            'error': 'Something went wrong'
        });
    }
}