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

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    dispatch(login(user));
  };

  useEffect(() => {
    if (user) {
      navigate("/painel");
    }
  }, [user, navigate]);

  //Clean all auth states
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);
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
          />
          <input
            type="password"
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
            value={password || ""}
          />
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
        </form>
        <a href="#" className="forgotPassword">
          Esqueceu sua senha?
        </a>
        <hr />
        <Link to="/register" className="auth__btn--secondary">
          Criar uma conta
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
