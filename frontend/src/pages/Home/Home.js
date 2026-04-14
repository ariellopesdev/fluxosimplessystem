//CSS
import "./Home.css";

//Components
import Login from "../../components/Login/Login";

const Home = () => {
  return (
    <div className="container-home">
      <div className="block-home">
        <h1>Fluxo Simples System</h1>
      </div>
      <form>
        <h2>Login</h2>
        <label>E-mail</label>
        <input type="email" />
        <label>Senha</label>
        <input type="password" />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Home;
