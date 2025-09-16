import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Auth from "./pages/auth";
import Home from "./pages/index1";
import LostAndFound from "./pages/LostAndFound";
import LiveDarshan from "./pages/LiveDarshan";
import ProtectedRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/profile";
import Ticket from "./pages/ticket";
import Density from "./pages/density";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="app">
      <Routes>
        {/* Protected Home Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          }
        />
        
        {/* Auth Routes - both /auth and /login point to the same component */}
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Auth setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Auth setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/live-darshan"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <LiveDarshan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lostFound"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <LostAndFound />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Ticket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dencity"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Density />
            </ProtectedRoute>
          }
        />

        {/* Catch all route - redirect to auth if not authenticated */}
        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated ? "/" : "/auth"} />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
