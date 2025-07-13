export const VALID_INGREDIENTS = [
  "chicken", "beef", "pork", "lamb", "turkey", "duck", "salmon", "tuna", "cod", "shrimp", "crab", "lobster",
  "eggs", "tofu", "tempeh", "beans", "lentils", "chickpeas", "black beans", "kidney beans",

  "onion", "garlic", "tomatoes", "carrots", "celery", "bell peppers", "mushrooms", "zucchini", "eggplant",
  "broccoli", "cauliflower", "spinach", "kale", "lettuce", "cabbage", "potatoes", "sweet potatoes",
  "asparagus", "green beans", "peas", "corn", "avocado", "cucumber", "radishes", "beets",

  "rice", "pasta", "bread", "quinoa", "barley", "oats", "flour", "noodles", "couscous", "bulgur",

  "milk", "cheese", "butter", "cream", "yogurt", "sour cream", "cream cheese", "mozzarella", "parmesan",
  "cheddar", "feta", "goat cheese", "coconut milk", "almond milk",

  "apples", "bananas", "oranges", "lemons", "limes", "berries", "strawberries", "blueberries",
  "grapes", "pineapple", "mango", "peaches", "pears", "cherries", "cranberries",

  "basil", "oregano", "thyme", "rosemary", "parsley", "cilantro", "dill", "mint", "sage",
  "paprika", "cumin", "coriander", "turmeric", "ginger", "cinnamon", "nutmeg", "cloves",
  "bay leaves", "chili powder", "cayenne", "black pepper", "white pepper",

  "olive oil", "vegetable oil", "coconut oil", "vinegar", "balsamic vinegar", "soy sauce",
  "salt", "sugar", "honey", "maple syrup", "vanilla", "baking powder", "baking soda",
  "garlic powder", "onion powder", "red pepper flakes",

  "almonds", "walnuts", "pecans", "cashews", "peanuts", "sunflower seeds", "pumpkin seeds",
  "sesame seeds", "chia seeds", "flax seeds"
];

export function filterValidIngredients(ingredients: string[]): string[] {
    return ingredients.map(ing => ing.toLowerCase().trim())
        .filter(ing => VALID_INGREDIENTS.includes(ing))
        .slice(0, 10);
}

export function getGenerateValid(prompt: string): string[] {
    if (!prompt.trim()) {
        return [];
    }

    const ingredients = prompt.split(',')
        .map(ing => ing.toLowerCase().trim())
        .filter(ing => ing.length > 2);
    
    if (!ingredients.length) {
        return [];
    }

    const validIngredients = filterValidIngredients(ingredients);
    return validIngredients;
}

export function getRefineValid(prompt: string): [string[], string[]] {
    if (!prompt.trim()) {
        return [[], []];
    }

    const ingredients = prompt.split(',')
        .map(ing => ing.toLowerCase().trim())
        .filter(ing => ing.length > 3);
    
    if (!ingredients.length) {
        return [[], []];
    }
 
    const ingredients2Add = ingredients.filter(ing => ing[0] == '+')
        .map(ing => ing.slice(1));

    const ingredients2Remove = ingredients.filter(ing => ing[0] == '-')
        .map(ing => ing.slice(1));

    const validIngredients2Add = filterValidIngredients(ingredients2Add);
    const validIngredients2Remove = filterValidIngredients(ingredients2Remove);
    return [validIngredients2Add, validIngredients2Remove];
}

interface Recipe {
    title: string;
    ingredients: string[];
    instructions: string[];
    totalTime: number;
}

export function parseAIResponse(text: string): Recipe | null {
    if (!text.trim()) {
        return null;
    }

    try {
        let aiResponse = text.trim();
        if (aiResponse.includes("```")) {
            const splitText = aiResponse.split("```");
            aiResponse = splitText[1];
        }

        if (aiResponse.startsWith('json')) {
            aiResponse = aiResponse.substring(4);
        }

        const parsedRecipe = JSON.parse(aiResponse.trim());
        if (parsedRecipe != null) {
            return {
                title: parsedRecipe?.title || "Generated recipe",
                ingredients: Array.isArray(parsedRecipe?.ingredients) ? parsedRecipe?.ingredients : [],
                instructions: Array.isArray(parsedRecipe?.instructions) ? parsedRecipe?.instructions : [],
                totalTime: Number(parsedRecipe?.totalTime) || 30,
            }
        }
 
    } catch (error) {
        console.error(error);
    }

    return null;
}
