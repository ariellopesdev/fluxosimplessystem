import "./Appointment.css";

// React
import { useEffect, useMemo, useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentSummary,
  updateAppointment,
  resetMessage,
} from "../../slices/appointmentSlice";
import { getAllClients } from "../../slices/clientSlice";
import { getServices } from "../../slices/serviceSlice";
// Components
import Message from "../../components/Message/Message";

const Appointment = ({ setPage }) => {
  const dispatch = useDispatch();

  const { appointments, summary, loading, error, message } = useSelector(
    (state) => state.appointment,
  );

  const { clients } = useSelector((state) => state.client);
  const { services } = useSelector((state) => state.service);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("DAY");
  const [clientSearch, setClientSearch] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "OTHER",
    status: "PENDING",
    priority: "MEDIUM",
    client: "",
    service: "",
    notes: "",
  });

  useEffect(() => {
    dispatch(getAllAppointments());
    dispatch(getAppointmentSummary());
    dispatch(getAllClients());
    dispatch(getServices());
  }, [dispatch]);

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch]);

  const appointmentsList = Array.isArray(appointments) ? appointments : [];
  const clientsList = Array.isArray(clients) ? clients : [];
  const servicesList = Array.isArray(services) ? services : [];

  const availableServices = servicesList.filter(
    (service) => service.status === "ACTIVE" && service.isSchedulable,
  );

  const filteredClients = clientsList.filter((client) => {
    const search = clientSearch.toLowerCase();

    return (
      client.name?.toLowerCase().includes(search) ||
      client.cpfCnpj?.toLowerCase().includes(search)
    );
  });

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const monthName = selectedDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const formatDateToCompare = (date) => {
    if (!date) return "";

    if (typeof date === "string") {
      if (date.includes("T")) return date.split("T")[0];
      return date;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const selectedDateFormatted = formatDateToCompare(selectedDate);

  const getAppointmentClientId = (appointment) => {
    if (!appointment.client) return "";

    return typeof appointment.client === "object"
      ? appointment.client._id
      : appointment.client;
  };

  const getClientName = (appointment) => {
    if (!appointment.client) return "Sem cliente vinculado";

    if (typeof appointment.client === "object") {
      return appointment.client.name || "Cliente sem nome";
    }

    const client = clientsList.find((item) => item._id === appointment.client);

    return client?.name || "Cliente não encontrado";
  };

  const getClientDocument = (appointment) => {
    if (!appointment.client) return "-";

    if (typeof appointment.client === "object") {
      return appointment.client.cpfCnpj || "-";
    }

    const client = clientsList.find((item) => item._id === appointment.client);

    return client?.cpfCnpj || "-";
  };

  const getClientPhone = (appointment) => {
    if (!appointment.client) return "-";

    if (typeof appointment.client === "object") {
      return appointment.client.phones?.primary || "-";
    }

    const client = clientsList.find((item) => item._id === appointment.client);

    return client?.phones?.primary || "-";
  };

  const filteredAppointments = useMemo(() => {
    const today = new Date(selectedDate);
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);

    if (viewMode === "DAY") {
      endDate.setDate(today.getDate() + 1);
    }

    if (viewMode === "MONTH") {
      today.setDate(1);
      endDate.setMonth(today.getMonth() + 1);
      endDate.setDate(1);
    }

    if (viewMode === "TWO_MONTHS") {
      endDate.setMonth(today.getMonth() + 2);
    }

    return appointmentsList
      .filter((appointment) => {
        if (!appointment.date) return false;

        const appointmentDate = new Date(
          `${formatDateToCompare(appointment.date)}T12:00:00`,
        );

        return appointmentDate >= today && appointmentDate < endDate;
      })
      .sort((a, b) => {
        const dateA = formatDateToCompare(a.date);
        const dateB = formatDateToCompare(b.date);

        if (dateA !== dateB) return dateA.localeCompare(dateB);

        return String(a.startTime || "").localeCompare(
          String(b.startTime || ""),
        );
      });
  }, [appointmentsList, selectedDate, viewMode]);

  const getDayHasAppointment = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const formattedDate = formatDateToCompare(date);

    return appointmentsList.some((appointment) => {
      if (!appointment.date) return false;

      return formatDateToCompare(appointment.date) === formattedDate;
    });
  };

  const refreshAppointments = async () => {
    await dispatch(getAllAppointments());
    await dispatch(getAppointmentSummary());
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await dispatch(
        updateAppointment({
          id,
          appointmentData: {
            status,
          },
        }),
      ).unwrap();

      await refreshAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  const getSelectedService = () => {
    return availableServices.find(
      (service) => service._id === formData.service,
    );
  };

  const calculateEndTime = (startTime, serviceId) => {
    if (!startTime || !serviceId) return "";

    const selectedService = availableServices.find(
      (service) => service._id === serviceId,
    );

    if (!selectedService?.estimatedDuration?.value) return "";

    const [hours, minutes] = startTime.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(hours);
    startDate.setMinutes(minutes);
    startDate.setSeconds(0);

    const durationValue = Number(selectedService.estimatedDuration.value);
    const durationUnit = selectedService.estimatedDuration.unit;

    if (durationUnit === "MINUTES") {
      startDate.setMinutes(startDate.getMinutes() + durationValue);
    }

    if (durationUnit === "HOURS") {
      startDate.setHours(startDate.getHours() + durationValue);
    }

    if (durationUnit === "DAYS") {
      startDate.setDate(startDate.getDate() + durationValue);
    }

    const endHours = String(startDate.getHours()).padStart(2, "0");
    const endMinutes = String(startDate.getMinutes()).padStart(2, "0");

    return `${endHours}:${endMinutes}`;
  };

  const handleServiceChange = (serviceId) => {
    const selectedService = availableServices.find(
      (service) => service._id === serviceId,
    );

    setFormData((prev) => ({
      ...prev,
      service: serviceId,
      title: selectedService?.name || "",
      description: selectedService?.description || "",
      type: "SERVICE",
      endTime: calculateEndTime(prev.startTime, serviceId),
    }));
  };

  const handleStartTimeChange = (startTime) => {
    setFormData((prev) => ({
      ...prev,
      startTime,
      endTime: calculateEndTime(startTime, prev.service),
    }));
  };

  const formatCpfCnpj = (value) => {
    if (!value) return "";

    const onlyNumbers = value.replace(/\D/g, "");

    if (onlyNumbers.length <= 11) {
      return onlyNumbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    return onlyNumbers
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  };

  const selectedClient = clientsList.find(
    (client) => client._id === formData.client,
  );

  const handleSelectClient = (client) => {
    setFormData((prev) => ({
      ...prev,
      client: client._id,
    }));

    setClientSearch(client.name);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      type: "OTHER",
      status: "PENDING",
      priority: "MEDIUM",
      client: "",
      service: "",
      notes: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedService = getSelectedService();

    const payload = {
      title: selectedService?.name || "Serviço",
      description: selectedService?.description || "",
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: "SERVICE",
      status: formData.status,
      priority: formData.priority,
      client: formData.client || null,
      notes: `
${formData.notes || ""}
Serviço vinculado: ${selectedService?.name || "-"}
Valor do serviço: R$ ${Number(selectedService?.unityPrice || 0).toLocaleString(
        "pt-BR",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      )}
`.trim(),
    };

    try {
      await dispatch(createAppointment(payload)).unwrap();

      await refreshAppointments();

      setSelectedDate(new Date(`${formData.date}T12:00:00`));

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const translateStatus = (status) => {
    const statuses = {
      PENDING: "Pendente",
      CONFIRMED: "Confirmado",
      FINISHED: "Concluído",
      CANCELLED: "Cancelado",
    };

    return statuses[status] || "-";
  };

  const translateType = (type) => {
    const types = {
      DELIVERY: "Entrega",
      MEETING: "Reunião",
      SERVICE: "Serviço",
      FOLLOW_UP: "Retorno",
      PAYMENT: "Pagamento",
      OTHER: "Outro",
    };

    return types[type] || "-";
  };

  const translatePriority = (priority) => {
    const priorities = {
      LOW: "Baixa",
      MEDIUM: "Média",
      HIGH: "Alta",
    };

    return priorities[priority] || "-";
  };

  const getListTitle = () => {
    if (viewMode === "DAY") {
      return `Agendamentos do dia ${selectedDate.toLocaleDateString("pt-BR")}`;
    }

    if (viewMode === "MONTH") {
      return `Agendamentos de ${monthName}`;
    }

    return "Agendamentos dos próximos 2 meses";
  };

  const todayFormatted = formatDateToCompare(new Date());

  const isPastDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return formatDateToCompare(date) < todayFormatted;
  };

  return (
    <div className="appointment">
      <div className="appointment__header">
        <h2>Agendamentos</h2>

        <button className="appointment__btn" onClick={() => setShowModal(true)}>
          + Novo Agendamento
        </button>
      </div>

      {error && <Message msg={error} type="error" />}
      {message && <Message msg={message} type="success" />}

      <div className="appointment__cards">
        <div className="card blue">{summary?.today || 0} Hoje</div>
        <div className="card orange">{summary?.pending || 0} Pendentes</div>
        <div className="card green">{summary?.finished || 0} Concluídos</div>
        <div className="card red">{summary?.cancelled || 0} Cancelados</div>
      </div>

      <div className="appointment__filters">
        <label>Visualizar</label>

        <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <option value="DAY">Agendamentos do dia</option>
          <option value="MONTH">Agendamentos do mês</option>
          <option value="TWO_MONTHS">Próximos 2 meses</option>
        </select>
      </div>

      <div className="appointment__content">
        <div className="calendar">
          <div className="calendar__header">
            <button
              type="button"
              onClick={() =>
                setSelectedDate(new Date(currentYear, currentMonth - 1, 1))
              }
            >
              ‹
            </button>

            <h3>{monthName}</h3>

            <button
              type="button"
              onClick={() =>
                setSelectedDate(new Date(currentYear, currentMonth + 1, 1))
              }
            >
              ›
            </button>
          </div>

          <div className="calendar__grid">
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const isSelected = selectedDate.getDate() === day;
              const hasAppointment = getDayHasAppointment(day);
              const pastDate = isPastDate(day);

              return (
                <div
                  key={day}
                  className={`calendar__day 
      ${isSelected ? "selected" : ""} 
      ${hasAppointment ? "hasAppointment" : ""} 
      ${pastDate ? "disabled" : ""}
    `}
                  title={
                    pastDate
                      ? "Não é possível agendar datas anteriores a hoje"
                      : ""
                  }
                  onClick={() => {
                    if (pastDate) return;

                    setSelectedDate(new Date(currentYear, currentMonth, day));
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        <div className="appointment__list">
          <h3>{getListTitle()}</h3>

          {loading && <p>Carregando agendamentos...</p>}

          {!loading && filteredAppointments.length === 0 && (
            <p className="appointment__empty">Nenhum agendamento encontrado.</p>
          )}

          {!loading &&
            filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className={`appointment__item ${appointment.status?.toLowerCase()}`}
              >
                <div className="appointment__itemInfo">
                  <div className="appointment__itemTop">
                    <span>{appointment.startTime || "--:--"}</span>

                    <strong>
                      {formatDateToCompare(appointment.date)
                        .split("-")
                        .reverse()
                        .join("/")}
                    </strong>
                  </div>

                  <p>{appointment.title}</p>

                  <small>
                    {translateType(appointment.type)} •{" "}
                    {translateStatus(appointment.status)} • Prioridade{" "}
                    {translatePriority(appointment.priority)}
                  </small>

                  <div className="appointment__clientData">
                    <span>Cliente: {getClientName(appointment)}</span>
                    <span>CPF/CNPJ: {getClientDocument(appointment)}</span>
                    <span>Telefone: {getClientPhone(appointment)}</span>
                    <span>
                      Serviço: {appointment.title || "Serviço não informado"}
                    </span>
                  </div>
                </div>

                <div className="appointment__actions">
                  {appointment.status === "PENDING" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(appointment._id, "CONFIRMED")
                      }
                    >
                      Confirmar
                    </button>
                  )}

                  {appointment.status === "CONFIRMED" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(appointment._id, "FINISHED")
                      }
                    >
                      Concluir
                    </button>
                  )}

                  {appointment.status !== "CANCELLED" &&
                    appointment.status !== "FINISHED" && (
                      <button
                        className="cancel"
                        onClick={() =>
                          handleStatusUpdate(appointment._id, "CANCELLED")
                        }
                      >
                        Cancelar
                      </button>
                    )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {showModal && (
        <div className="appointment__modalOverlay">
          <div className="appointment__modal">
            <div className="appointment__modalHeader">
              <h3>Novo Agendamento</h3>

              <button
                className="appointment__closeBtn"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="appointment__form">
              <div className="appointment__formSection">
                <h4>Cliente e serviço</h4>

                <div className="appointment__grid two">
                  <div className="appointment__formGroup appointment__clientSearchBox">
                    <label>Pesquisar cliente por nome ou CPF/CNPJ</label>

                    <input
                      type="text"
                      placeholder="Digite nome ou CPF/CNPJ"
                      value={clientSearch}
                      onChange={(e) => {
                        setClientSearch(e.target.value);

                        setFormData((prev) => ({
                          ...prev,
                          client: "",
                        }));
                      }}
                    />

                    {clientSearch &&
                      !formData.client &&
                      filteredClients.length > 0 && (
                        <div className="appointment__clientSuggestions">
                          {filteredClients.map((client) => (
                            <button
                              type="button"
                              key={client._id}
                              onClick={() => handleSelectClient(client)}
                            >
                              <strong>{client.name}</strong>
                              <span>{formatCpfCnpj(client.cpfCnpj)}</span>
                            </button>
                          ))}
                        </div>
                      )}

                    <button
                      type="button"
                      className="appointment__linkBtn"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();

                        if (typeof setPage === "function") {
                          setPage("client");
                        }
                      }}
                    >
                      Cliente não cadastrado? Cadastrar cliente
                    </button>
                  </div>

                  <div className="appointment__grid two appointment__selectedClientGrid">
                    <div className="appointment__formGroup">
                      <label>Cliente selecionado</label>
                      <input
                        type="text"
                        value={selectedClient?.name || ""}
                        disabled
                        placeholder="Nenhum cliente selecionado"
                      />
                    </div>

                    <div className="appointment__formGroup">
                      <label>CPF/CNPJ</label>
                      <input
                        type="text"
                        value={formatCpfCnpj(selectedClient?.cpfCnpj || "")}
                        disabled
                        placeholder="-"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="appointment__formSection">
                <h4>Data e horário</h4>

                <div className="appointment__grid">
                  <div className="appointment__formGroup">
                    <label>Data</label>

                    <input
                      type="date"
                      min={todayFormatted}
                      value={formData.date}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="appointment__formGroup">
                    <label>Início</label>

                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleStartTimeChange(e.target.value)}
                      required
                    />
                  </div>

                  <div className="appointment__formGroup">
                    <label>Fim automático</label>

                    <input type="time" value={formData.endTime} disabled />
                  </div>
                </div>
              </div>

              <div className="appointment__formSection">
                <h4>Classificação</h4>

                <div className="appointment__grid">
                  <div className="appointment__formGroup">
                    <label>Tipo</label>

                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                    >
                      <option value="DELIVERY">Entrega</option>
                      <option value="MEETING">Reunião</option>
                      <option value="SERVICE">Serviço</option>
                      <option value="FOLLOW_UP">Retorno</option>
                      <option value="PAYMENT">Pagamento</option>
                      <option value="OTHER">Outro</option>
                    </select>
                  </div>

                  <div className="appointment__formGroup">
                    <label>Status</label>

                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                    >
                      <option value="PENDING">Pendente</option>
                      <option value="CONFIRMED">Confirmado</option>
                      <option value="FINISHED">Concluído</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </div>

                  <div className="appointment__formGroup">
                    <label>Prioridade</label>

                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }))
                      }
                    >
                      <option value="LOW">Baixa</option>
                      <option value="MEDIUM">Média</option>
                      <option value="HIGH">Alta</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="appointment__formSection">
                <h4>Observações</h4>

                <div className="appointment__formGroup">
                  <label>Observações</label>

                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {!loading && (
                <button type="submit" className="appointment__btn">
                  Cadastrar Agendamento
                </button>
              )}

              {loading && (
                <button type="submit" className="appointment__btn" disabled>
                  Aguarde...
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
