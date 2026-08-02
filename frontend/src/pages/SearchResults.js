import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { recipeAPI } from "../services/api";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (!query) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    recipeAPI.getAll({ search: query })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.recipes || [];
        setRecipes(data);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="page-wrapper">
      <div className="section-card">
        <div className="page-heading">
          <div>
            <h1>Search recipes</h1>
            <p className="text-muted">Find the perfect dish for tonight, or refine your search to discover something fresh.</p>
          </div>
          <span className="highlight-pill">{query ? `Results for “${query}”` : 'Search is ready'}</span>
        </div>

        {query ? (
          loading ? (
            <div className="loading-spinner">Searching recipes...</div>
          ) : recipes.length === 0 ? (
            <div className="error-message">No recipes found for “{query}”. Try a broader term.</div>
          ) : (
            <div className="cards-grid">
              {recipes.map((recipe) => (
                <article key={recipe._id} className="card">
                  <div className="card-content">
                    <h3 className="card-title">{recipe.title}</h3>
                    <p className="card-meta">{recipe.description}</p>
                    <p className="text-muted">{recipe.category} • {recipe.cuisine}</p>
                  </div>
                  <div className="card-content" style={{ justifyContent: 'flex-end' }}>
                    <Link to={`/recipe/${recipe._id}`} className="btn-secondary">View details</Link>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : (
          <div className="error-message">Enter a search term in the search field to browse recipes.</div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
