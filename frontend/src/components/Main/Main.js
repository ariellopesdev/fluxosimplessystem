//CSS
import "./Main.css";

//Pages
import Dashboard from "../../pages/Dashboard/Dashboard";
import Stock from "../../pages/Stock/Stock";
import Product from "../../pages/Product/Product";
import Appointment from "../../pages/Appointment/Appointment";
import Reports from "../../pages/Reports/Reports";
import Settings from "../../pages/Settings/Settings";
import Help from "../../pages/Help/Help";

const Main = ({ page }) => {
  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "stock":
        return <Stock />;
      case "products":
        return <Product />;
      case "appointment":
        return <Appointment />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      case "help":
        return <Help />;
    }
  };
  return (
    <main id="main">
      <div className="main__container">{renderPage()}</div>
    </main>
  );
};

export default Main;
