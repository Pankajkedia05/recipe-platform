import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetails from './pages/RecipeDetails';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/profile/:username?" element={<Profile />} />
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <CreateRecipe />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <ToastContainer position="bottom-right" theme="dark" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;