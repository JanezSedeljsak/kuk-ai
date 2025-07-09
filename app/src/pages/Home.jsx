import { useState } from "react";
import { RecipeCard } from "../components/RecipeCard";

function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);

  function generateRecipe() {
    setRecipe({
      title: 'Test',
      ingredients: ['Rice', 'Chicken'],
      instructions: ['Just do it'],
      totalTime: 20
    });
    setPrompt("");
  }

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {!recipe ? (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Welcome to KukAI
            </h1>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <RecipeCard recipe={recipe} hasSave={true} />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/5 backdrop-blur-lg border-t border-white/15 p-4">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key == 'Enter') {
                    e.preventDefault();
                    generateRecipe();
                  }
                }}
                placeholder="Enter ingredients separated by commas (e.g., chicken, garlic, rice, tomatoes)..."
                className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-lg border border-white/25 rounded-md text-white placeholder-gray-300 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200 text-sm"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={generateRecipe}
              disabled={!prompt.trim() || isLoading}
              className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-md disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 text-sm flex items-center gap-1"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}

export default Home;
