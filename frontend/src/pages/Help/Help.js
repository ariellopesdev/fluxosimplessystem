import "./Help.css";
import { useState } from "react";

const Help = () => {
  const [open, setOpen] = useState(null);

  const toggle = (index) => {
    setOpen(open === index ? null : index);
  };

  return (
    <div className="help">

      {/* HEADER */}
      <div className="help__header">
        <h2>Ajuda</h2>
        <input
          type="text"
          placeholder="Buscar ajuda..."
          className="help__search"
        />
      </div>

      {/* CATEGORIAS */}
      <div className="help__cards">
        <div className="card__item">👤 Conta</div>
        <div className="card__item">📦 Produtos</div>
        <div className="card__item">📊 Relatórios</div>
        <div className="card__item">⚙ Configurações</div>
      </div>

      {/* FAQ */}
      <div className="help__faq">
        <h3>Perguntas Frequentes</h3>

        <div className="faq__item" onClick={() => toggle(0)}>
          <h4>Como cadastrar um produto?</h4>
          {open === 0 && <p>Vá até Produtos e clique em "Novo Produto".</p>}
        </div>

        <div className="faq__item" onClick={() => toggle(1)}>
          <h4>Como editar meu perfil?</h4>
          {open === 1 && <p>Acesse Perfil e altere suas informações.</p>}
        </div>

        <div className="faq__item" onClick={() => toggle(2)}>
          <h4>Como visualizar relatórios?</h4>
          {open === 2 && <p>Vá até Relatórios no menu lateral.</p>}
        </div>

      </div>

      {/* SUPORTE */}
      <div className="help__support">
        <h3>Precisa de ajuda?</h3>
        <p>Entre em contato com nosso suporte.</p>
        <button>Falar com suporte</button>
      </div>

    </div>
  );
};

export default Help;