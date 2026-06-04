import "./ForgotPassword.css";

// React
import { useEffect } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, reset } from "../../slices/authSlice";

// Router
import { Link } from "react-router-dom";

// Components
import Message from "../../components/Message/Message";

// Hooks
import { useForgotPasswordForm } from "../../hooks/useForgotPasswordForm";

// Icons
import { MdOutlineMarkEmailRead } from "react-icons/md";

// reCaptcha
import ReCAPTCHA from "react-google-recaptcha";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  // Redux state
  const { loading, error, message } = useSelector((state) => state.auth);

  // Forgot password form state and validations
  const {
    formData,
    errors,
    hasErrors,
    handleChange,
    handleCaptchaChange,
    validateForm,
    resetForm,
  } = useForgotPasswordForm();

  // Send recovery email
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    dispatch(
      forgotPassword({
        email: formData.email.trim(),
        captchaToken: formData.captchaToken,
      }),
    );
  };

  // Reset form after success
  useEffect(() => {
    if (message) {
      resetForm();
    }
  }, [message, resetForm]);

  // Clean auth states on unmount
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
        {/* HEADER */}
        <div className="forgotPassword__header">
          <MdOutlineMarkEmailRead />
          <h2>Recuperar senha</h2>
          <p>
            Informe o e-mail da sua conta para receber o link de redefinição.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={errors.email ? "input__error" : ""}
          />

          {errors.email && <Message msg={errors.email} type="error" />}

          <div className="forgotPassword__captcha">
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
            />
          </div>

          {errors.captcha && <Message msg={errors.captcha} type="error" />}

          {!loading && (
            <button type="submit" disabled={hasErrors}>
              Enviar link de recuperação
            </button>
          )}

          {loading && (
            <button type="submit" disabled>
              Aguarde...
            </button>
          )}

          {/* GLOBAL MESSAGES */}
          {error && <Message msg={error} type="error" />}
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
