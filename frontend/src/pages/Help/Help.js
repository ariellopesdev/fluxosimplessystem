import "./Help.css";

// React
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  createSupportTicket,
  getMySupportTickets,
  getSupportTicketById,
  addSupportMessage,
  resetMessage,
  resetSelectedTicket,
} from "../../slices/supportSlice";

// Components
import Message from "../../components/Message/Message";

// Icons
import {
  FaBoxOpen,
  FaUsers,
  FaTools,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaChartBar,
  FaTachometerAlt,
  FaCog,
  FaQuestionCircle,
  FaLightbulb,
  FaPuzzlePiece,
} from "react-icons/fa";

const helpCategories = [
  {
    id: "products",
    icon: <FaBoxOpen />,
    title: "Produtos",
    description: "Cadastro, estoque, imagens e controle de produtos.",
  },
  {
    id: "clients",
    icon: <FaUsers />,
    title: "Clientes",
    description: "Dados, contatos, endereço e histórico do cliente.",
  },
  {
    id: "services",
    icon: <FaTools />,
    title: "Serviços",
    description: "Serviços vendáveis, agendáveis e duração estimada.",
  },
  {
    id: "appointments",
    icon: <FaCalendarAlt />,
    title: "Agendamentos",
    description: "Agenda, disponibilidade, conclusão e cancelamento.",
  },
  {
    id: "financial",
    icon: <FaMoneyBillWave />,
    title: "Financeiro",
    description: "Receitas, despesas, patrimônio e movimentações.",
  },
  {
    id: "reports",
    icon: <FaChartBar />,
    title: "Relatórios",
    description: "Relatórios gerais, específicos e exportação PDF.",
  },
  {
    id: "dashboard",
    icon: <FaTachometerAlt />,
    title: "Dashboard",
    description: "Indicadores, gráficos, alertas e atividades recentes.",
  },
  {
    id: "settings",
    icon: <FaCog />,
    title: "Configurações",
    description: "Perfil, empresa e preferências do sistema.",
  },
];

const tutorials = [
  {
    category: "products",
    question: "Como cadastrar um produto?",
    answer:
      "Acesse Produtos, clique em '+ Novo produto', preencha nome, estoque, preço unitário, categoria e imagem se desejar. Depois salve o cadastro.",
  },
  {
    category: "clients",
    question: "Como cadastrar um cliente?",
    answer:
      "Acesse Clientes, clique em '+ Novo cliente', informe nome, CPF/CNPJ, telefone, e-mail e endereço.",
  },
  {
    category: "services",
    question: "Como criar um serviço?",
    answer:
      "Acesse Serviços, clique em '+ Novo serviço', informe nome, descrição, preço, duração estimada e marque se ele pode ser agendado ou vendido.",
  },
  {
    category: "appointments",
    question: "Como criar um agendamento?",
    answer:
      "Acesse Agendamentos, escolha uma data disponível e clique duas vezes no dia para abrir o novo agendamento.",
  },
  {
    category: "financial",
    question: "Como registrar uma despesa?",
    answer:
      "Acesse Financeiro, clique em '+ Novo registro', selecione o tipo 'Despesa', informe categoria, valor, forma de pagamento e status.",
  },
  {
    category: "reports",
    question: "Como gerar um relatório?",
    answer:
      "Acesse Relatórios, escolha o tipo do relatório, selecione o período e clique em 'Gerar relatório'.",
  },
  {
    category: "dashboard",
    question: "Como atualizar os dados do dashboard?",
    answer:
      "Acesse Dashboard, escolha o período desejado e clique em 'Atualizar'.",
  },
  {
    category: "settings",
    question: "Como editar meus dados?",
    answer:
      "Acesse Configurações, altere os dados do perfil ou da empresa e salve.",
  },
];

const tips = [
  "Cadastre clientes antes de criar agendamentos.",
  "Mantenha o estoque sempre atualizado.",
  "Use o Financeiro para separar receitas, despesas e patrimônio.",
  "Conclua ou cancele agendamentos após o horário do serviço.",
  "Gere relatórios semanalmente para acompanhar o desempenho.",
  "Verifique os alertas do Dashboard com frequência.",
];

