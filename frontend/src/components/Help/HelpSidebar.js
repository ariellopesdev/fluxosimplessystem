import { FaLightbulb } from "react-icons/fa";

const HelpSidebar = ({ tips }) => {
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
    </aside>
  );
};

export default HelpSidebar;