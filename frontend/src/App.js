//CSS
import "./App.css";

//Hooks
import { useAuth } from "./hooks/useAuth";

//Router
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//Pages
import Home from "./pages/Home/Home";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Painel from "./pages/Painel/Painel";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Client from "./pages/Client/Client";
import Sales from "./pages/Sales/Sales";
import Product from "./pages/Product/Product";
import Service from "./pages/Service/Service";
import Financial from "./pages/Financial/Financial";
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/painel"
            element={auth ? <Painel /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={auth ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/dashboard"
            element={auth ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/client"
            element={auth ? <Client /> : <Navigate to="/" />}
          />
          <Route
            path="/sales"
            element={auth ? <Sales /> : <Navigate to="/" />}
          />
          <Route
            path="/product"
            element={auth ? <Product /> : <Navigate to="/" />}
          />
          <Route
            path="/service"
            element={auth ? <Service /> : <Navigate to="/" />}
          />
          <Route
            path="/financial"
            element={auth ? <Financial /> : <Navigate to="/" />}
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
