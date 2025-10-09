import { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle } from "lucide-react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useEffect } from 'react';

// import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Etudiants from './pages/Etudiants/Etudiants';
import Equipes from './pages/Equipes/Equipes';
import Domaines from './pages/Domaines/Domaines';
import Epreuves from './pages/Epreuves/Epreuves';
import Questions from './pages/Questions/Questions';
import Propositions from './pages/Propositions/Propositions';
import Programme from './pages/Programme/Programme';
import Annonces from './pages/Annonces/Annonces';
import NotFound from './components/NotFound';

// import useAuthStore from './stores/auth.store';


// Composant pour protéger les routes
// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// Composant pour les routes publiques (comme login)
// const PublicRoute = ({ children }) => {
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  
//   return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
// };

function App() {
  // const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // useEffect(() => {
  //   initializeAuth;
  // }, [initializeAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Notifications toast */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#f5f3ff",
              color: "#4c1d95",
              border: "1px solid #c4b5fd",
              padding: "12px 16px",
              fontWeight: "500",
              fontSize: "14px",
            },
            success: {
              icon: <CheckCircle className="text-[#166534] w-5 h-5" />,
              style: {
                background: "#bbf7d0",
                color: "#166534",
                borderColor: "#4ade80",
              },
            },
            error: {
              icon: <XCircle className="text-[#7f1d1d] w-5 h-5" />,
              style: {
                background: "#fee2e2",
                color: "#7f1d1d",
                borderColor: "#fca5a5",
              },
            },
          }}
        />

        <main>
          <Routes>
            {/* Route publique - Login */}
            {/* <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            /> */}

            {/* Redirection par défaut vers login */}
            {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}

            {/* Routes protégées */}
            <Route 
              path="/dashboard" 
              element={
                // <ProtectedRoute>
                  <Dashboard />
                // </ProtectedRoute>
              } 
            />
            <Route 
              path="/etudiants" 
              element={
                // <ProtectedRoute>
                  <Etudiants />
                // </ProtectedRoute>
              } 
            />
            <Route 
              path="/equipes" 
              element={
                // <ProtectedRoute>
                  <Equipes />
                // </ProtectedRoute>
              } 
            />
            <Route 
              path="/domaines" 
              element={
                // <ProtectedRoute>
                  <Domaines />
                // </ProtectedRoute>
              } 
            />
            <Route 
              path="/epreuves" 
              element={
                // <ProtectedRoute>
                  <Epreuves />
                // </ProtectedRoute>
              } 
            />
            <Route 
              path="/questions" 
              element={
                // <ProtectedRoute>
                  <Questions />
                // </ProtectedRoute>
              } 
            />
            <Route 
              path="/propositions" 
              element={
                // <ProtectedRoute>
                  <Propositions />
                // </ProtectedRoute>
              } 
            />
            <Route 
              path="/programme" 
              element={
                // <ProtectedRoute>
                  <Programme />
                // </ProtectedRoute>
              } 
            />
            <Route 
              path="/annonces" 
              element={
                // <ProtectedRoute>
                  <Annonces />
                // </ProtectedRoute>
              } 
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;