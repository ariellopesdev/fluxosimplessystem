import "./Footer.css";
import { useState } from "react";
import { FaShieldAlt, FaUserLock, FaInfoCircle } from "react-icons/fa";

const Footer = () => {
  const [modal, setModal] = useState(null);

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
            O uso da plataforma implica ciência de que os dados inseridos são
            de responsabilidade da empresa cadastrada.
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

          <div className="footer__infoGrid">
            <div>
              <strong>Exportação</strong>
              <p>Solicite uma cópia dos dados vinculados à sua conta.</p>
            </div>

            <div>
              <strong>Correção</strong>
              <p>Peça alteração de informações incorretas ou desatualizadas.</p>
            </div>

            <div>
              <strong>Remoção</strong>
              <p>Solicite análise para exclusão de dados ou conta.</p>
            </div>
          </div>

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

          <p>
            Versão 1.0.0 — Fluxo Simples System © 2026.
          </p>
        </>
      ),
    },
  };

  const currentModal = modalContent[modal];

  return (
    <>
      <footer id="footer">
        <div className="footer--links">
          <button type="button" onClick={() => setModal("privacy")}>
            Política de Privacidade
          </button>

          <button type="button" onClick={() => setModal("privacyCenter")}>
            Central de Privacidade
          </button>

          <button type="button" onClick={() => setModal("about")}>
            Sobre
          </button>
        </div>

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

      {currentModal && (
        <div className="footer__modalOverlay" onClick={() => setModal(null)}>
          <div className="footer__modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="footer__close"
              onClick={() => setModal(null)}
            >
              ×
            </button>

            <div className="footer__modalHero">
              <span>{currentModal.icon}</span>

              <div>
                <h2>{currentModal.title}</h2>
                <p>{currentModal.subtitle}</p>
              </div>
            </div>

            <div className="footer__modalBody">{currentModal.body}</div>

            <div className="footer__modalFooter">
              <button type="button" onClick={() => setModal(null)}>
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