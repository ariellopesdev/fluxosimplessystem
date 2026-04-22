//CSS
import "./Aside.css";

//Icons
import {
  FiHome,
  FiUser,
  FiBox,
  FiPackage,
  FiCalendar,
  FiBarChart2,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";

//Components
import { NavLink } from "react-router-dom";

const Aside = ({ setPage, page }) => {
  return (
    <aside id="aside">
      <div className="dashboard__container--menu">
        <ul className="dashboard__menu">
          <li
            className={`dashboard__menu--item ${
              page === "dashboard" ? "dashboard__menu--item--active" : ""
            }`}
            onClick={() => setPage("dashboard")}
          >
            <FiHome className="dashboard__icons" /> Dashboard
          </li>
          <li
            className={`dashboard__menu--item ${
              page === "profile" ? "dashboard__menu--item--active" : ""
            }`}
            onClick={() => setPage("profile")}
          >
            <FiUser className="dashboard__icons" /> Perfil
          </li>
          <li
            className={`dashboard__menu--item ${
              page === "stock" ? "dashboard__menu--item--active" : ""
            }`}
            onClick={() => setPage("stock")}
          >
            <FiBox className="dashboard__icons" /> Estoque
          </li>
          <li
            className={`dashboard__menu--item ${
              page === "products" ? "dashboard__menu--item--active" : ""
            }`}
            onClick={() => setPage("products")}
          >
            <FiPackage className="dashboard__icons" /> Produtos
          </li>
          <li
            className={`dashboard__menu--item ${
              page === "appointment" ? "dashboard__menu--item--active" : ""
            }`}
            onClick={() => setPage("appointment")}
          >
            <FiCalendar className="dashboard__icons" /> Agendamentos
          </li>
          <li
            className={`dashboard__menu--item ${
              page === "reports" ? "dashboard__menu--item--active" : ""
            }`}
            onClick={() => setPage("reports")}
          >
            <FiBarChart2 className="dashboard__icons" /> Relatórios
          </li>
          <li
            className={`dashboard__menu--item ${
              page === "settings" ? "dashboard__menu--item--active" : ""
            }`}
            onClick={() => setPage("settings")}
          >
            <FiSettings className="dashboard__icons" /> Configurações
          </li>
          <li
            className={`dashboard__menu--item ${
              page === "help" ? "dashboard__menu--item--active" : ""
            }`}
            onClick={() => setPage("help")}
          >
            <FiHelpCircle className="dashboard__icons" /> Ajuda
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Aside;
