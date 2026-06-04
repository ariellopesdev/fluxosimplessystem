import { FaLightbulb, FaPuzzlePiece } from "react-icons/fa";

const HelpSidebar = ({ tips, openSupportModal }) => {
  return (
    <aside className="help__sidebar">
      <div className="help__tips">
        <h3>
          <FaLightbulb />
          Dicas do sistema
        </h3>
        <ul>
          {tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="help__support">
        <span>
          <FaPuzzlePiece />
        </span>
        <h3>Precisa de suporte?</h3>
        <p>
          Abra um chamado e envie sua dúvida. O administrador será notificado
          por e-mail.
        </p>
        <button type="button" onClick={openSupportModal}>
          Falar com suporte
        </button>
      </div>
    </aside>
  );
};

export default HelpSidebar;