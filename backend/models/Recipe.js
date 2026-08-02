const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  unit: { type: String, default: '' }
});

const InstructionSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' }
});

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Recipe description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Appetizer', 'Snack', 'Drink', 'Soup', 'Salad', 'Bread', 'Pasta', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Other']
  },
  cuisine: {
    type: String,
    required: true,
    enum: ['Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 'Thai', 'French', 'Spanish', 'Greek', 'Turkish', 'American', 'British', 'Middle Eastern', 'African', 'Other']
  },
  prepTime: {
    type: Number,
    required: true,
    min: 0
  },
  cookTime: {
    type: Number,
    required: true,
    min: 0
  },
  servings: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  ingredients: [IngredientSchema],
  instructions: [InstructionSchema],
  mainImage: {
    type: String,
    required: true
  },
  additionalImages: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  tags: [String],
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search
RecipeSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Recipe', RecipeSchema);