const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Import Routes
const authRoutes = require('./routes/auth.routes');
const recipeRoutes = require('./routes/recipe.routes');
const commentRoutes = require('./routes/comment.routes');
const likeRoutes = require('./routes/like.routes');
const userRoutes = require('./routes/user.routes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/users', userRoutes);

// MongoDB Connection
const primaryMongoURI = process.env.MONGODB_URI;
const localMongoURI = 'mongodb://127.0.0.1:27017/recipe-platform';

const connectMongo = async () => {
  try {
    await mongoose.connect(primaryMongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected (Atlas)');
  } catch (primaryError) {
    console.error('❌ MongoDB Atlas connection failed:', primaryError.message);
    console.log('➡️ Trying local MongoDB at', localMongoURI);

    try {
      await mongoose.connect(localMongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✅ MongoDB Connected (local fallback)');
    } catch (fallbackError) {
      console.error('❌ Local MongoDB fallback failed:', fallbackError.message);
      console.error('   Start MongoDB locally or fix the Atlas URI in .env.');
      process.exit(1);
    }
  }
};

connectMongo().then(() => {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});