//CSS
import "./Help.css";

// React
import { useEffect, useMemo, useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  getMySupportTickets,
  getSupportTicketById,
  resetMessage,
  resetSelectedTicket,
} from "../../slices/supportSlice";

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

// Utils
import { translatePriority, translateStatus } from "../../utils/supportUtils";

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

  // Redux support state
  const { myTickets, selectedTicket, loading, error, message } = useSelector(
    (state) => state.support,
  );

  // Help search and FAQ state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openTutorial, setOpenTutorial] = useState(null);

  // Modal used to create a new support ticket
  const {
    isOpen: showSupportModal,
    openModal: openSupportModal,
    closeModal: closeSupportModal,
  } = useModal();

  // Modal used to open the support chat
  const {
    isOpen: showChatModal,
    openModal: openChatModal,
    closeModal: closeChatModal,
  } = useModal();

  // Support form and chat logic
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

  // Load current user tickets
  useEffect(() => {
    dispatch(getMySupportTickets());
  }, [dispatch]);

  // Auto clear support messages
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

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

  // Get selected category data
  const selectedCategoryData = helpCategories.find(
    (category) => category.id === selectedCategory,
  );

  // Open selected ticket chat
  const handleOpenTicket = async (id) => {
    await dispatch(getSupportTicketById(id));
    openChatModal();
  };

  // Close chat modal and clear selected ticket from Redux
  const handleCloseChatModal = () => {
    closeChatModal();
    dispatch(resetSelectedTicket());
  };

  return (
    <div className="help">
      {/* GLOBAL MESSAGES */}
      {error && <Message msg={error} type="error" />}
      {message && <Message msg={message} type="success" />}

      {/* HELP HEADER */}
      <HelpHero search={search} setSearch={setSearch} />

      {/* HELP CATEGORIES */}
      <HelpCategories
        helpCategories={helpCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setOpenTutorial={setOpenTutorial}
      />

      {/* HELP CONTENT */}
      <div className="help__content">
        <div className="help__main">
          {/* FAQ */}
          <HelpFaq
            selectedCategory={selectedCategory}
            selectedCategoryData={selectedCategoryData}
            filteredTutorials={filteredTutorials}
            openTutorial={openTutorial}
            setOpenTutorial={setOpenTutorial}
          />

          {/* SUPPORT TICKETS */}
          <HelpTickets
            myTickets={myTickets}
            translateStatus={translateStatus}
            translatePriority={translatePriority}
            handleOpenTicket={handleOpenTicket}
          />
        </div>

        {/* SIDEBAR */}
        <HelpSidebar tips={tips} openSupportModal={openSupportModal} />
      </div>

      {/* CREATE SUPPORT TICKET MODAL */}
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

      {/* SUPPORT CHAT MODAL */}
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
