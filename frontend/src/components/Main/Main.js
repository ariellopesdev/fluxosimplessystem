//CSS
import "./Main.css";

//Pages
import Dashboard from "../../pages/Dashboard/Dashboard";
import EditProfile from "../../pages/EditProfile/EditProfile";
import Stock from "../../pages/Stock/Stock";
import Product from "../../pages/Product/Product";
import Appointment from "../../pages/Appointment/Appointment";
import Reports from "../../pages/Reports/Reports";
import Settings from "../../pages/Settings/Settings";
import Help from "../../pages/Help/Help";

//Components
import UnderConstruction from "../UnderConstruction/UnderConstruction";

const Main = ({ page }) => {
  const renderPage = () => {
    switch (page) {
      case "dashboard":
        // return <Dashboard />;
        return <UnderConstruction title="Dashboard" />;
      case "profile":
        return <EditProfile />;
      case "stock":
        // return <Stock />;
        return <UnderConstruction title="Estoque" />;
      case "products":
        // return <Product />;
        return <UnderConstruction title="Produtos" />;
      case "appointment":
        // return <Appointment />;
        return <UnderConstruction title="Agendamentos" />;
      case "reports":
        // return <Reports />;
        return <UnderConstruction title="Relatórios" />;
      case "settings":
        // return <Settings />;
        return <UnderConstruction title="Configurações" />;
      case "help":
        // return <Help />;
        return <UnderConstruction title="Ajuda" />;
    }
  };
  return (
    <main id="main">
      <div className="main__container">{renderPage()}</div>
    </main>
  );
};

export default Main;
