//CSS
import "./App.css";

//Hooks
import { useAuth } from "./hooks/useAuth";

//Router
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//Pages
import Home from "./pages/Home/Home";
import Painel from "./pages/Painel/Painel";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Stock from "./pages/Stock/Stock";
import Product from "./pages/Product/Product";
import Appointment from "./pages/Appointment/Appointment";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import Help from "./pages/Help/Help";

function App() {
  const { auth, loading } = useAuth();

  if (loading) {
    return <p>Carregando...</p>;
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/painel"
            element={auth ? <Painel /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!auth ? <Register /> : <Navigate to="/painel" />}
          />
          <Route
            path="/dashboard"
            element={auth ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/stock"
            element={auth ? <Stock /> : <Navigate to="/" />}
          />
          <Route
            path="/product"
            element={auth ? <Product /> : <Navigate to="/" />}
          />
          <Route
            path="/appointment"
            element={auth ? <Appointment /> : <Navigate to="/" />}
          />
          <Route
            path="/reports"
            element={auth ? <Reports /> : <Navigate to="/" />}
          />
          <Route
            path="/settings"
            element={auth ? <Settings /> : <Navigate to="/" />}
          />
          <Route path="/help" element={auth ? <Help /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
