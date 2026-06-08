//CSS
import "./Home.css";

//Components
import { Link, useNavigate } from "react-router-dom";
import Message from "../../components/Message/Message";
import Footer from "../../components/Footer/Footer";

//Hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLoginForm } from "../../hooks/useLoginForm.js";

//Redux
import { login, reset } from "../../slices/authSlice.js";

//Icons
import { FiEye, FiEyeOff } from "react-icons/fi";

//reCAPTCHA
import ReCAPTCHA from "react-google-recaptcha";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Login form state and validations
  const {
    formData,
    errors,
    showPassword,
    shouldShowCaptcha,
    setShowPassword,
    handleChange,
    handleCaptchaChange,
    increaseFailedAttempts,
    validateForm,
    resetForm,
  } = useLoginForm();

  //Redux state
  const { loading, error } = useSelector((state) => state.auth);

  //Detect temporary login rate limit
  const isRateLimited =
    typeof error === "string" &&
    error.toLowerCase().includes("muitas tentativas");

  //Handle field login attempts
  // useEffect(() => {
  //   if (error) {
  //     increaseFailedAttempts();
  //   }
  // }, [error, increaseFailedAttempts]);

  //Sign in user
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("CLICOU NO LOGIN");

    const isValid = validateForm(shouldShowCaptcha);

    if (!isValid) return;
    if (isRateLimited) return;

    const userData = {
      email: formData.email.trim(),
      password: formData.password,
      captchaToken: formData.captchaToken,
    };

    dispatch(reset());

    try {
      const loggedUser = await dispatch(login(userData)).unwrap();

      if (loggedUser?.token) {
        resetForm();
        navigate("/painel", { replace: true });
      }
    } catch (error) {
      console.log("Erro no login:", error);
      increaseFailedAttempts();
    }
  };

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
          {/* EMAIL */}
          <input
            type="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            autoComplete="off"
            name="login_email_custom"
            id="login_email_custom"
            className={errors.email ? "input__error" : ""}
          />
          {errors.email && <Message msg={errors.email} type="error" />}

          {/* PASSWORD */}
          <div className="password__container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              autoComplete="off"
              name="fake_field_not_password"
              id="fake_field_not_password"
              className={errors.password ? "input__error" : ""}
            />

            <button
              type="button"
              className="password__toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && <Message msg={errors.password} type="error" />}

          {/* RECAPTCHA */}
          {shouldShowCaptcha && !isRateLimited && (
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
            />
          )}
          {errors.captcha && <Message msg={errors.captcha} type="error" />}

          {/* SUBMIT BUTTON */}
          {!loading && (
            <input
              type="submit"
              value="Entrar"
              className="login__btn--primary"
            />
          )}
          {loading && (
            <input
              type="submit"
              value="Aguarde..."
              className="login__btn--primary"
              disabled
            />
          )}

          {/* GLOBAL MESSAGES */}
          {error && <Message msg={error} type="error" />}
        </form>

        {/* FORGOT PASSWORD */}
        <Link to="/forgot-password" className="forgotPassword">
          Esqueceu sua senha?
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
