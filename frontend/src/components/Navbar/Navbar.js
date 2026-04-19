//CSS
import "./Navbar.css";

//Components
import { NavLink, Link, useNavigate } from "react-router-dom";

//Icons
import { FaCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

//Hooks
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

//Redux
import { logout, reset } from "../../slices/authSlice";

const Navbar = () => {
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
          <form className="nav__form--login">
            <input type="email" placeholder="E-mail" />
            <input type="password" placeholder="Senha" />
            <button type="submit" className="register__btn--primary">
              Entrar
            </button>
          </form>
        </>
      )}
    </nav>
  );
};

export default Navbar;
