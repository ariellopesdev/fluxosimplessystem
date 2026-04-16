//CSS
import "./Home.css";

//Components
import Login from "../../components/Login/Login";

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
      <form className="auth__form">
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
      <footer id="home__footer">
        <div className="home__footer--links">
          <a>Cadastre-se</a>
          <a>Entrar</a>
        </div>
        <div className="home__footer--links">
          <a>Política de Privacidade</a>
          <a>Central de Privacidade</a>
          <a>Sobre</a>
        </div>
        <div className="home__footer--copyright">
          <p>
            &copy;
            <a
              href="https://ariellopesdev.github.io/portfolio-professional/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ariellopesdev
            </a>
            2026. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
