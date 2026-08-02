const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

// @route   POST /api/likes/recipe/:recipeId
// @desc    Like or unlike a recipe
// @access  Private
router.post('/recipe/:recipeId', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const userId = req.user._id;
    const likeIndex = recipe.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      recipe.likes.push(userId);
    } else {
      recipe.likes.splice(likeIndex, 1);
    }
    
    await recipe.save();
    res.json({ likes: recipe.likes.length });
  } catch (error) {
    console.error('Recipe like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/likes/comment/:commentId
// @desc    Like or unlike a comment
// @access  Private
router.post('/comment/:commentId', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const userId = req.user._id;
    const likeIndex = comment.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(likeIndex, 1);
    }
    
    await comment.save();
    res.json({ likes: comment.likes.length });
  } catch (error) {
    console.error('Comment like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;