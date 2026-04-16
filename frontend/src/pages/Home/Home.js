//CSS
import "./Home.css";

//Components
import Login from "../../components/Login/Login";

const Home = () => {
  return (
    <div className="container-home">
      <div className="block-home">
        <h1>
          fluxo simples <span>system</span>
        </h1>
        <p>
          Com o Fluxo Simples, você controla seu estoque de forma eficiente e
          organiza agendamentos, prazos e entregas em um só lugar.
        </p>
      </div>
      <form>
        <h2>Login</h2>
        <label>E-mail</label>
        <input type="email" />
        <label>Senha</label>
        <input type="password" />
        <a>Esqueceu sua senha?</a>
        <button type="submit">Entrar</button>
        <br />
        <button type="">Criar uma conta</button>
      </form>
      <footer>
        <div>
          <a>Cadastre-se</a>
          <a>Entrar</a>
        </div>
        <div>
          <a>Política de Privacidade</a>
          <a>Central de Privacidade</a>
          <a>Sobre</a>
        </div>
        <div>
          <p>
            &copy; <a>ariellopesdev</a> 2026. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
