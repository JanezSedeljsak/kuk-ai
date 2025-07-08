import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';

function Home({ isLoggedIn }) {
  const [prompt, setPrompt] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRecipe = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const mockRecipe = {
      title: `AI Generated: ${prompt}`,
      ingredients: [
        "2 cups flour",
        "1 cup sugar", 
        "2 eggs",
        "1/2 cup butter",
        "1 tsp vanilla extract",
        "1 tsp baking powder"
      ],
      instructions: [
        "Preheat your oven to 350°F (175°C)",
        "Mix all dry ingredients in a large bowl",
        "In another bowl, cream butter and sugar together",
        "Add eggs and vanilla to the butter mixture",
        "Gradually combine wet and dry ingredients",
        "Bake for 25-30 minutes until golden brown",
        "Preheat your oven to 350°F (175°C)",
        "Mix all dry ingredients in a large bowl",
        "In another bowl, cream butter and sugar together",
        "Add eggs and vanilla to the butter mixture",
        "Gradually combine wet and dry ingredients",
        "Bake for 25-30 minutes until golden brown"
      ],
      totalTime: 45
    };
    
    setGeneratedRecipe(mockRecipe);
    setIsGenerating(false);
    setPrompt('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateRecipe();
    }
  };

  const handleSave = () => {
  };

  return (
    <div className="min-h-screen pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {!generatedRecipe ? (
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
              Welcome to KukAI
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Generate delicious recipes with the power of AI. Just list your ingredients!
            </p>
          </div>
        ) : (
            
            <div className="max-w-5xl mx-auto space-y-8">
              <RecipeCard recipe={generatedRecipe} />
            </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/5 backdrop-blur-lg border-t border-white/15 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter ingredients separated by commas (e.g., chicken, garlic, rice, tomatoes)..."
                className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-lg border border-white/25 rounded-md text-white placeholder-gray-300 focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all duration-200 text-sm"
                disabled={isGenerating}
              />
            </div>
            
            <button
              onClick={generateRecipe}
              disabled={!prompt.trim() || isGenerating}
              className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-md disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 text-sm flex items-center gap-1"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generate
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate
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
