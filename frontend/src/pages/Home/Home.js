//CSS
import "./Home.css";

//Components
import { NavLink, Link, useNavigate } from "react-router-dom";
import Message from "../../components/Message/Message";
import Footer from "../../components/Footer/Footer";

//Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//Redux
import { login, reset } from "../../slices/authSlice.js";

//Icons
import { FiEye, FiEyeOff } from "react-icons/fi";

//reCAPTCHA
import ReCAPTCHA from "react-google-recaptcha";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [captchaToken, setCaptchaToken] = useState("");
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLocalError("");

    if (isRateLimited) {
      setLocalError("");
      return;
    }

    if (failedAttempts >= 3 && !captchaToken) {
      setLocalError("Confirme que você não é um robô.");
      return;
    }

    const user = {
      email,
      password,
    };

    dispatch(login(user));
  };

  useEffect(() => {
    if (user) {
      setFailedAttempts(0);
      setCaptchaToken("");
      setLocalError("");

      navigate("/painel");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      setFailedAttempts((prev) => prev + 1);
      setCaptchaToken("");
    }
  }, [error]);

  //Clean all auth states
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  const isRateLimited =
    typeof error === "string" &&
    error.toLowerCase().includes("muitas tentativas");
  return (
    <div id="home">
      <div id="home__info">
        <h1 id="home__info--title">
          fluxo simples <span id="home__info--title--highlight">system</span>
        </h1>
        <p id="home__info--description">
          Com o Fluxo Simples, você controla seu estoque de forma eficiente e
          organiza agendamentos, prazos e entregas em um só lugar.
        </p>
      </div>
      <div className="auth__container">
        <form onSubmit={handleSubmit} className="form__login">
          <input
            type="email"
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            value={email || ""}
            autoComplete="off"
            name="login_email_custom"
            id="login_email_custom"
          />
          <div className="password__container">
            <input
              type="text"
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
              value={password || ""}
              autoComplete="off"
              name="fake_field_not_password"
              id="fake_field_not_password"
              className={!showPassword ? "password__hidden" : ""}
            />

            <button
              type="button"
              className="password__toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {failedAttempts >= 3 && !isRateLimited && (
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
            />
          )}
          {!loading && (
            <input
              type="submit"
              value="Entrar"
              className="auth__btn--primary"
            />
          )}
          {loading && (
            <input
              type="submit"
              value="Aguarde..."
              className="auth__btn--primary"
              disabled
            />
          )}
          {error && <Message msg={error} type="error" />}
          {localError && <Message msg={localError} type="error" />}
        </form>
        <Link to="/forgot-password" className="forgotPassword">
          Esqueceu sua senha?
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
