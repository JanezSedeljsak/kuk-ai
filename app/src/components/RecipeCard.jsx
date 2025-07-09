export function RecipeCard({ recipe, hasSave }) {
  return (
    <div className="recipe-card">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {recipe.title}
        </h3>
        <div className="flex items-center text-purple-400">
          <span className="text-sm font-medium">
            {recipe.totalTime} minutes
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="section-title">Ingredients</h4>
          <ul className="space-y-2">
            {recipe.ingredients.map(ingredient => (
              <li key={ingredient} className="ingredient-item">
                <span className="text-purple-400 mr-2">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="section-title">Instructions</h4>
          <ul className="space-y-2">
            {recipe.instructions.map((instruction, index) => (
              <li key={instruction} className="instruction-item">
                <span className="instruction-number">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {hasSave ? (
        <div className="mt-6 pt-4 border-t border-white/10">
          <button className="save-button">
            Save recipe
          </button>
        </div>
      ) : (
        null
      )}
    </div>
  );
}