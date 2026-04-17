import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="footer--links">
        <a>Cadastre-se</a>
        <a>Entrar</a>
      </div>
      <div className="footer--links">
        <a>Política de Privacidade</a>
        <a>Central de Privacidade</a>
        <a>Sobre</a>
      </div>
      <div className="footer--copyright">
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
  );
};

export default Footer;
