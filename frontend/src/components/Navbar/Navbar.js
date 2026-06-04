//CSS
import "./Navbar.css";

//Storage
import { uploads } from "../../utils/config";

//Components
import { Link, useNavigate } from "react-router-dom";

//Icons
import { FiLogOut, FiUser, FiMenu } from "react-icons/fi";

//Hooks
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";

//Redux
import { logout, reset } from "../../slices/authSlice";
import { profile } from "../../slices/userSlice";

const Navbar = ({ toggleAside }) => {
  const { auth } = useAuth();
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // User display data
  const userCode = user?._id?.slice(-4).padStart(4, "0");
  const userName = user?.name || "Usuário";
  const companyName = user?.company?.name || "Empresa não informada";
  const shortCompanyName =
    companyName.length > 25
      ? `${companyName.substring(0, 25)}...`
      : companyName;

  // User profile image
  const profileImageUrl = user?.profileImage
    ? `${uploads}/users/${user.profileImage}`
    : null;

  // Load user data
  useEffect(() => {
    if (auth && !user?._id) {
      dispatch(profile());
    }
  }, [dispatch, auth, user?._id]);

  // Logout user
  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/");
  };

  return (
    <nav id="nav">
      {/* MOBILE MENU BUTTON */}
      <button type="button" className="nav__menuButton" onClick={toggleAside}>
        <FiMenu />
      </button>

      {/* BRAND */}
      <Link to="/" className="nav__brandLink">
        <button type="button" className="nav--company">
          fluxo simples <span className="nav--highlight">system</span>
        </button>
      </Link>

      {auth ? (
        /* USER INFO */
        <ul className="nav__user--info">
          {/* USER AVATAR */}
          <li className="nav__avatarItem tooltip" data-tooltip="Usuário online">
            <div className="nav__avatar">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt={userName} />
              ) : (
                <FiUser />
              )}
            </div>
          </li>

          {/* USER NAME */}
          <li
            className="nav__user--username tooltip"
            data-tooltip="Nome do usuário"
          >
            {userName}
          </li>
          <li className="nav__separator">|</li>
          {/* USER CODE */}
          <li
            className="nav__user--id tooltip"
            data-tooltip="Código do usuário"
          >
            {userCode}
          </li>
          <li className="nav__separator">|</li>
          {/* COMPANY NAME */}
          <li
            className="nav__user--companyName tooltip"
            data-tooltip={companyName}
          >
            {shortCompanyName}
          </li>
          {/* LOGOUT */}
          <li
            className="nav__user--iconLogout tooltip"
            data-tooltip="Sair"
            onClick={handleLogout}
          >
            <FiLogOut />
          </li>
        </ul>
      ) : (
        /* LOGIN LINK */
        <Link to="/" className="login__btn">
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
