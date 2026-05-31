//CSS
import "./Main.css";

//Pages
import Dashboard from "../../pages/Dashboard/Dashboard";
import Client from "../../pages/Client/Client";
import Product from "../../pages/Product/Product";
import Service from "../../pages/Service/Service";
import Financial from "../../pages/Financial/Financial";
import Appointment from "../../pages/Appointment/Appointment";
import Reports from "../../pages/Reports/Reports";
import Register from "../../pages/Register/Register";
import Settings from "../../pages/Settings/Settings";
import Help from "../../pages/Help/Help";
import Sales from "../../pages/Sales/Sales";
import UnderConstruction from "../../components/UnderConstruction/UnderConstruction";

const Main = ({ page, setPage }) => {
  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "client":
        return <Client />;
      case "sales":
        return <Sales />;
      case "products":
        return <Product />;
      case "service":
        return <Service />;
      case "financial":
        return <Financial />;
      case "appointment":
        return <Appointment setPage={setPage} />;
      case "reports":
        return <Reports />;
      case "register":
        return <Register />;
      case "settings":
        return <Settings />;
      case "help":
        return <UnderConstruction />;
      // return <Help />;
    }
  };
  return (
    <main id="main">
      <div className="main__container">{renderPage()}</div>
    </main>
  );
};

export default Main;
