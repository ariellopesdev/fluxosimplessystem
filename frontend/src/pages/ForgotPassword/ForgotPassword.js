import "./ForgotPassword.css";

// React
import { useEffect, useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, reset } from "../../slices/authSlice";

// Router
import { Link } from "react-router-dom";

// Components
import Message from "../../components/Message/Message";

// Icons
import { MdOutlineMarkEmailRead } from "react-icons/md";

// reCaptcha
import ReCAPTCHA from "react-google-recaptcha";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const { loading, error, message } = useSelector((state) => state.auth);
  const [captchaToken, setCaptchaToken] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setLocalError("Confirme que você não é um robô.");
      return;
    }

    dispatch(
      forgotPassword({
        email,
        captchaToken,
      }),
    );
  };

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  return (
    <div id="forgotPassword">
      <div className="authLogo">
        <h1>
          fluxo simples
          <span> system</span>
        </h1>
      </div>
      <div className="forgotPassword__container">
        <div className="forgotPassword__header">
          <MdOutlineMarkEmailRead />

          <h2>Recuperar senha</h2>

          <p>
            Informe o e-mail da sua conta para receber o link de redefinição.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            onChange={(token) => setCaptchaToken(token)}
          />

          {!loading && (
            <button type="submit">Enviar link de recuperação</button>
          )}

          {loading && (
            <button type="submit" disabled>
              Aguarde...
            </button>
          )}

          {error && <Message msg={error} type="error" />}
          {localError && <Message msg={localError} type="error" />}
          {message && <Message msg={message} type="success" />}
        </form>

        <Link to="/" className="forgotPassword__back">
          Voltar para login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