const Help = () => {
  const dispatch = useDispatch();

  const { myTickets, selectedTicket, loading, error, message } = useSelector(
    (state) => state.support,
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openTutorial, setOpenTutorial] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const [supportData, setSupportData] = useState({
    subject: "",
    category: "OTHER",
    priority: "MEDIUM",
    message: "",
  });

  useEffect(() => {
    dispatch(getMySupportTickets());
  }, [dispatch]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const filteredTutorials = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return tutorials.filter((item) => {
      const matchesSearch =
        !searchText ||
        item.question.toLowerCase().includes(searchText) ||
        item.answer.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const selectedCategoryData = helpCategories.find(
    (category) => category.id === selectedCategory,
  );

  const translateStatus = (status) => {
    const statuses = {
      OPEN: "Aberto",
      IN_PROGRESS: "Em atendimento",
      ANSWERED: "Respondido",
      CLOSED: "Fechado",
    };

    return statuses[status] || "-";
  };

  const translatePriority = (priority) => {
    const priorities = {
      LOW: "Baixa",
      MEDIUM: "Média",
      HIGH: "Alta",
    };

    return priorities[priority] || "-";
  };

  const handleCreateSupport = async (e) => {
    e.preventDefault();

    await dispatch(createSupportTicket(supportData)).unwrap();

    setSupportData({
      subject: "",
      category: "OTHER",
      priority: "MEDIUM",
      message: "",
    });

    setShowSupportModal(false);
    dispatch(getMySupportTickets());
  };

  const handleOpenTicket = (id) => {
    dispatch(getSupportTicketById(id));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!chatMessage.trim() || !selectedTicket?._id) return;

    await dispatch(
      addSupportMessage({
        id: selectedTicket._id,
        messageData: {
          message: chatMessage,
        },
      }),
    ).unwrap();

    setChatMessage("");
  };

  return (
    <div className="help">
      {error && <Message msg={error} type="error" />}
      {message && <Message msg={message} type="success" />}

      <div className="help__hero">
        <div>
          <span className="help__badge">Central de Ajuda</span>
          <h2>Como podemos ajudar?</h2>
          <p>
            Encontre instruções rápidas ou abra um chamado de suporte para falar
            com a administração.
          </p>
        </div>

        <div className="help__searchBox">
          <input
            type="text"
            placeholder="Buscar ajuda..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button type="button" onClick={() => setSearch("")}>
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="help__cards">
        <button
          type="button"
          className={`help__card ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => {
            setSelectedCategory("all");
            setOpenTutorial(null);
          }}
        >
          <span>
            <FaQuestionCircle />
          </span>
          <strong>Todos</strong>
          <small>Ver toda a ajuda</small>
        </button>

        {helpCategories.map((category) => (
          <button
            type="button"
            key={category.id}
            className={`help__card ${
              selectedCategory === category.id ? "active" : ""
            }`}
            onClick={() => {
              setSelectedCategory(category.id);
              setOpenTutorial(null);
            }}
          >
            <span>{category.icon}</span>
            <strong>{category.title}</strong>
            <small>{category.description}</small>
          </button>
        ))}
      </div>

      <div className="help__content">
        <div className="help__main">
          <div className="help__sectionHeader">
            <div>
              <h3>
                {selectedCategory === "all"
                  ? "Tutoriais rápidos"
                  : selectedCategoryData?.title}
              </h3>

              <p>
                {selectedCategory === "all"
                  ? "Veja respostas para as principais dúvidas do sistema."
                  : selectedCategoryData?.description}
              </p>
            </div>

            <span>{filteredTutorials.length} item(ns)</span>
          </div>

          <div className="help__faq">
            {filteredTutorials.length > 0 ? (
              filteredTutorials.map((item, index) => (
                <div
                  key={`${item.category}-${index}`}
                  className={`help__faqItem ${
                    openTutorial === index ? "open" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenTutorial(openTutorial === index ? null : index)
                    }
                  >
                    <span>{item.question}</span>
                    <strong>{openTutorial === index ? "−" : "+"}</strong>
                  </button>

                  {openTutorial === index && <p>{item.answer}</p>}
                </div>
              ))
            ) : (
              <div className="help__empty">
                Nenhuma ajuda encontrada para essa busca.
              </div>
            )}
          </div>

          <div className="help__tickets">
            <div className="help__sectionHeader">
              <div>
                <h3>Meus chamados</h3>
                <p>Acompanhe suas solicitações e converse com o suporte.</p>
              </div>

              <span>{myTickets?.length || 0} chamado(s)</span>
            </div>

            {myTickets?.length > 0 ? (
              myTickets.map((ticket) => (
                <button
                  type="button"
                  key={ticket._id}
                  className="help__ticketItem"
                  onClick={() => handleOpenTicket(ticket._id)}
                >
                  <div>
                    <strong>{ticket.subject}</strong>
                    <small>
                      {translateStatus(ticket.status)} • Prioridade{" "}
                      {translatePriority(ticket.priority)}
                    </small>
                  </div>

                  <span>
                    {ticket.lastMessageAt
                      ? new Date(ticket.lastMessageAt).toLocaleDateString(
                          "pt-BR",
                        )
                      : "-"}
                  </span>
                </button>
              ))
            ) : (
              <div className="help__empty">Nenhum chamado aberto.</div>
            )}
          </div>
        </div>

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
              Abra um chamado e envie sua dúvida. O administrador será
              notificado por e-mail.
            </p>

            <button type="button" onClick={() => setShowSupportModal(true)}>
              Falar com suporte
            </button>
          </div>
        </aside>
      </div>

      {showSupportModal &&
        createPortal(
          <div className="help__modalOverlay">
            <div className="help__modal">
              <div className="help__modalHeader">
                <h3>Novo chamado de suporte</h3>

                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={handleCreateSupport}
                className="help__supportForm"
              >
                <label>Assunto</label>
                <input
                  type="text"
                  value={supportData.subject}
                  onChange={(e) =>
                    setSupportData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  required
                />

                <label>Categoria</label>
                <select
                  value={supportData.category}
                  onChange={(e) =>
                    setSupportData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  <option value="ACCOUNT">Conta</option>
                  <option value="PRODUCTS">Produtos</option>
                  <option value="CLIENTS">Clientes</option>
                  <option value="SERVICES">Serviços</option>
                  <option value="APPOINTMENTS">Agendamentos</option>
                  <option value="FINANCIAL">Financeiro</option>
                  <option value="REPORTS">Relatórios</option>
                  <option value="DASHBOARD">Dashboard</option>
                  <option value="SETTINGS">Configurações</option>
                  <option value="BUG">Bug</option>
                  <option value="OTHER">Outro</option>
                </select>

                <label>Prioridade</label>
                <select
                  value={supportData.priority}
                  onChange={(e) =>
                    setSupportData((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                >
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                </select>

                <label>Mensagem</label>
                <textarea
                  value={supportData.message}
                  onChange={(e) =>
                    setSupportData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  required
                />

                {!loading && <button type="submit">Enviar chamado</button>}
                {loading && <button disabled>Aguarde...</button>}
              </form>
            </div>
          </div>,
          document.body,
        )}

      {selectedTicket &&
        createPortal(
          <div className="help__modalOverlay">
            <div className="help__modal help__chatModal">
              <div className="help__modalHeader">
                <div>
                  <h3>{selectedTicket.subject}</h3>
                  <small>
                    {translateStatus(selectedTicket.status)} • Prioridade{" "}
                    {translatePriority(selectedTicket.priority)}
                  </small>
                </div>

                <button
                  type="button"
                  onClick={() => dispatch(resetSelectedTicket())}
                >
                  ×
                </button>
              </div>

              <div className="help__chat">
                {selectedTicket.messages?.map((msg) => (
                  <div
                    key={msg._id}
                    className={`help__chatMessage ${
                      msg.senderRole === "SUPER_ADMIN" ||
                      msg.senderRole === "ADMIN"
                        ? "admin"
                        : "user"
                    }`}
                  >
                    <strong>{msg.senderName || "Usuário"}</strong>
                    <p>{msg.message}</p>
                    <small>
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleString("pt-BR")
                        : "-"}
                    </small>
                  </div>
                ))}
              </div>

              {selectedTicket.status !== "CLOSED" && (
                <form onSubmit={handleSendMessage} className="help__chatForm">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                  />

                  {!loading && <button type="submit">Enviar</button>}
                  {loading && <button disabled>...</button>}
                </form>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Help;
