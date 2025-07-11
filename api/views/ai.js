import { validateGenerateIngredients, validateRefineIngredients, filterValidIngredients, parseAIResponse } from "../validation.js";

export async function generateRecipe(req, res) {
    try {
        const { ingredients } = req.body;
        
        if (!validateGenerateIngredients(ingredients)) {
            return res.status(422).json({
                error: 'invalid format'
            });
        }

        const ingredientArray = ingredients
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);
        
        const validIngredients = filterValidIngredients(ingredientArray);
        const prompt = [
            "You are a creative professional chef. Create an exciting and detailed recipe using these main ingredients:",
            `${validIngredients.join(', ')}.`,
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

        const ollamaResponse = await fetch('http://ollama:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gemma:2b',
                prompt: prompt,
                stream: false,
                format: 'json'
            })
        });
        
        if (!ollamaResponse.ok) {
            const errorText = await ollamaResponse.text();
            throw new Error(`Ollama API error: ${ollamaResponse.status} - ${errorText}`);
        }

        const ollamaData = await ollamaResponse.json();
        const recipe = parseAIResponse(ollamaData.response);
        
        if (!recipe) {
            const fallbackRecipe = {
                title: `Delicious ${validIngredients[0]} Recipe`,
                ingredients: validIngredients.map(ing => `1 portion ${ing}`),
                instructions: [
                    "Prepare all ingredients",
                    "Cook according to recipe",
                    "Season to taste and serve"
                ],
                totalTime: 30
            };
            
            res.json({
                success: true,
                recipe: fallbackRecipe,
                used_ingredients: validIngredients
            });
            return;
        }

        res.json({
            success: true,
            recipe: recipe,
            used_ingredients: validIngredients
        });

    } catch (error) {
        console.error('Generate recipe error:', error);
        res.status(500).json({
            error: 'Something went wrong generating the recipe'
        });
    }
}

export async function refineRecipe(req, res) {
    try {
        const { original_recipe, refinements } = req.body;
        
        if (!original_recipe || typeof original_recipe !== 'object') {
            return res.status(422).json({
                error: 'invalid format'
            });
        }

        if (!validateRefineIngredients(refinements)) {
            return res.status(422).json({
                error: 'invalid format'
            });
        }

        const refinementArray = refinements
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);
        
        const addIngredients = [];
        const removeIngredients = [];
        
        refinementArray.forEach(refinement => {
            if (refinement.startsWith('+')) {
                const ingredient = refinement.slice(1).trim();
                const validIngredients = filterValidIngredients([ingredient]);
                if (validIngredients.length > 0) {
                    addIngredients.push(validIngredients[0]);
                }
            } else if (refinement.startsWith('-')) {
                const ingredient = refinement.slice(1).trim();
                removeIngredients.push(ingredient.toLowerCase());
            }
        });
        
        const refinementPrompt = [
            "You are a creative professional chef. Please refine this recipe by adding and removing the specified ingredients:",
            "",
            `Original Recipe: ${original_recipe.title || 'Recipe'}`,
            `Current Ingredients: ${(original_recipe.ingredients || []).join(', ')}`,
            `Current Instructions: ${(original_recipe.instructions || []).join(' ')}`,
            "",
            "Changes to make:"
        ];

        if (addIngredients.length > 0) {
            refinementPrompt.push(`- Add these ingredients: ${addIngredients.join(', ')}`);
        }
        
        if (removeIngredients.length > 0) {
            refinementPrompt.push(`- Remove these ingredients: ${removeIngredients.join(', ')}`);
        }

        refinementPrompt.push(
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

        const refinementPromptString = refinementPrompt.join('\n');

        const ollamaResponse = await fetch('http://ollama:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gemma:2b',
                prompt: refinementPromptString,
                stream: false,
                format: 'json'
            })
        });
        
        if (!ollamaResponse.ok) {
            const errorText = await ollamaResponse.text();
            throw new Error(`Ollama API error: ${ollamaResponse.status} - ${errorText}`);
        }

        const ollamaData = await ollamaResponse.json();
        const refinedRecipe = parseAIResponse(ollamaData.response);
        
        if (!refinedRecipe) {
            let refinedIngredients = [...(original_recipe.ingredients || [])];
            
            removeIngredients.forEach(removeIng => {
                refinedIngredients = refinedIngredients.filter(ing => 
                    !ing.toLowerCase().includes(removeIng.toLowerCase())
                );
            });
            
            addIngredients.forEach(addIng => {
                refinedIngredients.push(`1 portion ${addIng}`);
            });

            const fallbackRecipe = {
                title: `Refined ${original_recipe.title || 'Recipe'}`,
                ingredients: refinedIngredients,
                instructions: original_recipe.instructions || [
                    "Prepare all ingredients",
                    "Cook according to refined recipe",
                    "Season to taste and serve"
                ],
                totalTime: original_recipe.totalTime || 30
            };
            
            res.json({
                success: true,
                recipe: fallbackRecipe,
                changes: {
                    added: addIngredients,
                    removed: removeIngredients
                }
            });
            return;
        }

        res.json({
            success: true,
            recipe: refinedRecipe,
            changes: {
                added: addIngredients,
                removed: removeIngredients
            }
        });

    } catch (error) {
        console.error('Refine recipe error:', error);
        res.status(500).json({
            error: 'Something went wrong refining the recipe'
        });
    }
}