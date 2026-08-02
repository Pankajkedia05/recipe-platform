import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { recipeAPI } from "../services/api";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recipeAPI.getAll()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.recipes || [];
        setRecipes(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <section className="section-card hero-section">
        <div className="hero-copy">
          <p className="highlight-pill">Home cooking made simple</p>
          <h1>Find brilliant recipes for every mood.</h1>
          <p className="text-muted">Discover fresh ideas, share your best dishes, and keep your kitchen inspired.</p>
          <div className="hero-actions">
            <Link to="/search?q=" className="btn-primary">Search recipes</Link>
            <Link to="/create" className="btn-secondary">Create a recipe</Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-content">
            <p className="text-muted">Today’s spotlight</p>
            <h2>Seasonal spice collection</h2>
            <p className="card-meta">Craft a bold dinner with fresh ingredients and a warm finishing touch.</p>
            <div className="hero-feature-grid">
              <span>Easy prep</span>
              <span>30 mins</span>
              <span>4 servings</span>
            </div>
            <Link to="/create" className="btn-secondary">Share your twist</Link>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="page-heading">
          <div>
            <p className="highlight-pill">How it works</p>
            <h2>Browse. cook. share.</h2>
          </div>
        </div>

        <div className="cards-grid">
          <article className="card">
            <div className="card-content">
              <h3 className="card-title">Search faster</h3>
              <p className="card-meta">Use filters, keywords, and categories to find recipes that match your mood, ingredients, or dietary needs.</p>
            </div>
          </article>
          <article className="card">
            <div className="card-content">
              <h3 className="card-title">Cook with confidence</h3>
              <p className="card-meta">Follow step-by-step recipes that are designed to keep every meal simple, tasty, and ready to share.</p>
            </div>
          </article>
          <article className="card">
            <div className="card-content">
              <h3 className="card-title">Share your flavor</h3>
              <p className="card-meta">Post your original dishes and build a collection your friends and community can explore.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="section-card">
        <div className="page-heading">
          <div>
            <p className="highlight-pill">Featured recipes</p>
            <h2>Top picks for your kitchen</h2>
          </div>
          <Link to="/create" className="btn-primary">Share a Recipe</Link>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading recipes...</div>
        ) : recipes.length === 0 ? (
          <div className="error-message">No recipes available yet.</div>
        ) : (
          <div className="cards-grid">
            {recipes.map((recipe) => (
              <article key={recipe._id} className="card">
                <div className="card-content">
                  <h3 className="card-title">{recipe.title}</h3>
                  <p className="card-meta">{recipe.description}</p>
                  <p className="card-note">{recipe.category} • {recipe.cuisine}</p>
                </div>
                <div className="card-content">
                  <Link to={`/recipe/${recipe._id}`} className="btn-secondary">View details</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
