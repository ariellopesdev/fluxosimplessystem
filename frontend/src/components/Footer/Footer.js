//CSS
import "./Footer.css";

//Hooks
import { useEffect, useState } from "react";

//Icons
import {
  FaShieldAlt,
  FaUserLock,
  FaInfoCircle,
  FaDownload,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";

const Footer = () => {
  //Modal state
  const [modal, setModal] = useState(null);
  //Privacy request state
  const [privacyRequest, setPrivacyRequest] = useState(null);

  //Open modal
  const openModal = (modalName) => {
    setModal(modalName);
    setPrivacyRequest(null);
  };

  //Close modal
  const closeModal = () => {
    setModal(null);
    setPrivacyRequest(null);
  };

  //Close modal with ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  //Privacy request messages
  const privacyRequestContent = {
    export: {
      title: "Solicitação de exportação",
      text: "Para continuar, acesse a página de Ajuda dentro do sistema e abra um chamado de suporte solicitando a exportação dos seus dados.",
    },
    correction: {
      title: "Solicitação de correção",
      text: "Para continuar, acesse a página de Ajuda dentro do sistema e informe quais dados precisam ser corrigidos ou atualizados.",
    },
    delete: {
      title: "Solicitação de remoção",
      text: "Para continuar, acesse a página de Ajuda dentro do sistema e abra um chamado solicitando análise para remoção de dados ou conta.",
    },
  };

  //Modal content
  const modalContent = {
    privacy: {
      icon: <FaShieldAlt />,
      title: "Política de Privacidade",
      subtitle: "Como protegemos e utilizamos suas informações.",
      body: (
        <>
          <p>
            O Fluxo Simples System coleta apenas os dados necessários para o
            funcionamento da plataforma, como informações de usuários, empresas,
            clientes, produtos, vendas, agendamentos e relatórios.
          </p>
          <div className="footer__infoGrid">
            <div>
              <strong>Coleta limitada</strong>
              <p>Usamos somente dados essenciais para operação do sistema.</p>
            </div>
            <div>
              <strong>Proteção de dados</strong>
              <p>As informações ficam vinculadas à empresa responsável.</p>
            </div>
            <div>
              <strong>Sem venda de dados</strong>
              <p>Não comercializamos informações cadastradas no sistema.</p>
            </div>
          </div>
          <p>
            O uso da plataforma implica ciência de que os dados inseridos são de
            responsabilidade da empresa cadastrada.
          </p>
        </>
      ),
    },

    privacyCenter: {
      icon: <FaUserLock />,
      title: "Central de Privacidade",
      subtitle: "Gerencie solicitações relacionadas aos seus dados.",
      body: (
        <>
          <p>
            A Central de Privacidade reúne orientações sobre acesso, correção,
            exportação ou remoção de informações cadastradas.
          </p>
          <div className="footer__infoGrid footer__infoGrid--actions">
            <button
              type="button"
              className={`footer__requestCard ${
                privacyRequest === "export" ? "active" : ""
              }`}
              onClick={() => setPrivacyRequest("export")}
            >
              <span>
                <FaDownload />
              </span>
              <strong>Exportação</strong>
              <p>Solicite uma cópia dos dados vinculados à sua conta.</p>
            </button>
            <button
              type="button"
              className={`footer__requestCard ${
                privacyRequest === "correction" ? "active" : ""
              }`}
              onClick={() => setPrivacyRequest("correction")}
            >
              <span>
                <FaEdit />
              </span>
              <strong>Correção</strong>
              <p>Faça alteração de informações incorretas ou desatualizadas.</p>
            </button>
            <button
              type="button"
              className={`footer__requestCard ${
                privacyRequest === "delete" ? "active" : ""
              }`}
              onClick={() => setPrivacyRequest("delete")}
            >
              <span>
                <FaTrashAlt />
              </span>
              <strong>Remoção</strong>
              <p>Solicite análise para exclusão de dados ou conta.</p>
            </button>
          </div>

          {privacyRequest && (
            <div className="footer__privacyRequest">
              <strong>{privacyRequestContent[privacyRequest].title}</strong>
              <p>{privacyRequestContent[privacyRequest].text}</p>
            </div>
          )}

          <p>
            Para qualquer solicitação, utilize a página de Ajuda e abra um
            chamado de suporte.
          </p>
        </>
      ),
    },

    about: {
      icon: <FaInfoCircle />,
      title: "Sobre o Fluxo Simples System",
      subtitle: "Sistema de gestão simples, direto e profissional.",
      body: (
        <>
          <p>
            O Fluxo Simples System foi desenvolvido para auxiliar pequenas
            empresas na organização de clientes, vendas, produtos, serviços,
            agendamentos, financeiro, relatórios e dashboard.
          </p>
          <div className="footer__infoGrid">
            <div>
              <strong>Gestão integrada</strong>
              <p>Centraliza os principais módulos da empresa em um só lugar.</p>
            </div>
            <div>
              <strong>Fluxo simples</strong>
              <p>Interface objetiva para facilitar o uso no dia a dia.</p>
            </div>
            <div>
              <strong>Desenvolvimento</strong>
              <p>Criado por Ariel Lopes como solução web fullstack.</p>
            </div>
          </div>
          <p>Versão 1.0.0 — Fluxo Simples System © 2026.</p>
        </>
      ),
    },
  };

  const currentModal = modalContent[modal];

  return (
    <>
      <footer id="footer">
        {/* Footer Links */}
        <div className="footer--links">
          <button type="button" onClick={() => openModal("privacy")}>
            Política de Privacidade
          </button>
          <button type="button" onClick={() => openModal("privacyCenter")}>
            Central de Privacidade
          </button>
          <button type="button" onClick={() => openModal("about")}>
            Sobre
          </button>
        </div>

         {/* Footer Copyright */}
        <div className="footer--copyright">
          <p>
            &copy;{" "}
            <a
              href="https://ariellopesdev.github.io/portfolio-professional/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ariellopesdev
            </a>{" "}
            2026. Todos os direitos reservados.
          </p>
        </div>
      </footer>

       {/* Modal */}
      {currentModal && (
        <div className="footer__modalOverlay" onClick={closeModal}>
          <div className="footer__modal" onClick={(e) => e.stopPropagation()}>

             {/* Close Button */}
            <button
              type="button"
              className="footer__close"
              onClick={closeModal}
            >
              ×
            </button>

             {/* Modal Header */}
            <div className="footer__modalHero">
              <span>{currentModal.icon}</span>
              <div>
                <h2>{currentModal.title}</h2>
                <p>{currentModal.subtitle}</p>
              </div>
            </div>
            <div className="footer__modalBody">{currentModal.body}</div>

             {/* Modal Footer */}
            <div className="footer__modalFooter">
              <button type="button" onClick={closeModal}>
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
