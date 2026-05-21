//CSS
import "./Register.css";

//Components
import { Link } from "react-router-dom";
import Message from "../../components/Message/Message";

//Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//Redux
import { reset } from "../../slices/authSlice";
import { createUser } from "../../slices/userSlice";
import { resetMessage } from "../../slices/userSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [role, setRole] = useState("USER");
  const [cnpjError, setCnpjError] = useState("");
  const [errors, setErrors] = useState({});

  const formatCNPJ = (value) => {
    value = value.replace(/\D/g, "");

    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");

    return value;
  };

  const validateCNPJ = (cnpj) => {
    const cleaned = cnpj.replace(/\D/g, "");
    if (cleaned.length < 14) {
      setCnpjError("CNPJ incompleto.");
      return;
    }
    setCnpjError("");
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (value.length < 3) {
          error = "O nome deve ter no mínimo 3 caracteres.";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = "Insira um e-mail válido.";
        }
        break;
      case "password":
        if (value.length < 6) {
          error = "A senha deve ter no mínimo 6 caracteres.";
        }
        break;
      case "confirmPassword":
        if (value !== password) {
          error = "As senhas não coincidem.";
        }
        break;
      case "companyName":
        if (value.length < 2) {
          error = "O nome da empresa deve ter no mínimo 2 caracteres.";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const dispatch = useDispatch();

  const { loading, error, success, message } = useSelector(
    (state) => state.user,
  );
  const { user: loggedUser } = useSelector((state) => state.auth);

  //Clean all auth states
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  //Clean all register states
  useEffect(() => {
    if (success) {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setCompanyName("");
      setCnpj("");
      setRole("USER");
    }
  }, [success]);

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch]);

  const canAccess =
    loggedUser?.role === "SUPER_ADMIN" || loggedUser?.role === "ADMIN";

  if (!canAccess) {
    return <Message msg="Acesso negado." type="error" />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      name,
      email,
      password,
      confirmPassword,
      companyName,
      cnpj,
      role,
    };

    console.log(user);

    dispatch(createUser(user));
  };

  return (
    <div id="register">
      <main id="register__main">
        <div className="register__header">
          <h2>Cadastre um usuário</h2>
          <p>Preencha os dados para criar um novo acesso.</p>
        </div>
        <form onSubmit={handleSubmit} className="form__register">
          <div className="form__group--register">
            <label>Tipo de usuário</label>
            <select onChange={(e) => setRole(e.target.value)} value={role}>
              <option value="USER">Usuário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <div className="form__group--register">
            <label>Nome completo</label>
            <input
              type="text"
              placeholder="Digite o nome completo"
              value={name || ""}
              onChange={(e) => {
                setName(e.target.value);
                validateField("name", e.target.value);
              }}
            />
            {errors.name && <Message msg={errors.name} type="error" />}
          </div>
          <div className="form__group--register">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="Digite o e-mail"
              value={email || ""}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
            />
            {errors.email && <Message msg={errors.email} type="error" />}
          </div>
          <div className="form__group--register">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite a senha"
              value={password || ""}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("password", e.target.value);
              }}
            />
            <div className="password__strength">
              <div
                className="password__strength--bar"
                style={{
                  width:
                    password.length >= 10
                      ? "100%"
                      : password.length >= 6
                        ? "70%"
                        : password.length > 0
                          ? "40%"
                          : "0%",
                  backgroundColor:
                    password.length >= 10
                      ? "#10b981"
                      : password.length >= 6
                        ? "#f59e0b"
                        : "#ef4444",
                }}
              />
            </div>
            {errors.password && <Message msg={errors.password} type="error" />}
          </div>
          <div className="form__group--register">
            <label>Confirmar senha</label>
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword || ""}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                validateField("confirmPassword", e.target.value);
              }}
            />
            {errors.confirmPassword && (
              <Message msg={errors.confirmPassword} type="error" />
            )}
          </div>
          <div className="form__group--register">
            <label>Noma da empresa</label>
            <input
              type="text"
              placeholder="Digite o nome da empresa"
              value={companyName || ""}
              onChange={(e) => {
                setCompanyName(e.target.value);
                validateField("companyName", e.target.value);
              }}
            />
            {errors.companyName && (
              <Message msg={errors.companyName} type="error" />
            )}
          </div>
          <div className="form__group--register">
            <label>CNPJ da empresa</label>
            <input
              type="text"
              placeholder="Digite o CNPJ da empresa"
              value={cnpj}
              maxLength={18}
              onChange={(e) => {
                const formatted = formatCNPJ(e.target.value);
                setCnpj(formatted);
                validateCNPJ(formatted);
              }}
            />
            {cnpjError && <Message msg={cnpjError} type="error" />}
          </div>
          {!loading && (
            <input
              type="submit"
              value="Cadastrar usuário"
              className="register__btn--primary"
            />
          )}
          {loading && (
            <input
              type="submit"
              value="Aguarde..."
              className="register__btn--primary"
              disabled
            />
          )}
          {error && <Message msg={error} type="error" />}
          {message && <Message msg={message} type="success" />}
        </form>
      </main>
    </div>
  );
};

export default Register;
