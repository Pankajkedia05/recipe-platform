const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

const fallbackRecipes = [
  {
    _id: 'demo-recipe-1',
    title: 'Spicy Pasta',
    description: 'A quick and tasty pasta recipe for busy evenings.',
    ingredients: [{ name: 'pasta', amount: '200', unit: 'g' }],
    instructions: [{ step: 1, description: 'Boil the pasta until al dente.' }],
    author: { username: 'demo', avatar: '' },
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'demo-recipe-2',
    title: 'Berry Smoothie',
    description: 'A refreshing smoothie with berries and yogurt.',
    ingredients: [{ name: 'berries', amount: '1', unit: 'cup' }],
    instructions: [{ step: 1, description: 'Blend everything until smooth.' }],
    author: { username: 'demo', avatar: '' },
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   GET /api/recipes
// @desc    Get all recipes with pagination & filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const start = (page - 1) * limit;
      const pagedRecipes = fallbackRecipes.slice(start, start + limit);
      return res.json({
        recipes: pagedRecipes,
        total: fallbackRecipes.length,
        page,
        totalPages: Math.ceil(fallbackRecipes.length / limit)
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = { isPublished: true };
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by cuisine
    if (req.query.cuisine) {
      query.cuisine = req.query.cuisine;
    }
    
    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    const recipes = await Recipe.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Recipe.countDocuments(query);
    
    res.json({
      recipes,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/recipes/featured
// @desc    Get featured recipes
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const recipes = await Recipe.find({ isPublished: true })
      .populate('author', 'username avatar')
      .sort({ 'likes': -1, 'comments': -1 })
      .limit(6);
    res.json(recipes);
  } catch (error) {
    console.error('Featured recipes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get single recipe by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      const recipe = fallbackRecipes.find((item) => item._id === req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      return res.json(recipe);
    }

    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      });
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/recipes
// @desc    Create a new recipe
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database unavailable' });
    }

    const recipeData = {
      ...req.body,
      author: req.user._id
    };
    
    const recipe = await Recipe.create(recipeData);
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/recipes/:id
// @desc    Update a recipe
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check ownership
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own recipes' });
    }
    
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedRecipe);
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/recipes/:id
// @desc    Delete a recipe
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    // Check ownership
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own recipes' });
    }
    
    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;