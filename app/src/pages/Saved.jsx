import RecipeCard from "../components/RecipeCard";

const savedRecipes = [
  {
    id: 1,
    title: "Classic Chocolate Chip Cookies",
    ingredients: [
      "2 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups chocolate chips",
    ],
    instructions: [
      "Preheat oven to 375°F (190°C)",
      "Mix flour, baking soda, and salt in a bowl",
      "Cream butter and sugars until fluffy",
      "Beat in eggs and vanilla",
      "Gradually add flour mixture",
      "Stir in chocolate chips",
      "Drop rounded tablespoons on ungreased baking sheets",
      "Bake 9-11 minutes until golden brown",
    ],
    totalTime: 30,
  },
  {
    id: 2,
    title: "Creamy Garlic Pasta",
    ingredients: [
      "12 oz pasta",
      "4 cloves garlic, minced",
      "1/2 cup heavy cream",
      "1/4 cup butter",
      "1/2 cup parmesan cheese",
      "2 tbsp olive oil",
      "Salt and pepper to taste",
      "Fresh parsley for garnish",
    ],
    instructions: [
      "Cook pasta according to package directions",
      "Heat olive oil in a large pan",
      "Sauté garlic until fragrant",
      "Add butter and cream, simmer",
      "Toss with cooked pasta",
      "Add parmesan cheese and seasoning",
      "Garnish with fresh parsley",
    ],
    totalTime: 20,
  },
  {
    id: 3,
    title: "Fluffy Pancakes",
    ingredients: [
      "2 cups all-purpose flour",
      "2 tbsp sugar",
      "2 tsp baking powder",
      "1 tsp salt",
      "2 large eggs",
      "1 3/4 cups milk",
      "1/4 cup melted butter",
      "1 tsp vanilla extract",
    ],
    instructions: [
      "Mix dry ingredients in a large bowl",
      "Whisk eggs, milk, butter, and vanilla",
      "Combine wet and dry ingredients",
      "Heat griddle over medium heat",
      "Pour batter and cook until bubbles form",
      "Flip and cook until golden",
      "Serve hot with syrup",
    ],
    totalTime: 25,
  },
];

function Saved() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
            My Saved Recipes
          </h1>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {savedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Saved;
