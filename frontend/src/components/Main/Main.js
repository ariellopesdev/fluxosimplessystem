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

const Main = ({ page, setPage }) => {
  //Application pages map
  const pages = {
    dashboard: <Dashboard />,
    client: <Client />,
    sales: <Sales />,
    products: <Product />,
    service: <Service />,
    financial: <Financial />,
    appointment: <Appointment setPage={setPage} />,
    reports: <Reports />,
    register: <Register />,
    settings: <Settings />,
    help: <Help />,
  };

  //Render selected page or fallback to dashboard
  const currentPage = pages[page] || pages.dashboard;

  return (
    <main id="main">
      <div className="main__container">
        <div key={page} className="pageTransition">
          {currentPage}
        </div>
      </div>
    </main>
  );
};

export default Main;