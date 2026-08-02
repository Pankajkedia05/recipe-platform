import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { recipeAPI } from "../services/api";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const res = await recipeAPI.getById(id);
        setRecipe(res.data);
      } catch (error) {
        console.error('Error loading recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  if (loading) return <div className="page-wrapper"><div className="loading-spinner">Loading recipe...</div></div>;
  if (!recipe) return <div className="page-wrapper"><div className="error-message">Recipe not found.</div></div>;

  return (
    <div className="page-wrapper">
      <div className="section-card">
        <div className="page-heading">
          <div>
            <p className="highlight-pill">{recipe.category || 'Recipe'}</p>
            <h1>{recipe.title}</h1>
            <p className="text-muted">{recipe.cuisine} • {recipe.difficulty} • {recipe.servings} servings</p>
          </div>
          <span className="status-pill">{recipe.difficulty || 'Easy'}</span>
        </div>

        {recipe.mainImage && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <img src={recipe.mainImage} alt={recipe.title} style={{ width: '100%', height: '320px', objectFit: 'cover' }} />
          </div>
        )}

        <div className="section-card" style={{ marginTop: '20px' }}>
          <h2>Description</h2>
          <p className="card-meta">{recipe.description || 'No description available.'}</p>
        </div>

        <div className="section-split">
          <div className="section-card">
            <h2>Ingredients</h2>
            <ul className="list-box">
              {(recipe.ingredients || []).length > 0 ? (
                recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="list-item">
                    <span>{ingredient.name}</span>
                    <span className="text-muted">{ingredient.amount} {ingredient.unit}</span>
                  </li>
                ))
              ) : (
                <li className="text-muted">No ingredients listed</li>
              )}
            </ul>
          </div>

          <div className="section-card aside-card">
            <h2>Instructions</h2>
            <ol className="list-box">
              {(recipe.instructions || []).length > 0 ? (
                recipe.instructions.map((instruction, index) => (
                  <li key={index} className="list-item">
                    <div>
                      <strong>Step {instruction.step || index + 1}:</strong>
                      <p className="text-muted" style={{ marginTop: '8px' }}>{instruction.description}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-muted">No instructions listed</li>
              )}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
