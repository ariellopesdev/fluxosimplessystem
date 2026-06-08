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
import HomeLoading from "./components/Loading/HomeLoading";
import PainelSkeleton from "./components/Loading/PainelSkeleton";

function App() {
  const { auth, loading } = useAuth();

  if (loading) {
    return <HomeLoading />;
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home replace />} />
          <Route path="/forgot-password" element={<ForgotPassword replace />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPassword replace />}
          />
          <Route
            path="/painel"
            element={auth ? <Painel /> : <Navigate to="/" replace />}
          />
          <Route
            path="/register"
            element={auth ? <Register /> : <Navigate to="/" replace />}
          />
          <Route
            path="/dashboard"
            element={auth ? <Dashboard /> : <Navigate to="/" replace />}
          />
          <Route
            path="/client"
            element={auth ? <Client /> : <Navigate to="/" replace />}
          />
          <Route
            path="/sales"
            element={auth ? <Sales /> : <Navigate to="/" replace />}
          />
          <Route
            path="/product"
            element={auth ? <Product /> : <Navigate to="/" replace />}
          />
          <Route
            path="/service"
            element={auth ? <Service /> : <Navigate to="/" replace />}
          />
          <Route
            path="/financial"
            element={auth ? <Financial /> : <Navigate to="/" replace />}
          />
          <Route
            path="/appointment"
            element={auth ? <Appointment /> : <Navigate to="/" replace />}
          />
          <Route
            path="/reports"
            element={auth ? <Reports /> : <Navigate to="/" replace />}
          />
          <Route
            path="/settings"
            element={auth ? <Settings /> : <Navigate to="/" replace />}
          />
          <Route
            path="/help"
            element={auth ? <Help /> : <Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
