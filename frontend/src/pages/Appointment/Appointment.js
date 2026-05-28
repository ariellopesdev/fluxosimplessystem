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
  const { user } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("DAY");
  const [clientSearch, setClientSearch] = useState("");
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [localError, setLocalError] = useState(null);

  const [availabilityRules, setAvailabilityRules] = useState({
    workingDays: {
      0: false,
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: false,
    },
    startTime: "08:00",
    endTime: "18:00",
    exceptions: [],
  });

  const [exceptionForm, setExceptionForm] = useState({
    date: "",
    reason: "",
  });

  const canManageAvailability =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

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
    payment: {
      method: "PIX",
      status: "PENDING",
      installments: 1,
    },
    discount: 0,
    notes: "",
  });

  useEffect(() => {
    dispatch(getAllAppointments());
    dispatch(getAppointmentSummary());
    dispatch(getAllClients());
    dispatch(getServices());
  }, [dispatch]);

  useEffect(() => {
    if (error || message || localError) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
        setLocalError(null);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [error, message, localError, dispatch]);

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

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const selectedServiceValue = Number(getSelectedService()?.unityPrice || 0);

  const appointmentTotal = Math.max(
    selectedServiceValue - Number(formData.discount || 0),
    0,
  );

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        [name]: name === "installments" ? Number(value) : value,
      },
    }));
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
      payment: {
        method: "PIX",
        status: "PENDING",
        installments: 1,
      },
      discount: 0,
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
      payment: {
        ...formData.payment,
        installments:
          formData.payment.method === "CREDIT_CARD"
            ? Number(formData.payment.installments)
            : 1,
      },
      discount: Number(formData.discount || 0),
      total: appointmentTotal,
      notes: `
${formData.notes || ""}
Serviço vinculado: ${selectedService?.name || "-"}
Valor do serviço: ${formatCurrency(selectedService?.unityPrice || 0)}
Desconto: ${formatCurrency(formData.discount || 0)}
Total: ${formatCurrency(appointmentTotal)}
Pagamento: ${formData.payment.method}
Status do pagamento: ${formData.payment.status}
Parcelas: ${
        formData.payment.method === "CREDIT_CARD"
          ? formData.payment.installments
          : 1
      }x
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

    return `Agendamentos de ${monthName}`;
  };

  const todayFormatted = formatDateToCompare(new Date());

  const isPastDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return formatDateToCompare(date) < todayFormatted;
  };

  const isTimeBetween = (time, start, end) => {
    if (!time || !start || !end) return true;

    return time >= start && time <= end;
  };

  const isExceptionDate = (date) => {
    return availabilityRules.exceptions.some(
      (exception) => exception.date === date,
    );
  };

  const getExceptionReason = (date) => {
    const exception = availabilityRules.exceptions.find(
      (item) => item.date === date,
    );

    return exception?.reason || "Indisponível";
  };

  const isAvailableDate = (date) => {
    if (!date) return false;

    const parsedDate = new Date(`${date}T12:00:00`);
    const dayOfWeek = parsedDate.getDay();

    const isWorkingDay = availabilityRules.workingDays[dayOfWeek];

    if (!isWorkingDay) return false;

    if (isExceptionDate(date)) return false;

    return true;
  };

  const isUnavailableDay = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const formattedDate = formatDateToCompare(date);

    return isPastDate(day) || !isAvailableDate(formattedDate);
  };

  const getUnavailableReason = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const formattedDate = formatDateToCompare(date);

    if (isPastDate(day)) {
      return "Não é possível agendar datas anteriores a hoje";
    }

    if (isExceptionDate(formattedDate)) {
      return getExceptionReason(formattedDate);
    }

    if (!isAvailableDate(formattedDate)) {
      return "Dia indisponível para atendimento";
    }

    return "";
  };

  const handleAddException = () => {
    if (!exceptionForm.date) return;

    const alreadyExists = availabilityRules.exceptions.some(
      (item) => item.date === exceptionForm.date,
    );

    if (alreadyExists) {
      setLocalError("Esta exceção já foi adicionada.");
      return;
    }

    setAvailabilityRules((prev) => ({
      ...prev,
      exceptions: [
        ...prev.exceptions,
        {
          date: exceptionForm.date,
          reason: exceptionForm.reason || "Indisponível",
        },
      ],
    }));

    setExceptionForm({
      date: "",
      reason: "",
    });
  };

  const handleRemoveException = (date) => {
    setAvailabilityRules((prev) => ({
      ...prev,
      exceptions: prev.exceptions.filter((item) => item.date !== date),
    }));
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <div className="appointment">
      <div className="appointment__header">
        <h2>Agendamentos</h2>

        <div className="appointment__headerActions">
          {canManageAvailability && (
            <button
              className="appointment__secondaryBtn"
              onClick={() => setShowAvailabilityModal(true)}
            >
              Disponibilidade
            </button>
          )}

          <button
            className="appointment__btn"
            onClick={() => setShowModal(true)}
          >
            + Novo Agendamento
          </button>
        </div>
      </div>

      {error && <Message msg={error} type="error" />}
      {localError && <Message msg={localError} type="error" />}
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
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
              (weekDay) => (
                <div key={weekDay} className="calendar__weekDay">
                  {weekDay}
                </div>
              ),
            )}
            {calendarDays.map((day, i) => {
              if (!day) {
                return (
                  <div key={`empty-${i}`} className="calendar__day empty"></div>
                );
              }
              const isSelected = selectedDate.getDate() === day;
              const hasAppointment = getDayHasAppointment(day);
              const unavailableDay = isUnavailableDay(day);

              return (
                <div
                  key={day}
                  className={`calendar__day 
      ${isSelected ? "selected" : ""} 
      ${hasAppointment ? "hasAppointment" : ""} 
      ${unavailableDay ? "disabled" : ""}
    `}
                  title={unavailableDay ? getUnavailableReason(day) : ""}
                  onClick={() => {
                    if (unavailableDay) return;

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
                <div className="appointment__formGroup">
                  <label>Serviço disponível</label>

                  <select
                    value={formData.service}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    required
                  >
                    <option value="">Selecione um serviço</option>

                    {availableServices.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name} - {formatCurrency(service.unityPrice)}
                      </option>
                    ))}
                  </select>
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
                      onChange={(e) => {
                        const selected = e.target.value;

                        if (!isAvailableDate(selected)) {
                          setLocalError(
                            "Esta data não está disponível para atendimento.",
                          );

                          setFormData((prev) => ({
                            ...prev,
                            date: "",
                          }));

                          return;
                        }

                        setFormData((prev) => ({
                          ...prev,
                          date: selected,
                        }));
                      }}
                      required
                    />
                  </div>

                  <div className="appointment__formGroup">
                    <label>Início</label>

                    <input
                      type="time"
                      min={availabilityRules.startTime}
                      max={availabilityRules.endTime}
                      value={formData.startTime}
                      onChange={(e) => {
                        const selectedTime = e.target.value;

                        if (
                          !isTimeBetween(
                            selectedTime,
                            availabilityRules.startTime,
                            availabilityRules.endTime,
                          )
                        ) {
                          setLocalError(
                            "Horário fora do período disponível para atendimento.",
                          );
                          return;
                        }

                        handleStartTimeChange(selectedTime);
                      }}
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
                <h4>Pagamento</h4>

                <div className="appointment__grid">
                  <div className="appointment__formGroup">
                    <label>Forma de pagamento</label>

                    <select
                      name="method"
                      value={formData.payment.method}
                      onChange={handlePaymentChange}
                    >
                      <option value="CASH">Dinheiro</option>
                      <option value="PIX">Pix</option>
                      <option value="CREDIT_CARD">Cartão de crédito</option>
                      <option value="DEBIT_CARD">Cartão de débito</option>
                      <option value="BANK_SLIP">Boleto</option>
                      <option value="TRANSFER">Transferência</option>
                    </select>
                  </div>

                  <div className="appointment__formGroup">
                    <label>Status do pagamento</label>

                    <select
                      name="status"
                      value={formData.payment.status}
                      onChange={handlePaymentChange}
                    >
                      <option value="PENDING">Pendente</option>
                      <option value="PAID">Pago</option>
                      <option value="CANCELLED">Cancelado</option>
                      <option value="REFUNDED">Reembolsado</option>
                    </select>
                  </div>

                  {formData.payment.method === "CREDIT_CARD" && (
                    <div className="appointment__formGroup">
                      <label>Parcelas</label>

                      <input
                        type="number"
                        name="installments"
                        min="1"
                        max="12"
                        value={formData.payment.installments}
                        onChange={handlePaymentChange}
                      />
                    </div>
                  )}
                </div>

                <div className="appointment__grid two">
                  <div className="appointment__formGroup">
                    <label>Desconto</label>

                    <input
                      type="number"
                      min="0"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          discount: Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div className="appointment__formGroup">
                    <label>Total do serviço</label>

                    <input
                      type="text"
                      value={formatCurrency(appointmentTotal)}
                      disabled
                    />
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
      {showAvailabilityModal && (
        <div className="appointment__modalOverlay">
          <div className="appointment__modal">
            <div className="appointment__modalHeader">
              <h3>Disponibilidade de Atendimento</h3>

              <button
                className="appointment__closeBtn"
                onClick={() => setShowAvailabilityModal(false)}
              >
                ×
              </button>
            </div>

            <div className="appointment__form">
              <div className="appointment__formSection">
                <h4>Dias disponíveis</h4>

                <div className="availability__days">
                  {[
                    { key: 0, label: "Domingo" },
                    { key: 1, label: "Segunda" },
                    { key: 2, label: "Terça" },
                    { key: 3, label: "Quarta" },
                    { key: 4, label: "Quinta" },
                    { key: 5, label: "Sexta" },
                    { key: 6, label: "Sábado" },
                  ].map((day) => (
                    <label key={day.key} className="availability__day">
                      <input
                        type="checkbox"
                        checked={availabilityRules.workingDays[day.key]}
                        onChange={(e) =>
                          setAvailabilityRules((prev) => ({
                            ...prev,
                            workingDays: {
                              ...prev.workingDays,
                              [day.key]: e.target.checked,
                            },
                          }))
                        }
                      />

                      {day.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="appointment__formSection">
                <h4>Horário de trabalho</h4>

                <div className="appointment__grid two">
                  <div className="appointment__formGroup">
                    <label>Início do expediente</label>

                    <input
                      type="time"
                      value={availabilityRules.startTime}
                      onChange={(e) =>
                        setAvailabilityRules((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="appointment__formGroup">
                    <label>Fim do expediente</label>

                    <input
                      type="time"
                      value={availabilityRules.endTime}
                      onChange={(e) =>
                        setAvailabilityRules((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="appointment__formSection">
                <h4>Exceções</h4>

                <div className="appointment__grid two">
                  <div className="appointment__formGroup">
                    <label>Data indisponível</label>

                    <input
                      type="date"
                      min={todayFormatted}
                      value={exceptionForm.date}
                      onChange={(e) =>
                        setExceptionForm((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="appointment__formGroup">
                    <label>Motivo</label>

                    <input
                      type="text"
                      placeholder="Viagem, doença, compromisso..."
                      value={exceptionForm.reason}
                      onChange={(e) =>
                        setExceptionForm((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="appointment__btn"
                  onClick={handleAddException}
                >
                  Adicionar exceção
                </button>

                <div className="availability__exceptions">
                  {availabilityRules.exceptions.length === 0 && (
                    <p>Nenhuma exceção cadastrada.</p>
                  )}

                  {availabilityRules.exceptions.map((exception) => (
                    <div
                      key={exception.date}
                      className="availability__exception"
                    >
                      <span>
                        {exception.date.split("-").reverse().join("/")} -{" "}
                        {exception.reason}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveException(exception.date)}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="appointment__btn"
                onClick={() => setShowAvailabilityModal(false)}
              >
                Salvar disponibilidade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
