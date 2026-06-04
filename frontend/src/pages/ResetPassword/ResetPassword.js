//CSS
import "./ResetPassword.css";

// React
import { useEffect } from "react";

// Router
import { Link, useNavigate, useParams } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, reset } from "../../slices/authSlice";

// Components
import Message from "../../components/Message/Message";

// Hooks
import { useResetPasswordForm } from "../../hooks/useResetPasswordForm";

// Icons
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdLockReset } from "react-icons/md";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useParams();

  // Redux state
  const { loading, error, success, message } = useSelector(
    (state) => state.auth,
  );

  // Reset password form state and validations
  const {
    formData,
    errors,
    hasErrors,
    showPassword,
    setShowPassword,
    handleChange,
    validateForm,
    resetForm,
  } = useResetPasswordForm();

  // Reset user password
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    dispatch(
      resetPassword({
        password: formData.password,
        token,
      }),
    );
  };

  // Redirect after successful password reset
  useEffect(() => {
    if (success) {
      resetForm();

      const timer = setTimeout(() => {
        navigate("/");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [success, navigate, resetForm]);

  // Clean auth states on unmount
  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  return (
    <div id="resetPassword">
      <div className="authLogo">
        <h1>
          fluxo simples
          <span> system</span>
        </h1>
      </div>

      <div className="resetPassword__container">
        {/* HEADER */}
        <div className="resetPassword__header">
          <MdLockReset />

          <h2>Redefinir senha</h2>

          <p>Crie uma nova senha para acessar sua conta.</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* PASSWORD */}
          <div className="resetPassword__inputContainer">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nova senha"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={errors.password ? "input__error" : ""}
            />

            <button
              type="button"
              className="resetPassword__toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {errors.password && <Message msg={errors.password} type="error" />}

          {/* CONFIRM PASSWORD */}
          <div className="resetPassword__inputContainer">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar senha"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={errors.confirmPassword ? "input__error" : ""}
            />
          </div>

          {errors.confirmPassword && (
            <Message msg={errors.confirmPassword} type="error" />
          )}

          {/* SUBMIT BUTTON */}
          {!loading && (
            <button type="submit" disabled={hasErrors}>
              Redefinir senha
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

        <Link to="/" className="resetPassword__back">
          Voltar para login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;