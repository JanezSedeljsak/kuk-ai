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

export function filterValidIngredients(ingredients) {
  if (!Array.isArray(ingredients)) {
    return [];
  }
  
  return ingredients
    .map(ingredient => ingredient.toLowerCase().trim())
    .filter(ingredient => {
      return VALID_INGREDIENTS.some(valid => 
        ingredient.includes(valid) || valid.includes(ingredient)
      );
    })
    .slice(0, 10);
}

export function validateGenerateIngredients(ingredientsString) {
  if (!ingredientsString || typeof ingredientsString !== 'string') {
    return false;
  }
  
  const ingredients = ingredientsString
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
  
  if (ingredients.length === 0 || ingredients.length > 10) {
    return false;
  }
  
  const validIngredients = filterValidIngredients(ingredients);
  
  return validIngredients.length > 0;
}

export function validateRefineIngredients(refinementsString) {
  if (!refinementsString || typeof refinementsString !== 'string') {
    return false;
  }
  
  const refinements = refinementsString
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
  
  if (refinements.length === 0) {
    return false;
  }
  
  let hasValidRefinement = false;
  
  for (const refinement of refinements) {
    if (!refinement.startsWith('+') && !refinement.startsWith('-')) {
      continue;
    }
    
    const ingredient = refinement.slice(1).trim();
    
    if (ingredient.length === 0) {
      continue;
    }
    
    if (refinement.startsWith('+')) {
      const validIngredients = filterValidIngredients([ingredient]);
      if (validIngredients.length > 0) {
        hasValidRefinement = true;
      }
    } else {
      hasValidRefinement = true;
    }
  }
  
  return hasValidRefinement;
}

export function parseAIResponse(aiResponse) {
  if (!aiResponse || typeof aiResponse !== 'string') {
    return null;
  }

  try {
    let cleaned = aiResponse.trim();
    
    if (cleaned.startsWith("```")) {
      const parts = cleaned.split("```");
      if (parts.length >= 2) {
        cleaned = parts[1];
      }
    }
    
    if (cleaned.startsWith("json")) {
      cleaned = cleaned.substring(4);
    }
    
    const parsedData = JSON.parse(cleaned.trim());
    
    if (typeof parsedData === 'object' && parsedData !== null) {
      return {
        title: parsedData.title || "Generated Recipe",
        ingredients: Array.isArray(parsedData.ingredients) ? parsedData.ingredients : [],
        instructions: Array.isArray(parsedData.instructions) ? parsedData.instructions : ["No instructions generated"],
        totalTime: parsedData.totalTime || parsedData.total_time || parsedData.prep_time + parsedData.cook_time || 30
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
}
