//CSS
import "./Navbar.css";

//Components
import { Link, useNavigate } from "react-router-dom";

//Icons
import { FaCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

//Hooks
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";

//Redux
import { logout, reset } from "../../slices/authSlice";
import { profile } from "../../slices/userSlice";

const Navbar = () => {
  const { auth } = useAuth();
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const userCode = user?._id?.slice(-4).padStart(4, "0");

  //Load user data
  useEffect(() => {
    if (auth) {
      dispatch(profile());
    }
  }, [dispatch, auth]);

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
              {user?.name}
            </li>
            <li
              className="nav__user--id tooltip"
              data-tooltip="Código do usuário"
            >
              {userCode}
            </li>
            <li
              className="nav__user--companyName tooltip"
              data-tooltip="Empresa"
            >
              {user?.company?.name}
            </li>
            <li className="nav__user--iconLogout tooltip" data-tooltip="Sair">
              <FiLogOut onClick={handleLogout} />
            </li>
          </ul>
        </>
      ) : (
        <>
          <Link to="/" className="login__btn">
            Login
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
