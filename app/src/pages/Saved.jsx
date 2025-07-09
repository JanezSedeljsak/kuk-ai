import { useState, useEffect } from "react";
import { RecipeCard } from "../components/RecipeCard";
import { getSavedRecipes } from "../services/api";

function Saved() {
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    getSavedRecipes()
      .then(response => setSavedRecipes(response.recipes || []))
      .catch(error => console.error('Failed to fetch recipes:', error));
  }, []);
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            My saved recipes
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
