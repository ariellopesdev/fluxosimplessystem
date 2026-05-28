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
import { getAllSales } from "../../slices/salesSlice";

// Components
import Message from "../../components/Message/Message";

const Appointment = () => {
  const dispatch = useDispatch();

  const { appointments, summary, loading, error, message } = useSelector(
    (state) => state.appointment,
  );

  const { clients } = useSelector((state) => state.client);
  const { sales } = useSelector((state) => state.sales);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("DAY");

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
    sale: "",
    notes: "",
  });

  useEffect(() => {
    dispatch(getAllAppointments());
    dispatch(getAppointmentSummary());
    dispatch(getAllClients());
    dispatch(getAllSales());
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
  const salesList = Array.isArray(sales) ? sales : [];

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

  const getAppointmentSaleId = (appointment) => {
    if (!appointment.sale) return "";

    return typeof appointment.sale === "object"
      ? appointment.sale._id
      : appointment.sale;
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

  const getSaleLabel = (appointment) => {
    const saleId = getAppointmentSaleId(appointment);

    if (!saleId) return "Sem venda vinculada";

    const sale = salesList.find((item) => item._id === saleId);

    if (!sale) return "Venda não encontrada";

    return `${sale.saleNumber || "Venda"} - R$ ${Number(
      sale.total || 0,
    ).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
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

        const appointmentDate = new Date(`${formatDateToCompare(appointment.date)}T12:00:00`);

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
      sale: "",
      notes: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      client: formData.client || null,
      notes: formData.sale
        ? `${formData.notes || ""}\nVenda vinculada: ${formData.sale}`.trim()
        : formData.notes,
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
          <h3>{monthName}</h3>

          <div className="calendar__grid">
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const isSelected = selectedDate.getDate() === day;
              const hasAppointment = getDayHasAppointment(day);

              return (
                <div
                  key={day}
                  className={`calendar__day ${
                    isSelected ? "selected" : ""
                  } ${hasAppointment ? "hasAppointment" : ""}`}
                  onClick={() =>
                    setSelectedDate(new Date(currentYear, currentMonth, day))
                  }
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
            <p className="appointment__empty">
              Nenhum agendamento encontrado.
            </p>
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
                    <span>Venda/Serviço: {getSaleLabel(appointment)}</span>
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
                <h4>Dados principais</h4>

                <div className="appointment__formGroup">
                  <label>Título</label>

                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="appointment__formGroup">
                  <label>Descrição</label>

                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="appointment__grid">
                  <div className="appointment__formGroup">
                    <label>Data</label>

                    <input
                      type="date"
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="appointment__formGroup">
                    <label>Fim</label>

                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="appointment__formSection">
                <h4>Cliente e venda</h4>

                <div className="appointment__grid two">
                  <div className="appointment__formGroup">
                    <label>Cliente</label>

                    <select
                      value={formData.client}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          client: e.target.value,
                        }))
                      }
                    >
                      <option value="">Sem cliente vinculado</option>

                      {clientsList.map((client) => (
                        <option key={client._id} value={client._id}>
                          {client.name}{" "}
                          {client.cpfCnpj ? `- ${client.cpfCnpj}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="appointment__formGroup">
                    <label>Venda/Serviço vinculado</label>

                    <select
                      value={formData.sale}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          sale: e.target.value,
                          type: e.target.value ? "SERVICE" : prev.type,
                        }))
                      }
                    >
                      <option value="">Sem venda/serviço vinculado</option>

                      {salesList.map((sale) => (
                        <option key={sale._id} value={sale._id}>
                          {sale.saleNumber || "Venda"} - R${" "}
                          {Number(sale.total || 0).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </option>
                      ))}
                    </select>
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