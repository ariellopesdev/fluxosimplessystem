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

const Aside = ({ setPage, page, isAsideOpen, closeAside }) => {
  const { user } = useSelector((state) => state.auth);

  //Check user permissions
  const canManageUsers = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const canAccessFinancial =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  //Sidebar menu items
  const menuItems = [
    {
      page: "dashboard",
      label: "Dashboard",
      icon: <FiHome />,
    },
    {
      page: "client",
      label: "Clientes",
      icon: <FiUser />,
    },
    {
      page: "sales",
      label: "Vendas",
      icon: <FaShoppingCart />,
    },
    {
      page: "products",
      label: "Produtos",
      icon: <FiPackage />,
    },
    {
      page: "service",
      label: "Serviços",
      icon: <MdDesignServices />,
    },
    {
      page: "financial",
      label: "Financeiro",
      icon: <FaChartLine />,
      visible: canAccessFinancial,
    },
    {
      page: "appointment",
      label: "Agendamentos",
      icon: <FiCalendar />,
    },
    {
      page: "reports",
      label: "Relatórios",
      icon: <FiBarChart2 />,
    },
    {
      page: "register",
      label: "Acessos",
      icon: <FiUsers />,
      visible: canManageUsers,
    },
    {
      page: "settings",
      label: "Configurações",
      icon: <FiSettings />,
    },
    {
      page: "help",
      label: "Ajuda",
      icon: <FiHelpCircle />,
    },
  ];

  //Filter menu by permissions
  const visibleMenuItems = menuItems.filter((item) => item.visible !== false);

  return (
    <aside id="aside" className={isAsideOpen ? "aside--open" : ""}>
      <nav className="dashboard__container--menu">
        <ul className="dashboard__menu">
          {visibleMenuItems.map((item) => (
            <li
              key={item.page}
              className={`dashboard__menu--item ${
                page === item.page ? "dashboard__menu--item--active" : ""
              }`}
              onClick={() => {
                setPage(item.page);
                closeAside();
              }}
            >
              <span className="dashboard__icons">{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Aside;
