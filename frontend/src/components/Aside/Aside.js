//CSS
import "./Aside.css";

//Icons
import {
  FiHome,
  FiUser,
  FiPackage,
  FiCalendar,
  FiBarChart2,
  FiUsers,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";
import { FaShoppingCart, FaChartLine } from "react-icons/fa";
import { MdDesignServices } from "react-icons/md";

//Hooks
import { useSelector } from "react-redux";

const Aside = ({ setPage, page }) => {
  const { user } = useSelector((state) => state.auth);

  const canRegisterUsers =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";
  const canAccessFinancial =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";
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
              page === "client" ? "dashboard__menu--item--active" : ""
            }`}
            onClick={() => setPage("client")}
          >
            <FiUser className="dashboard__icons" /> Clientes
          </li>
          <li
            className={`dashboard__menu--item ${
              page === "sales" ? "dashboard__menu--item--active" : ""
            }`}
            onClick={() => setPage("sales")}
          >
            <FaShoppingCart className="dashboard__icons" /> Vendas
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
              page === "service" ? "dashboard__menu--item--active" : ""
            }`}
            onClick={() => setPage("service")}
          >
            <MdDesignServices className="dashboard__icons" /> Serviços
          </li>
          {canAccessFinancial && (
            <li
              className={`dashboard__menu--item ${
                page === "financial" ? "dashboard__menu--item--active" : ""
              }`}
              onClick={() => setPage("financial")}
            >
              <FaChartLine className="dashboard__icons" /> Financeiro
            </li>
          )}
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
          {canRegisterUsers && (
            <li
              className={`dashboard__menu--item ${
                page === "register" ? "dashboard__menu--item--active" : ""
              }`}
              onClick={() => setPage("register")}
            >
              <FiUsers className="dashboard__icons" /> Acessos
            </li>
          )}
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
