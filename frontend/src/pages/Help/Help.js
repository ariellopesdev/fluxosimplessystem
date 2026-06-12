// CSS
import "./Help.css";

// React
import { useEffect, useMemo, useState } from "react";

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
  markSupportTicketAsRead,
} from "../../slices/supportSlice";

// Icons
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";

// Components
import Message from "../../components/Message/Message";
import HelpHero from "../../components/Help/HelpHero";
import HelpCategories from "../../components/Help/HelpCategories";
import HelpFaq from "../../components/Help/HelpFaq";
import HelpSidebar from "../../components/Help/HelpSidebar";
import HelpTickets from "../../components/Help/HelpTickets";
import SupportModal from "../../components/Help/SupportModal";
import SupportChatModal from "../../components/Help/SupportChatModal";
import AdminTutorialModal from "../../components/Help/AdminTutorialModal";
import DeleteTutorialModal from "../../components/Help/DeleteTutorialModal";
import AdminTicketModal from "../../components/Help/AdminTicketModal";

// Hooks
import { useHelpSupport } from "../../hooks/useHelpSupport";
import { useModal } from "../../hooks/useModal";
import { useSearch } from "../../hooks/useSearch";
import { useAdminTutorials } from "../../hooks/useAdminTutorials";

// Utils
import {
  translatePriority,
  translateStatus,
  translateCategory,
  formatTicketNumber,
  formatDateTime,
  isTicketFinished,
  getTicketStatusTitle,
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

  const [adminView, setAdminView] = useState("tickets");
  const [userHelpView, setUserHelpView] = useState("tutorials");

  const { tickets, myTickets, selectedTicket, loading, error, message } =
    useSelector((state) => state.support);

  const isSuperAdmin = loggedUser?.role === "SUPER_ADMIN";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openTutorial, setOpenTutorial] = useState(null);

  const [selectedTicketStatusFilter, setSelectedTicketStatusFilter] =
    useState("OPEN");

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
    adminTutorials,
    tutorialForm,
    handleTutorialChange,
    handleOpenCreateTutorialModal,
    handleOpenEditTutorialModal,
    handleCloseTutorialModal,
    handleSubmitTutorial,
    handleConfirmDeleteTutorial,
  } = useAdminTutorials(
    selectedTutorial,
    selectedDeleteTutorial,
    openTutorialModal,
    closeTutorialModal,
    closeDeleteTutorialModal,
  );

  // Close user support ticket chat
  const handleCloseChatModal = () => {
    closeChatModal();
    dispatch(resetSelectedTicket());
  };

  const {
    supportData,
    supportErrors,
    chatMessage,
    chatError,
    setChatMessage,
    handleSupportChange,
    handleCreateSupport,
    handleSendMessage,
  } = useHelpSupport(
    dispatch,
    selectedTicket,
    closeSupportModal,
    handleCloseChatModal,
  );

  // Normalize ticket list based on current role
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

  // Apply ticket status filter
  const visibleAdminTickets = useMemo(() => {
    return filteredAdminTickets.filter(
      (ticket) => ticket.status === selectedTicketStatusFilter,
    );
  }, [filteredAdminTickets, selectedTicketStatusFilter]);

  // Calculate dashboard ticket counters
  const ticketTotals = useMemo(() => {
    return {
      open: ticketsList.filter((ticket) => ticket.status === "OPEN").length,
      inProgress: ticketsList.filter(
        (ticket) => ticket.status === "IN_PROGRESS",
      ).length,
      completed: ticketsList.filter((ticket) => ticket.status === "CLOSED")
        .length,
      canceled: ticketsList.filter((ticket) => ticket.status === "CANCELED")
        .length,
    };
  }, [ticketsList]);

  // Load support tickets based on user role
  useEffect(() => {
    if (isSuperAdmin) {
      dispatch(getAllSupportTickets());
    } else {
      dispatch(getMySupportTickets());
    }
  }, [dispatch, isSuperAdmin]);

  // Auto clear feedback messages
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  // Close admin ticket modal with Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showAdminTicketModal) {
        handleCloseAdminTicketModal();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [showAdminTicketModal]);

  // Filter tutorials by search and category
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

  // Open user support ticket chat
  const handleOpenTicket = async (id) => {
    await dispatch(getSupportTicketById(id));
    await dispatch(markSupportTicketAsRead(id));
    openChatModal();
  };

  // Open admin ticket details
  const handleOpenAdminTicket = async (ticket) => {
    setSelectedAdminTicket(ticket);
    setChatMessage("");
    openAdminTicketModal();

    await dispatch(markSupportTicketAsRead(ticket._id));
    dispatch(getAllSupportTickets());
  };

  // Close admin ticket details
  const handleCloseAdminTicketModal = () => {
    closeAdminTicketModal();
    setSelectedAdminTicket(null);
    setChatMessage("");
  };

  // Update support ticket status
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

  // Send admin response to support ticket
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

  // Render administrative help center for Super Admin
  if (isSuperAdmin) {
    return (
      <div className="help helpAccess">
        <div className="helpAccess__header">
          <h2>
            <FiHelpCircle />
            Central de Ajuda
          </h2>

          {adminView === "tutorials" && (
            <button
              type="button"
              className="helpAccess__btn"
              onClick={handleOpenCreateTutorialModal}
            >
              + Novo Tutorial
            </button>
          )}
        </div>

        <div className="helpAccess__tabs">
          <button
            type="button"
            className={`helpAccess__tab ${
              adminView === "tickets" ? "active" : ""
            }`}
            onClick={() => setAdminView("tickets")}
          >
            Chamados de suporte
          </button>

          <button
            type="button"
            className={`helpAccess__tab ${
              adminView === "tutorials" ? "active" : ""
            }`}
            onClick={() => setAdminView("tutorials")}
          >
            Tutoriais rápidos
          </button>
        </div>

        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}

        {adminView === "tickets" && (
          <>
            <div className="helpAccess__cards">
              <button
                type="button"
                className={`helpAccessCard green ${
                  selectedTicketStatusFilter === "OPEN" ? "active" : ""
                }`}
                onClick={() => setSelectedTicketStatusFilter("OPEN")}
              >
                {ticketTotals.open} Abertos
              </button>

              <button
                type="button"
                className={`helpAccessCard blue ${
                  selectedTicketStatusFilter === "IN_PROGRESS" ? "active" : ""
                }`}
                onClick={() => setSelectedTicketStatusFilter("IN_PROGRESS")}
              >
                {ticketTotals.inProgress} Em andamento
              </button>

              <button
                type="button"
                className={`helpAccessCard orange ${
                  selectedTicketStatusFilter === "CLOSED" ? "active" : ""
                }`}
                onClick={() => setSelectedTicketStatusFilter("CLOSED")}
              >
                {ticketTotals.completed} Concluídos
              </button>

              <button
                type="button"
                className={`helpAccessCard red ${
                  selectedTicketStatusFilter === "CANCELED" ? "active" : ""
                }`}
                onClick={() => setSelectedTicketStatusFilter("CANCELED")}
              >
                {ticketTotals.canceled} Cancelados
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
              <h3>{getTicketStatusTitle(selectedTicketStatusFilter)}</h3>
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
          </>
        )}

        {adminView === "tutorials" && (
          <>
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
                      tutorial.id ||
                      tutorial._id ||
                      `${tutorial.category}-${index}`
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
          </>
        )}

        {showTutorialModal && (
          <AdminTutorialModal
            selectedTutorial={selectedTutorial}
            tutorialForm={tutorialForm}
            helpCategories={helpCategories}
            handleTutorialChange={handleTutorialChange}
            handleSubmitTutorial={handleSubmitTutorial}
            handleCloseTutorialModal={handleCloseTutorialModal}
          />
        )}

        {showDeleteTutorialModal && selectedDeleteTutorial && (
          <DeleteTutorialModal
            selectedDeleteTutorial={selectedDeleteTutorial}
            closeDeleteTutorialModal={closeDeleteTutorialModal}
            handleConfirmDeleteTutorial={handleConfirmDeleteTutorial}
          />
        )}

        {showAdminTicketModal && selectedAdminTicket && (
          <AdminTicketModal
            loggedUser={loggedUser}
            selectedAdminTicket={selectedAdminTicket}
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
            handleCloseAdminTicketModal={handleCloseAdminTicketModal}
            handleSendAdminResponse={handleSendAdminResponse}
            handleUpdateTicketStatus={handleUpdateTicketStatus}
          />
        )}
      </div>
    );
  }

  return (
    <div className="help">
      {error && <Message msg={error} type="error" />}
      {message && <Message msg={message} type="success" />}

      <HelpHero openSupportModal={openSupportModal} />

      <div className="helpAccess__tabs">
        <button
          type="button"
          className={`helpAccess__tab ${
            userHelpView === "tutorials" ? "active" : ""
          }`}
          onClick={() => setUserHelpView("tutorials")}
        >
          Tutoriais rápidos
        </button>
        <button
          type="button"
          className={`helpAccess__tab ${userHelpView === "tickets" ? "active" : ""}`}
          onClick={() => setUserHelpView("tickets")}
        >
          Meus chamados
        </button>
      </div>

      {userHelpView === "tutorials" && (
        <>
          <HelpCategories
            helpCategories={helpCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setOpenTutorial={setOpenTutorial}
          />

          <div className="help__searchSection">
            <div className="help__searchInfo">
              <strong>Pesquisar nos tutoriais</strong>
              <span>
                Encontre rapidamente uma dúvida ou instrução do sistema.
              </span>
            </div>

            <div className="help__searchField">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Digite uma palavra-chave..."
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

          <div className="help__content">
            <div className="help__main">
              <HelpFaq
                selectedCategory={selectedCategory}
                selectedCategoryData={selectedCategoryData}
                filteredTutorials={filteredTutorials}
                openTutorial={openTutorial}
                setOpenTutorial={setOpenTutorial}
              />
            </div>

            <HelpSidebar tips={tips} openSupportModal={openSupportModal} />
          </div>
        </>
      )}

      {userHelpView === "tickets" && (
        <HelpTickets
          myTickets={myTickets}
          translateStatus={translateStatus}
          translatePriority={translatePriority}
          handleOpenTicket={handleOpenTicket}
        />
      )}

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
