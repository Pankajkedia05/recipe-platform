const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

// @route   GET /api/comments/recipe/:recipeId
// @desc    Get comments for a recipe
// @access  Public
router.get('/recipe/:recipeId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      recipe: req.params.recipeId,
      parentComment: null 
    })
      .populate('author', 'username avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      })
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/comments/recipe/:recipeId
// @desc    Add a comment to a recipe
// @access  Private
router.post('/recipe/:recipeId', protect, async (req, res) => {
  try {
    const { content, parentComment } = req.body;
    
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    const comment = await Comment.create({
      content,
      author: req.user._id,
      recipe: req.params.recipeId,
      parentComment: parentComment || null
    });
    
    // Add comment to recipe
    recipe.comments.push(comment._id);
    await recipe.save();
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username avatar');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/comments/:commentId
// @desc    Update a comment
// @access  Private
router.put('/:commentId', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own comments' });
    }
    
    comment.content = req.body.content;
    comment.isEdited = true;
    await comment.save();
    
    res.json(comment);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment
// @access  Private
router.delete('/:commentId', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }
    
    // Remove comment from recipe
    await Recipe.findByIdAndUpdate(comment.recipe, {
      $pull: { comments: comment._id }
    });
    
    // Delete replies
    await Comment.deleteMany({ parentComment: comment._id });
    
    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;