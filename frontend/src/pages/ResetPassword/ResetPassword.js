import "./ResetPassword.css";

// React
import { useEffect, useState } from "react";

// Router
import { Link, useNavigate, useParams } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, reset } from "../../slices/authSlice";

// Components
import Message from "../../components/Message/Message";

// Icons
import { FiEye, FiEyeOff } from "react-icons/fi";

import { MdLockReset } from "react-icons/md";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [localError, setLocalError] = useState("");

  const { loading, error, success, message } = useSelector(
    (state) => state.auth,
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    setLocalError("");

    if (password.length < 6) {
      setLocalError("A senha precisa ter no mínimo 6 caracteres.");

      return;
    }

    if (password !== confirmPassword) {
      setLocalError("As senhas precisam ser iguais.");

      return;
    }

    dispatch(
      resetPassword({
        password,
        token,
      }),
    );
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

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
        <div className="resetPassword__header">
          <MdLockReset />

          <h2>Redefinir senha</h2>

          <p>Crie uma nova senha para acessar sua conta.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="resetPassword__inputContainer">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="resetPassword__toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="resetPassword__inputContainer">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {!loading && <button type="submit">Redefinir senha</button>}

          {loading && (
            <button type="submit" disabled>
              Aguarde...
            </button>
          )}

          {localError && <Message msg={localError} type="error" />}

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
