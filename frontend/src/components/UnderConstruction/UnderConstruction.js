//CSS
import "./UnderConstruction.css";

//Icons
import { FiTool } from "react-icons/fi";

//Components
import { NavLink } from "react-router-dom";

const UnderConstruction = ({title}) => {
  return (
    <div className="construction">
      <FiTool className="construction__icon" />

      <h2>{title || "Página em construção"}</h2>

      <p>
        Estamos trabalhando nessa funcionalidade.
        <br />
        Em breve você poderá utilizá-la.
      </p>
    </div>
  );
};

export default UnderConstruction;
