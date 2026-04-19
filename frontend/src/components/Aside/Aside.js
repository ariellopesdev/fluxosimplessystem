//CSS
import "./Aside.css";

//Icons
import {
  FiHome, // dashboard
  FiUser, // perfil
  FiBox, // estoque
  FiPackage, // produtos
  FiCalendar, // agendamentos
  FiBarChart2, // relatórios
  FiSettings, // configurações
  FiHelpCircle, // ajuda
} from "react-icons/fi";

const Aside = () => {
  return (
    <aside id="aside">
      <div className="dashboard__container--title">
        <h1>
          <FiHome className="dashboard__icons"/>Dashboard
        </h1>
      </div>
      <hr className="dashboard__divider" />
      <div className="dashboard__container--menu">
        <ul className="dashboard__menu">
          <li className="dashboard__menu--item dashboard__menu--item--active">
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
