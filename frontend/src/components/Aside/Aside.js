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

const Aside = () => {
  return (
    <aside id="aside">      
      <div className="dashboard__container--menu">
        <ul className="dashboard__menu">
          <li className="dashboard__menu--item dashboard__menu--item--active">
            <FiHome className="dashboard__icons"/>  Dashboard
          </li>
          <hr className="dashboard__divider" />
          <li className="dashboard__menu--item">
            <FiUser className="dashboard__icons"/>  Perfil
          </li>
          <li className="dashboard__menu--item">
            <FiBox className="dashboard__icons"/>  Estoque
          </li>
          <li className="dashboard__menu--item">
            <FiPackage className="dashboard__icons"/>  Produtos
          </li>
          <li className="dashboard__menu--item">
            <FiCalendar className="dashboard__icons"/>  Agendamentos
          </li>
          <li className="dashboard__menu--item">
            <FiBarChart2 className="dashboard__icons"/>  Relatórios
          </li>
          <li className="dashboard__menu--item">
            <FiSettings className="dashboard__icons"/>  Configurações
          </li>
          <li className="dashboard__menu--item">
            <FiHelpCircle className="dashboard__icons"/>  Ajuda
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Aside;
