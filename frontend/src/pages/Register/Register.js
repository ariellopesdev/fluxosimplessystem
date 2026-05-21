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
        <form onSubmit={handleSubmit} className="form__register">
          <h2>Cadastre um usuário</h2>
          <select onChange={(e) => setRole(e.target.value)} value={role}>
            <option value="USER">Usuário</option>
            <option value="ADMIN">Administrador</option>
          </select>
          <input
            type="text"
            placeholder="Nome completo"
            onChange={(e) => setName(e.target.value)}
            value={name || ""}
          />
          <input
            type="email"
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
            value={email || ""}
          />
          <input
            type="password"
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
            value={password || ""}
          />
          <input
            type="password"
            placeholder="Confirme sua senha"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword || ""}
          />
          <input
            type="text"
            placeholder="Nome da empresa"
            onChange={(e) => setCompanyName(e.target.value)}
            value={companyName || ""}
          />
          <input
            type="text"
            placeholder="CNPJ da empresa"
            value={cnpj}
            maxLength={18}
            onChange={(e) => {
              const formatted = formatCNPJ(e.target.value);

              setCnpj(formatted);

              validateCNPJ(formatted);
            }}
          />
          {cnpjError && <Message msg={cnpjError} type="error" />}
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
