import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recipeAPI } from "../services/api";

const CreateRecipe = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Other",
    cuisine: "Other",
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "Easy",
    mainImage: "",
    ingredients: [{ name: "", amount: "", unit: "" }],
    instructions: [{ step: 1, description: "" }]
  });
  const navigate = useNavigate();

  const handleIngredientChange = (index, field, value) => {
    const updated = [...form.ingredients];
    updated[index][field] = value;
    setForm({ ...form, ingredients: updated });
  };

  const addIngredient = () => {
    setForm({ ...form, ingredients: [...form.ingredients, { name: "", amount: "", unit: "" }] });
  };

  const removeIngredient = (index) => {
    const updated = form.ingredients.filter((_, i) => i !== index);
    setForm({ ...form, ingredients: updated.length ? updated : [{ name: "", amount: "", unit: "" }] });
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...form.instructions];
    updated[index].description = value;
    setForm({ ...form, instructions: updated });
  };

  const addInstruction = () => {
    setForm({ ...form, instructions: [...form.instructions, { step: form.instructions.length + 1, description: "" }] });
  };

  const removeInstruction = (index) => {
    const updated = form.instructions.filter((_, i) => i !== index).map((item, idx) => ({ ...item, step: idx + 1 }));
    setForm({ ...form, instructions: updated.length ? updated : [{ step: 1, description: "" }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const recipeData = {
        ...form,
        prepTime: Number(form.prepTime),
        cookTime: Number(form.cookTime),
        servings: Number(form.servings),
        ingredients: form.ingredients.filter((item) => item.name.trim()),
        instructions: form.instructions.filter((item) => item.description.trim())
      };

      await recipeAPI.create(recipeData);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to create recipe");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="section-card">
        <div className="page-heading">
          <div>
            <h1>Create a new recipe</h1>
            <p className="text-muted">Add ingredients, instructions, and details for your dish.</p>
          </div>
          <span className="status-pill">Draft</span>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-field">
            <label>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Recipe title" required />
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" required />
          </div>

          <div className="input-inline">
            <div className="form-field">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Dessert</option>
                <option>Snack</option>
                <option>Drink</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-field">
              <label>Cuisine</label>
              <select value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })}>
                <option>Italian</option>
                <option>Mexican</option>
                <option>Chinese</option>
                <option>Indian</option>
                <option>Thai</option>
                <option>French</option>
                <option>American</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-field">
              <label>Difficulty</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          <div className="input-inline">
            <div className="form-field">
              <label>Prep time (min)</label>
              <input type="number" min="0" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} required />
            </div>
            <div className="form-field">
              <label>Cook time (min)</label>
              <input type="number" min="0" value={form.cookTime} onChange={(e) => setForm({ ...form, cookTime: e.target.value })} required />
            </div>
            <div className="form-field">
              <label>Servings</label>
              <input type="number" min="1" value={form.servings} onChange={(e) => setForm({ ...form, servings: e.target.value })} required />
            </div>
          </div>

          <div className="form-field">
            <label>Main image URL</label>
            <input value={form.mainImage} onChange={(e) => setForm({ ...form, mainImage: e.target.value })} placeholder="https://..." required />
          </div>

          <div className="list-box">
            <div className="page-heading">
              <h3>Ingredients</h3>
              <button type="button" className="btn-secondary" onClick={addIngredient}>Add ingredient</button>
            </div>
            {form.ingredients.map((ingredient, index) => (
              <div key={index} className="input-inline" style={{ alignItems: 'end' }}>
                <input value={ingredient.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} placeholder="Ingredient" required />
                <input value={ingredient.amount} onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)} placeholder="Amount" required />
                <input value={ingredient.unit} onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)} placeholder="Unit" />
                <button type="button" className="btn-secondary" onClick={() => removeIngredient(index)}>Remove</button>
              </div>
            ))}
          </div>

          <div className="list-box">
            <div className="page-heading">
              <h3>Instructions</h3>
              <button type="button" className="btn-secondary" onClick={addInstruction}>Add step</button>
            </div>
            {form.instructions.map((instruction, index) => (
              <div key={index} className="form-field">
                <label>Step {instruction.step}</label>
                <textarea value={instruction.description} onChange={(e) => handleInstructionChange(index, e.target.value)} placeholder="Describe this step" required />
                <button type="button" className="btn-secondary" onClick={() => removeInstruction(index)}>Remove step</button>
              </div>
            ))}
          </div>

          <button type="submit" className="btn-primary">Publish recipe</button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
