export function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {recipe.title}
        </h3>
      </div>
    </div>
  );
}