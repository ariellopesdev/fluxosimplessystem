// CSS
import "./Help.css";

// React
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  addSupportMessage,
  getAllSupportTickets,
  getMySupportTickets,
  getSupportTicketById,
  resetMessage,
  resetSelectedTicket,
  updateSupportStatus,
} from "../../slices/supportSlice";

// Icons
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

// Components
import Message from "../../components/Message/Message";
import HelpHero from "../../components/Help/HelpHero";
import HelpCategories from "../../components/Help/HelpCategories";
import HelpFaq from "../../components/Help/HelpFaq";
import HelpSidebar from "../../components/Help/HelpSidebar";
import HelpTickets from "../../components/Help/HelpTickets";
import SupportModal from "../../components/Help/SupportModal";
import SupportChatModal from "../../components/Help/SupportChatModal";

// Hooks
import { useHelpSupport } from "../../hooks/useHelpSupport";
import { useModal } from "../../hooks/useModal";
import { useSearch } from "../../hooks/useSearch";

// Utils
import {
  translatePriority,
  translateStatus,
  translateCategory,
} from "../../utils/supportUtils";

// Data
import {
  helpCategories,
  tutorials,
  tips,
  supportCategories,
  supportPriorities,
} from "../../data/helpData";

const Help = () => {
  const dispatch = useDispatch();

  const { user: loggedUser } = useSelector((state) => state.auth);

  const { tickets, myTickets, selectedTicket, loading, error, message } =
    useSelector((state) => state.support);

  const isSuperAdmin = loggedUser?.role === "SUPER_ADMIN";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openTutorial, setOpenTutorial] = useState(null);

  const [selectedTicketStatusFilter, setSelectedTicketStatusFilter] =
    useState("OPEN");

  const [adminTutorials, setAdminTutorials] = useState(tutorials || []);

  const [tutorialForm, setTutorialForm] = useState({
    question: "",
    category: "",
    answer: "",
  });

  const [selectedAdminTicket, setSelectedAdminTicket] = useState(null);

  const {
    isOpen: showSupportModal,
    openModal: openSupportModal,
    closeModal: closeSupportModal,
  } = useModal();

  const {
    isOpen: showChatModal,
    openModal: openChatModal,
    closeModal: closeChatModal,
  } = useModal();

  const {
    isOpen: showTutorialModal,
    modalData: selectedTutorial,
    openModal: openTutorialModal,
    closeModal: closeTutorialModal,
  } = useModal();

  const {
    isOpen: showDeleteTutorialModal,
    modalData: selectedDeleteTutorial,
    openModal: openDeleteTutorialModal,
    closeModal: closeDeleteTutorialModal,
  } = useModal();

  const {
    isOpen: showAdminTicketModal,
    openModal: openAdminTicketModal,
    closeModal: closeAdminTicketModal,
  } = useModal();

  const {
    supportData,
    supportErrors,
    chatMessage,
    chatError,
    setChatMessage,
    handleSupportChange,
    handleCreateSupport,
    handleSendMessage,
  } = useHelpSupport(dispatch, selectedTicket, closeSupportModal);

  const ticketsList = useMemo(() => {
    const list = isSuperAdmin ? tickets : myTickets;
    return Array.isArray(list) ? list : [];
  }, [tickets, myTickets, isSuperAdmin]);

  const {
    search: adminTicketSearch,
    setSearch: setAdminTicketSearch,
    filteredItems: filteredAdminTickets,
  } = useSearch(ticketsList, [
    "subject",
    "category",
    "priority",
    "status",
    (ticket) => String(ticket.ticketNumber || ""),
    (ticket) => ticket.openedBy?.name || "",
    (ticket) => ticket.openedBy?.email || "",
    (ticket) => translateStatus(ticket.status),
    (ticket) => translatePriority(ticket.priority),
    (ticket) => ticket.messages?.[0]?.message || "",
  ]);

  const visibleAdminTickets = useMemo(() => {
    return filteredAdminTickets.filter(
      (ticket) => ticket.status === selectedTicketStatusFilter,
    );
  }, [filteredAdminTickets, selectedTicketStatusFilter]);

  const totalOpenTickets = ticketsList.filter(
    (ticket) => ticket.status === "OPEN",
  ).length;

  const totalInProgressTickets = ticketsList.filter(
    (ticket) => ticket.status === "IN_PROGRESS",
  ).length;

  const totalCompletedTickets = ticketsList.filter(
    (ticket) => ticket.status === "CLOSED",
  ).length;

  const totalCanceledTickets = ticketsList.filter(
    (ticket) => ticket.status === "CANCELED",
  ).length;

  useEffect(() => {
    if (isSuperAdmin) {
      dispatch(getAllSupportTickets());
    } else {
      dispatch(getMySupportTickets());
    }
  }, [dispatch, isSuperAdmin]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showAdminTicketModal) {
        handleCloseAdminTicketModal();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [showAdminTicketModal]);

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

  const handleOpenTicket = async (id) => {
    await dispatch(getSupportTicketById(id));
    openChatModal();
  };

  const handleCloseChatModal = () => {
    closeChatModal();
    dispatch(resetSelectedTicket());
  };

  const handleTutorialChange = (field, value) => {
    setTutorialForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const resetTutorialForm = () => {
    setTutorialForm({
      question: "",
      category: "",
      answer: "",
    });
  };

  const fillTutorialForm = (tutorial) => {
    setTutorialForm({
      question: tutorial.question || "",
      category: tutorial.category || "",
      answer: tutorial.answer || "",
    });
  };

  const handleOpenCreateTutorialModal = () => {
    resetTutorialForm();
    openTutorialModal(null);
  };

  const handleOpenEditTutorialModal = (tutorial) => {
    fillTutorialForm(tutorial);
    openTutorialModal(tutorial);
  };

  const handleCloseTutorialModal = () => {
    closeTutorialModal();
    resetTutorialForm();
  };

  const handleSubmitTutorial = (e) => {
    e.preventDefault();

    const tutorialData = {
      id: selectedTutorial?.id || selectedTutorial?._id || crypto.randomUUID(),
      question: tutorialForm.question.trim(),
      category: tutorialForm.category,
      answer: tutorialForm.answer.trim(),
    };

    if (
      !tutorialData.question ||
      !tutorialData.category ||
      !tutorialData.answer
    ) {
      return;
    }

    if (selectedTutorial?.id) {
      setAdminTutorials((prevState) =>
        prevState.map((tutorial) =>
          tutorial.id === selectedTutorial.id ? tutorialData : tutorial,
        ),
      );
    } else {
      setAdminTutorials((prevState) => [tutorialData, ...prevState]);
    }

    handleCloseTutorialModal();
  };

  const handleConfirmDeleteTutorial = () => {
    if (!selectedDeleteTutorial?.id) return;

    setAdminTutorials((prevState) =>
      prevState.filter((tutorial) => tutorial.id !== selectedDeleteTutorial.id),
    );

    closeDeleteTutorialModal();
  };

  const handleOpenAdminTicket = (ticket) => {
    setSelectedAdminTicket(ticket);
    setChatMessage("");
    openAdminTicketModal();
  };

  const handleCloseAdminTicketModal = () => {
    closeAdminTicketModal();
    setSelectedAdminTicket(null);
    setChatMessage("");
  };

  const formatTicketNumber = (ticket) => {
    const number = ticket.ticketNumber || ticket._id?.slice(-4) || "0000";

    return `#${String(number).padStart(4, "0")}`;
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("pt-BR");
  };

  const isAdminMessage = (role) => {
    return role === "SUPER_ADMIN" || role === "ADMIN";
  };

  const isTicketFinished = (ticket) => {
    return ticket?.status === "CLOSED" || ticket?.status === "CANCELED";
  };

  const getTicketStatusTitle = () => {
    const titles = {
      OPEN: "Chamados aguardando atendimento",
      IN_PROGRESS: "Chamados em andamento",
      CLOSED: "Chamados concluídos",
      CANCELED: "Chamados cancelados",
    };

    return titles[selectedTicketStatusFilter] || "Chamados";
  };

  const handleUpdateTicketStatus = async (ticketId, status) => {
    const result = await dispatch(
      updateSupportStatus({
        id: ticketId,
        statusData: { status },
      }),
    );

    if (updateSupportStatus.fulfilled.match(result)) {
      handleCloseAdminTicketModal();
      dispatch(getAllSupportTickets());
    }
  };

  const handleSendAdminResponse = async (e) => {
    e.preventDefault();

    if (!selectedAdminTicket?._id || !chatMessage.trim()) {
      return;
    }

    const result = await dispatch(
      addSupportMessage({
        id: selectedAdminTicket._id,
        messageData: {
          message: chatMessage.trim(),
        },
      }),
    );

    if (addSupportMessage.fulfilled.match(result)) {
      setChatMessage("");
      handleCloseAdminTicketModal();
      dispatch(getAllSupportTickets());
    }
  };

  if (isSuperAdmin) {
    return (
      <div className="help helpAccess">
        <div className="helpAccess__header">
          <h2>
            <FiHelpCircle />
            Central de Ajuda
          </h2>

          <button
            type="button"
            className="helpAccess__btn"
            onClick={handleOpenCreateTutorialModal}
          >
            + Novo Tutorial
          </button>
        </div>

        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}

        <div className="helpAccess__cards">
          <button
            type="button"
            className={`helpAccessCard green ${
              selectedTicketStatusFilter === "OPEN" ? "active" : ""
            }`}
            onClick={() => setSelectedTicketStatusFilter("OPEN")}
          >
            {totalOpenTickets} Abertos
          </button>

          <button
            type="button"
            className={`helpAccessCard blue ${
              selectedTicketStatusFilter === "IN_PROGRESS" ? "active" : ""
            }`}
            onClick={() => setSelectedTicketStatusFilter("IN_PROGRESS")}
          >
            {totalInProgressTickets} Em andamento
          </button>

          <button
            type="button"
            className={`helpAccessCard orange ${
              selectedTicketStatusFilter === "CLOSED" ? "active" : ""
            }`}
            onClick={() => setSelectedTicketStatusFilter("CLOSED")}
          >
            {totalCompletedTickets} Concluídos
          </button>

          <button
            type="button"
            className={`helpAccessCard red ${
              selectedTicketStatusFilter === "CANCELED" ? "active" : ""
            }`}
            onClick={() => setSelectedTicketStatusFilter("CANCELED")}
          >
            {totalCanceledTickets} Cancelados
          </button>
        </div>

        <div className="helpAccess__filters">
          <input
            type="text"
            placeholder="Buscar chamado..."
            value={adminTicketSearch}
            onChange={(e) => setAdminTicketSearch(e.target.value)}
          />
        </div>

        <div className="helpAccess__listHeader">
          <h3>{getTicketStatusTitle()}</h3>
        </div>

        <div className="helpAccess__table">
          <table>
            <thead>
              <tr>
                <th>Chamado</th>
                <th>Usuário</th>
                <th>Categoria</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {visibleAdminTickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  onDoubleClick={() => handleOpenAdminTicket(ticket)}
                >
                  <td>
                    <strong>{formatTicketNumber(ticket)}</strong>
                    <span>
                      {translateCategory(ticket.category) || "Suporte"}
                    </span>
                  </td>

                  <td>
                    <strong>{ticket.openedBy?.name || "Usuário"}</strong>
                    <span>
                      {ticket.openedBy?.email || "E-mail não informado"}
                    </span>
                  </td>

                  <td>{translateCategory(ticket.category) || "-"}</td>

                  <td>
                    <span className="status active">
                      {translatePriority(ticket.priority)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status ${
                        ticket.status === "CLOSED" ? "active" : "inactive"
                      }`}
                    >
                      {translateStatus(ticket.status)}
                    </span>
                  </td>

                  <td>
                    {isTicketFinished(ticket) ? (
                      <span className="status inactive">Consulta</span>
                    ) : (
                      <div className="helpAccess__actions">
                        <button
                          type="button"
                          className="helpAccess__actionButton"
                          onClick={() =>
                            handleUpdateTicketStatus(ticket._id, "CLOSED")
                          }
                        >
                          Concluir
                        </button>

                        <button
                          type="button"
                          className="helpAccess__actionButton cancel"
                          onClick={() =>
                            handleUpdateTicketStatus(ticket._id, "CANCELED")
                          }
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && visibleAdminTickets.length === 0 && (
            <p className="helpAccess__empty">Nenhum chamado encontrado.</p>
          )}

          {loading && (
            <p className="helpAccess__empty">Carregando chamados...</p>
          )}
        </div>

        <div className="helpAccess__tutorials">
          <div className="helpAccess__sectionHeader">
            <div>
              <h3>Tutoriais rápidos</h3>
              <p>Gerencie as perguntas exibidas na tela de ajuda.</p>
            </div>
          </div>

          <div className="helpAccess__tutorialGrid">
            {adminTutorials.map((tutorial, index) => (
              <div
                key={
                  tutorial.id || tutorial._id || `${tutorial.category}-${index}`
                }
                className="helpAccess__tutorialCard"
              >
                <div>
                  <strong>{tutorial.question}</strong>
                  <span>{tutorial.category}</span>
                </div>

                <p>{tutorial.answer}</p>

                <div className="table__edit--close">
                  <span
                    className="helpAccess__actionIcon edit"
                    onClick={() => handleOpenEditTutorialModal(tutorial)}
                  >
                    <FaEdit />
                  </span>

                  <span
                    className="helpAccess__actionIcon delete"
                    onClick={() => openDeleteTutorialModal(tutorial)}
                  >
                    <FaTrash />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showTutorialModal &&
          createPortal(
            <div className="helpAccess__modalOverlay">
              <div className="helpAccess__modal">
                <div className="helpAccess__modalHeader">
                  <h3>
                    {selectedTutorial ? "Editar Tutorial" : "Novo Tutorial"}
                  </h3>

                  <button
                    type="button"
                    className="helpAccess__closeBtn"
                    onClick={handleCloseTutorialModal}
                  >
                    <IoClose />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmitTutorial}
                  className="helpAccess__form"
                >
                  <div className="helpAccess__section">
                    <h4>Dados do tutorial</h4>

                    <div className="helpAccess__grid">
                      <div className="form__group--helpAccess">
                        <label>Pergunta</label>
                        <input
                          type="text"
                          placeholder="Digite a pergunta"
                          value={tutorialForm.question}
                          onChange={(e) =>
                            handleTutorialChange("question", e.target.value)
                          }
                        />
                      </div>

                      <div className="form__group--helpAccess">
                        <label>Categoria</label>
                        <select
                          value={tutorialForm.category}
                          onChange={(e) =>
                            handleTutorialChange("category", e.target.value)
                          }
                        >
                          <option value="">Selecione uma categoria</option>

                          {helpCategories
                            .filter((category) => category.id !== "all")
                            .map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.title}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="form__group--helpAccess full">
                        <label>Resposta</label>
                        <textarea
                          placeholder="Digite a resposta do tutorial"
                          value={tutorialForm.answer}
                          onChange={(e) =>
                            handleTutorialChange("answer", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="helpAccess__btn">
                    {selectedTutorial
                      ? "Salvar alterações"
                      : "Cadastrar Tutorial"}
                  </button>
                </form>
              </div>
            </div>,
            document.body,
          )}

        {showDeleteTutorialModal &&
          selectedDeleteTutorial &&
          createPortal(
            <div className="helpAccess__modalOverlay">
              <div className="helpAccess__deleteModal">
                <div className="helpAccess__modalHeader">
                  <h3>Excluir Tutorial</h3>

                  <button
                    type="button"
                    className="helpAccess__closeBtn"
                    onClick={closeDeleteTutorialModal}
                  >
                    <IoClose />
                  </button>
                </div>

                <div className="helpAccess__deleteContent">
                  <p>Deseja realmente excluir o tutorial:</p>
                  <strong>{selectedDeleteTutorial.question}</strong>
                  <span>Esta ação não poderá ser desfeita.</span>
                </div>

                <div className="helpAccess__deleteActions">
                  <button
                    type="button"
                    className="helpAccess__btn helpAccess__btnSecondary"
                    onClick={closeDeleteTutorialModal}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="helpAccess__btn helpAccess__btnDanger"
                    onClick={handleConfirmDeleteTutorial}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}

        {showAdminTicketModal &&
          selectedAdminTicket &&
          createPortal(
            <div className="helpAccess__modalOverlay">
              <div className="helpAccess__modal helpAccess__ticketModal">
                <div className="helpAccess__modalHeader">
                  <div>
                    <h3>{formatTicketNumber(selectedAdminTicket)}</h3>
                    <small>{selectedAdminTicket.subject}</small>
                  </div>

                  <button
                    type="button"
                    className="helpAccess__closeBtn"
                    onClick={handleCloseAdminTicketModal}
                  >
                    <IoClose />
                  </button>
                </div>

                <div className="helpAccess__ticketSummary">
                  <div className="helpAccess__ticketDetails">
                    <div>
                      <strong>Usuário</strong>
                      <span>
                        {selectedAdminTicket.openedBy?.name || "Usuário"}
                      </span>
                    </div>

                    <div>
                      <strong>Status</strong>
                      <span>{translateStatus(selectedAdminTicket.status)}</span>
                    </div>

                    <div>
                      <strong>Prioridade</strong>
                      <span>
                        {translatePriority(selectedAdminTicket.priority)}
                      </span>
                    </div>

                    <div>
                      <strong>Categoria</strong>
                      <span>
                        {translateCategory(selectedAdminTicket.category) || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="helpAccess__ticketDescription">
                    <strong>Mensagem de abertura</strong>
                    <p>{selectedAdminTicket.messages?.[0]?.message || "-"}</p>
                  </div>
                </div>

                <div className="helpAccess__chatBox">
                  <div className="helpAccess__chatHeader">
                    <div>
                      <strong>Histórico da conversa</strong>
                      <span>
                        {selectedAdminTicket.messages?.length || 0} mensagem(ns)
                        registradas
                      </span>
                    </div>
                  </div>

                  <div className="helpAccess__chat">
                    {selectedAdminTicket.messages?.map((msg) => (
                      <div
                        key={msg._id}
                        className={`helpAccess__chatMessage ${
                          isAdminMessage(msg.senderRole) ? "admin" : "user"
                        }`}
                      >
                        <strong>{msg.senderName || "Usuário"}</strong>
                        <p>{msg.message}</p>
                        <small>{formatDateTime(msg.createdAt)}</small>
                      </div>
                    ))}
                  </div>
                </div>

                {isTicketFinished(selectedAdminTicket) && (
                  <div className="helpAccess__closedInfo">
                    <strong>
                      Chamado{" "}
                      {selectedAdminTicket.status === "CLOSED"
                        ? "concluído"
                        : "cancelado"}
                    </strong>
                    <span>
                      Por {selectedAdminTicket.assignedTo?.name || "suporte"} em{" "}
                      {formatDateTime(selectedAdminTicket.closedAt)}
                    </span>
                  </div>
                )}

                {!isTicketFinished(selectedAdminTicket) && (
                  <form
                    onSubmit={handleSendAdminResponse}
                    className="helpAccess__form"
                  >
                    <div className="form__group--helpAccess full">
                      <label>Resposta do suporte</label>
                      <textarea
                        placeholder="Digite sua resposta..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                      />
                    </div>

                    <div className="helpAccess__deleteActions">
                      <button type="submit" className="helpAccess__btn">
                        Enviar resposta
                      </button>

                      <button
                        type="button"
                        className="helpAccess__btn"
                        onClick={() =>
                          handleUpdateTicketStatus(
                            selectedAdminTicket._id,
                            "CLOSED",
                          )
                        }
                      >
                        Concluir chamado
                      </button>

                      <button
                        type="button"
                        className="helpAccess__btn helpAccess__btnDanger"
                        onClick={() =>
                          handleUpdateTicketStatus(
                            selectedAdminTicket._id,
                            "CANCELED",
                          )
                        }
                      >
                        Cancelar chamado
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>,
            document.body,
          )}
      </div>
    );
  }

  return (
    <div className="help">
      {error && <Message msg={error} type="error" />}
      {message && <Message msg={message} type="success" />}

      <HelpHero search={search} setSearch={setSearch} />

      <HelpCategories
        helpCategories={helpCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setOpenTutorial={setOpenTutorial}
      />

      <div className="help__content">
        <div className="help__main">
          <HelpFaq
            selectedCategory={selectedCategory}
            selectedCategoryData={selectedCategoryData}
            filteredTutorials={filteredTutorials}
            openTutorial={openTutorial}
            setOpenTutorial={setOpenTutorial}
          />

          <HelpTickets
            myTickets={myTickets}
            translateStatus={translateStatus}
            translatePriority={translatePriority}
            handleOpenTicket={handleOpenTicket}
          />
        </div>

        <HelpSidebar tips={tips} openSupportModal={openSupportModal} />
      </div>

      {showSupportModal && (
        <SupportModal
          loading={loading}
          supportData={supportData}
          supportErrors={supportErrors}
          supportCategories={supportCategories}
          supportPriorities={supportPriorities}
          handleSupportChange={handleSupportChange}
          handleCreateSupport={handleCreateSupport}
          closeSupportModal={closeSupportModal}
        />
      )}

      {showChatModal && selectedTicket && (
        <SupportChatModal
          loading={loading}
          selectedTicket={selectedTicket}
          chatMessage={chatMessage}
          chatError={chatError}
          setChatMessage={setChatMessage}
          handleSendMessage={handleSendMessage}
          closeChatModal={handleCloseChatModal}
        />
      )}
    </div>
  );
};

export default Help;
