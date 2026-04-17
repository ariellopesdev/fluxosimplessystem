//CSS
import "./Register.css";

//Components
import Footer from "../../components/Footer/Footer";

const Register = () => {
  return (
    <div id="register">
      <header id="register__header">
        <button className="register__header--company">
          fluxo simples <span id="register__header--highlight">system</span>
        </button>
        <form className="form__register--login">
          <input type="email" placeholder="E-mail" />
          <input type="password" placeholder="Senha" />
          <button type="submit" className="register__btn--primary">
            Entrar
          </button>
        </form>
      </header>
      <main id="register__main">
        <form className="form__register">
          <h2>Criar conta</h2>
          <input type="text" placeholder="Nome completo" name="name" />
          <input type="email" placeholder="E-mail" name="email" />
          <input type="password" placeholder="Senha" name="password" />
          <input
            type="password"
            placeholder="Confirmar senha"
            name="confirmPassword"
          />
          <input type="text" placeholder="Nome da empresa" name="companyName" />
          <input type="text" placeholder="CNPJ da empresa" name="cnpj" />
          <button type="submit" className="register__btn--primary">
            Criar conta
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
