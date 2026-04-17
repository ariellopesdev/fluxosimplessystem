//CSS
import "./Navbar.css";

//Components
import { NavLink, Link } from "react-router-dom";

//Icons
import { FaCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  return (
    <nav id="nav">
      <header id="register__header">
        <Link to="/">
          <button className="register__header--company">
            fluxo simples <span id="register__header--highlight">system</span>
          </button>
        </Link>
        <form className="form__register--login">
          <input type="email" placeholder="E-mail" />
          <input type="password" placeholder="Senha" />
          <button type="submit" className="register__btn--primary">
            Entrar
          </button>
        </form>
      </header>
    </nav>
  );
};

export default Navbar;
