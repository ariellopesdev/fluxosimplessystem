//CSS
import "./Register.css";

//Components
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Message from "../../components/Message/Message";

//Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//Redux
import { register, reset } from "../../slices/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      name,
      email,
      password,
      confirmPassword,
      companyName,
      cnpj,
    };

    console.log(user);

    dispatch(register(user));
  };

  //Clean all auth states
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="register">
      <Navbar />
      <main id="register__main">
        <form onSubmit={handleSubmit} className="form__register">
          <h2>Cadastre-se</h2>
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
            onChange={(e) => setCnpj(e.target.value)}
            value={cnpj || ""}
          />
          {!loading && (
            <input
              type="submit"
              value="Criar conta"
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
        </form>
      </main>
    </div>
  );
};

export default Register;
