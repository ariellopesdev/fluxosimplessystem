//CSS
import "./Home.css";

//Components
import Footer from "../../components/Footer/Footer";

const Home = () => {
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
      <form className="form__login">
        <input type="email" placeholder="E-mail" />
        <input type="password" placeholder="Senha" />
        <button type="submit" className="auth__btn--primary">
          Entrar
        </button>
        <a href="#" className="forgotPassword">
          Esqueceu sua senha?
        </a>
        <hr />
        <button type="button" className="auth__btn--secondary">
          Criar uma conta
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default Home;
