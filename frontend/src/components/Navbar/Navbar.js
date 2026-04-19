//CSS
import "./Navbar.css";

//Components
import { NavLink, Link, useNavigate } from "react-router-dom";
import Message from "../Message/Message";

//Icons
import { FaCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

//Hooks
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

//Redux
import { logout, reset } from "../../slices/authSlice";

const Navbar = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const { auth } = useAuth();
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/");
  };

  return (
    <nav id="nav">
      <Link to="/">
        <button className="nav--company">
          fluxo simples <span className="nav--highlight">system</span>
        </button>
      </Link>
      {auth ? (
        <>
          <ul className="nav__user--info">
            <li
              className="nav__user--iconLogged tooltip"
              data-tooltip="Usuário online"
            >
              <FaCircle />
            </li>
            <li
              className="nav__user--username tooltip"
              data-tooltip="Nome do usuário"
            >
              Ariel Lopes
            </li>
            <li
              className="nav__user--id tooltip"
              data-tooltip="Código do usuário"
            >
              0049
            </li>
            <li
              className="nav__user--companyName tooltip"
              data-tooltip="Empresa"
            >
              Restaurante Rancho Alegre
            </li>
            <li className="nav__user--iconLogout tooltip" data-tooltip="Sair">
              <FiLogOut onClick={handleLogout} />
            </li>
          </ul>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="nav__form--login">
            <input
              type="email"
              placeholder="E-mail"
              onChange={(e) => setEmail(e.target.value)}
              value={email || ""}
            />
            <input
              type="password"
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
              value={password || ""}
            />
            <input
              type="submit"
              value="Entrar"
              className="register__btn--primary"
            />
          </form>
        </>
      )}
    </nav>
  );
};

export default Navbar;
