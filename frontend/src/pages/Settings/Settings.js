import "./Settings.css";
import { useState } from "react";

const Settings = () => {
  const [name, setName] = useState("Ariel Lopes");
  const [email] = useState("email@email.com");
  const [companyName] = useState("Minha Empresa");
  const [cnpj] = useState("00.000.000/0001-00");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    console.log({ name, password });
  };

  return (
    <div id="settings-page">
      <div className="settingsPage__container">

        {/* HEADER */}
        <div className="settingsPage__header">
          <h2>Configurações</h2>
          <p>Gerencie seus dados e preferências</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* GRID */}
          <div className="settingsPage__grid">

            {/* CONTA */}
            <div className="settingsPage__card">
              <h3>Conta</h3>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome"
              />

              <input type="email" value={email} disabled />
            </div>

            {/* SEGURANÇA */}
            <div className="settingsPage__card">
              <h3>Segurança</h3>

              <input
                type="password"
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* EMPRESA */}
            <div className="settingsPage__card">
              <h3>Empresa</h3>

              <input type="text" value={companyName} disabled />
              <input type="text" value={cnpj} disabled />
            </div>

            {/* PREFERÊNCIAS */}
            <div className="settingsPage__card">
              <h3>Preferências</h3>

              <label>
                <input type="checkbox" />
                Tema escuro
              </label>

              <label>
                <input type="checkbox" />
                Receber notificações
              </label>
            </div>

          </div>

          {/* ACTIONS */}
          <div className="settingsPage__actions">
            <button type="submit">
              Salvar alterações
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Settings;