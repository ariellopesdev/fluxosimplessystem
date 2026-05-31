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
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showOverdueModal, setShowOverdueModal] = useState(false);
  const [lastClickedDay, setLastClickedDay] = useState(null);
  const [calendarInitialized, setCalendarInitialized] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [historyFilters, setHistoryFilters] = useState({
    date: "",
    month: "",
    year: "",
  });

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
        if (
          appointment.status === "CANCELLED" ||
          appointment.status === "FINISHED"
        ) {
          return false;
        }

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

      return (
        appointment.status !== "CANCELLED" &&
        appointment.status !== "FINISHED" &&
        formatDateToCompare(appointment.date) === formattedDate
      );
    });
  };

  const refreshAppointments = async () => {
    await dispatch(getAllAppointments());
    await dispatch(getAppointmentSummary());

    setSelectedDate((prev) => new Date(prev));
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const appointment = appointmentsList.find((item) => item._id === id);

      const appointmentData = {
        status,
      };

      if (status === "FINISHED" && appointment?.payment?.status === "PENDING") {
        appointmentData.payment = {
          ...appointment.payment,
          status: "PAID",
        };
      }

      await dispatch(
        updateAppointment({
          id,
          appointmentData,
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
      startTime: "",
      endTime: "",
    }));
  };

  const handleTimeSelection = (time) => {
    setFormData((prev) => {
      if (!prev.startTime || prev.endTime) {
        return {
          ...prev,
          startTime: time,
          endTime: "",
        };
      }

      if (time <= prev.startTime) {
        return {
          ...prev,
          startTime: time,
          endTime: "",
        };
      }

      setShowTimeDropdown(false);

      return {
        ...prev,
        endTime: time,
      };
    });
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

  const formatPhone = (value) => {
    if (!value) return "-";

    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 10) {
      return numbers
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numbers
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
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

  const handleEditAppointment = (appointment) => {
    const clientId =
      typeof appointment.client === "object"
        ? appointment.client?._id
        : appointment.client || "";

    const selectedService = availableServices.find(
      (service) => service.name === appointment.title,
    );

    setEditId(appointment._id);

    setFormData({
      title: appointment.title || "",
      description: appointment.description || "",
      date: formatDateToCompare(appointment.date),
      startTime: appointment.startTime || "",
      endTime: appointment.endTime || "",
      type: appointment.type || "OTHER",
      status: appointment.status || "PENDING",
      priority: appointment.priority || "MEDIUM",
      client: clientId,
      service: selectedService?._id || "",
      payment: {
        method: appointment.payment?.method || "PIX",
        status: appointment.payment?.status || "PENDING",
        installments: appointment.payment?.installments || 1,
      },
      discount: Number(appointment.discount || 0),
      notes: appointment.notes || "",
    });

    setClientSearch(getClientName(appointment));
    setShowModal(true);
  };

  const closeAppointmentModal = () => {
    setShowModal(false);
    setEditId(null);
    setClientSearch("");
    resetForm();
  };

  const historyAppointments = appointmentsList
    .filter((appointment) => {
      if (!appointment.date) return false;

      const appointmentDate = formatDateToCompare(appointment.date);
      const [year, month] = appointmentDate.split("-");

      if (historyFilters.date && appointmentDate !== historyFilters.date) {
        return false;
      }

      if (historyFilters.month && month !== historyFilters.month) {
        return false;
      }

      if (historyFilters.year && year !== historyFilters.year) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = `${formatDateToCompare(a.date)} ${a.startTime || ""}`;
      const dateB = `${formatDateToCompare(b.date)} ${b.startTime || ""}`;

      return dateB.localeCompare(dateA);
    });

  const hasAppointmentConflict = (date, startTime, endTime) => {
    return appointmentsList.some((appointment) => {
      if (editId && appointment._id === editId) return false;

      if (appointment.status === "CANCELLED") return false;
      if (appointment.status === "FINISHED") return false;

      if (formatDateToCompare(appointment.date) !== date) return false;

      if (!appointment.startTime || !appointment.endTime) return false;

      return startTime < appointment.endTime && endTime > appointment.startTime;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!clientSearch.trim()) {
      errors.clientSearch = "Informe o nome do cliente.";
    }

    if (!formData.client) {
      errors.clientSearch = "Selecione um cliente cadastrado.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    if (!formData.client) {
      setLocalError("Selecione um cliente.");
      return;
    }

    if (!formData.service) {
      setLocalError("Selecione um serviço.");
      return;
    }

    if (!formData.date) {
      setLocalError("Selecione a data do agendamento.");
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setLocalError("Selecione o horário de início e o horário de fim.");
      return;
    }

    if (
      hasAppointmentConflict(
        formData.date,
        formData.startTime,
        formData.endTime,
      )
    ) {
      setLocalError(
        "Este intervalo de horário já possui outro agendamento. Escolha outro horário.",
      );
      return;
    }

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
      if (editId) {
        await dispatch(
          updateAppointment({
            id: editId,
            appointmentData: payload,
          }),
        ).unwrap();
      } else {
        await dispatch(createAppointment(payload)).unwrap();
      }

      await refreshAppointments();

      setSelectedDate(new Date(`${formData.date}T12:00:00`));

      closeAppointmentModal();
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

    const today = new Date();

    const formattedDate = formatDateToCompare(date);
    const formattedToday = formatDateToCompare(today);

    if (formattedDate < formattedToday) {
      return true;
    }

    if (formattedDate === formattedToday && today.getHours() >= 18) {
      return true;
    }

    return false;
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

    return (
      isPastDate(day) ||
      !isAvailableDate(formattedDate) ||
      isFullyBookedDate(formattedDate)
    );
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

    if (isFullyBookedDate(formattedDate)) {
      return "Todos os horários deste dia já estão agendados";
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

  const generateAvailableTimes = () => {
    const times = [];

    if (!formData.date || !formData.service) return times;

    const selectedService = getSelectedService();
    const durationValue = Number(
      selectedService?.estimatedDuration?.value || 30,
    );
    const durationUnit = selectedService?.estimatedDuration?.unit || "MINUTES";

    let durationInMinutes = durationValue;

    if (durationUnit === "HOURS") {
      durationInMinutes = durationValue * 60;
    }

    if (durationUnit === "DAYS") {
      durationInMinutes = durationValue * 24 * 60;
    }

    const [startHour, startMinute] = availabilityRules.startTime
      .split(":")
      .map(Number);

    const [endHour, endMinute] = availabilityRules.endTime
      .split(":")
      .map(Number);

    const current = new Date(`${formData.date}T00:00:00`);
    current.setHours(startHour, startMinute, 0, 0);

    const end = new Date(`${formData.date}T00:00:00`);
    end.setHours(endHour, endMinute, 0, 0);

    while (current < end) {
      const possibleEnd = new Date(current);
      possibleEnd.setMinutes(possibleEnd.getMinutes() + durationInMinutes);

      if (possibleEnd > end) break;

      const hour = String(current.getHours()).padStart(2, "0");
      const minute = String(current.getMinutes()).padStart(2, "0");

      times.push(`${hour}:${minute}`);

      current.setMinutes(current.getMinutes() + durationInMinutes);
    }

    return times;
  };

  const isTimeUnavailable = (time) => {
    if (!formData.date || !formData.service) return false;

    const calculatedEndTime = calculateEndTime(time, formData.service);

    return appointmentsList.some((appointment) => {
      const appointmentDate = formatDateToCompare(appointment.date);

      if (appointmentDate !== formData.date) return false;
      if (appointment.status === "CANCELLED") return false;
      if (!appointment.startTime || !appointment.endTime) return false;

      return (
        time < appointment.endTime && calculatedEndTime > appointment.startTime
      );
    });
  };

  const getAvailableTimesByDate = (date) => {
    const times = [];

    if (!date) return times;

    const interval = 30;
    const occupiedTimes = new Set();

    appointmentsList.forEach((appointment) => {
      const appointmentDate = formatDateToCompare(appointment.date);

      if (appointmentDate !== date) return;
      if (appointment.status === "CANCELLED") return;
      if (appointment.status === "FINISHED") return;
      if (!appointment.startTime || !appointment.endTime) return;

      let currentBlock = appointment.startTime;

      while (currentBlock < appointment.endTime) {
        occupiedTimes.add(currentBlock);

        const [h, m] = currentBlock.split(":").map(Number);

        const next = new Date();
        next.setHours(h);
        next.setMinutes(m + interval);
        next.setSeconds(0);

        currentBlock = `${String(next.getHours()).padStart(2, "0")}:${String(
          next.getMinutes(),
        ).padStart(2, "0")}`;
      }
    });

    const [startHour, startMinute] = availabilityRules.startTime
      .split(":")
      .map(Number);

    const [endHour, endMinute] = availabilityRules.endTime
      .split(":")
      .map(Number);

    const current = new Date(`${date}T00:00:00`);
    current.setHours(startHour, startMinute, 0, 0);

    const end = new Date(`${date}T00:00:00`);
    end.setHours(endHour, endMinute, 0, 0);

    while (current < end) {
      const hour = String(current.getHours()).padStart(2, "0");
      const minute = String(current.getMinutes()).padStart(2, "0");

      const time = `${hour}:${minute}`;

      if (!occupiedTimes.has(time)) {
        times.push(time);
      }

      current.setMinutes(current.getMinutes() + interval);
    }

    if (!occupiedTimes.has(availabilityRules.endTime)) {
      times.push(availabilityRules.endTime);
    }

    return times;
  };

  const isFullyBookedDay = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const formattedDate = formatDateToCompare(date);

    if (isPastDate(day)) return false;
    if (!isAvailableDate(formattedDate)) return false;
    if (availableServices.length === 0) return true;

    const availableTimesForDay = getAvailableTimesByDate(formattedDate);

    if (availableTimesForDay.length === 0) return true;

    const shortestServiceDuration = Math.min(
      ...availableServices.map((service) => {
        const value = Number(service?.estimatedDuration?.value || 30);
        const unit = service?.estimatedDuration?.unit || "MINUTES";

        if (unit === "HOURS") return value * 60;
        if (unit === "DAYS") return value * 24 * 60;

        return value;
      }),
    );

    return !availableTimesForDay.some((time) => {
      const calculatedEndTime = (() => {
        const [hours, minutes] = time.split(":").map(Number);

        const endDate = new Date();
        endDate.setHours(hours);
        endDate.setMinutes(minutes + shortestServiceDuration);
        endDate.setSeconds(0);

        return `${String(endDate.getHours()).padStart(2, "0")}:${String(
          endDate.getMinutes(),
        ).padStart(2, "0")}`;
      })();

      return (
        calculatedEndTime <= availabilityRules.endTime &&
        availableTimesForDay.includes(time)
      );
    });
  };

  const isFullyBookedDate = (date) => {
    if (!date) return false;
    if (!isAvailableDate(date)) return false;

    const available = getAvailableTimesByDate(date);

    return available.length < 2;
  };

  const availableTimes = formData.date
    ? formData.startTime && !formData.endTime
      ? getAvailableTimesByDate(formData.date).filter((time) => {
          if (time <= formData.startTime) return false;

          return !hasAppointmentConflict(
            formData.date,
            formData.startTime,
            time,
          );
        })
      : getAvailableTimesByDate(formData.date)
    : [];

  const getAppointmentDateTime = (appointment) => {
    const date = formatDateToCompare(appointment.date);
    const time = appointment.endTime || appointment.startTime || "23:59";

    return new Date(`${date}T${time}:00`);
  };

  const overdueAppointments = appointmentsList
    .filter((appointment) => {
      if (!appointment.date) return false;

      if (
        appointment.status === "FINISHED" ||
        appointment.status === "CANCELLED"
      ) {
        return false;
      }

      const appointmentDateTime = getAppointmentDateTime(appointment);

      return appointmentDateTime < new Date();
    })
    .sort((a, b) => {
      return getAppointmentDateTime(a) - getAppointmentDateTime(b);
    });

  const findNextAvailableDate = () => {
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const formattedDate = formatDateToCompare(date);
      const day = date.getDate();

      const originalMonth = currentMonth;
      const originalYear = currentYear;

      const isSameCalendarMonth =
        date.getMonth() === originalMonth &&
        date.getFullYear() === originalYear;

      if (!isAvailableDate(formattedDate)) continue;

      const available = getAvailableTimesByDate(formattedDate);

      if (available.length >= 2) {
        return date;
      }

      if (!isSameCalendarMonth) {
        continue;
      }

      if (!isPastDate(day) && !isFullyBookedDate(formattedDate)) {
        return date;
      }
    }

    return null;
  };

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

  useEffect(() => {
    if (overdueAppointments.length > 0) {
      setShowOverdueModal(true);
    }
  }, [overdueAppointments.length]);

  useEffect(() => {
    if (calendarInitialized) return;
    if (loading) return;
    if (appointmentsList.length === 0 && availableServices.length === 0) return;

    const nextAvailableDate = findNextAvailableDate();

    if (nextAvailableDate) {
      setSelectedDate(nextAvailableDate);
    }

    setCalendarInitialized(true);
  }, [appointmentsList.length, availableServices.length, loading]);

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
            className="appointment__secondaryBtn history"
            onClick={() => setShowHistoryModal(true)}
          >
            Histórico
          </button>

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

                    const clickedDate = new Date(
                      currentYear,
                      currentMonth,
                      day,
                    );

                    const formattedDate = formatDateToCompare(clickedDate);

                    setSelectedDate(clickedDate);

                    // Primeiro clique = visualizar agenda do dia
                    if (lastClickedDay !== formattedDate) {
                      setLastClickedDay(formattedDate);
                      return;
                    }

                    // Segundo clique = novo agendamento
                    setFormData((prev) => ({
                      ...prev,
                      date: formattedDate,
                      startTime: "",
                      endTime: "",
                    }));

                    setEditId(null);
                    setClientSearch("");

                    setShowModal(true);

                    setLastClickedDay(null);
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
                    <span>
                      CPF/CNPJ:{" "}
                      {formatCpfCnpj(getClientDocument(appointment)) || "-"}
                    </span>
                    <span>
                      Telefone: {formatPhone(getClientPhone(appointment))}
                    </span>
                    <span>
                      Serviço: {appointment.title || "Serviço não informado"}
                    </span>
                  </div>
                </div>

                <div className="appointment__actions">
                  {appointment.status !== "FINISHED" &&
                    appointment.status !== "CANCELLED" && (
                      <button
                        type="button"
                        className="edit"
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        Editar
                      </button>
                    )}
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
              <h3>{editId ? "Editar Agendamento" : "Novo Agendamento"}</h3>

              <button
                className="appointment__closeBtn"
                onClick={closeAppointmentModal}
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
                    {fieldErrors.clientSearch && (
                      <span className="appointment__fieldError">
                        {fieldErrors.clientSearch}
                      </span>
                    )}

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

                  <div className="appointment__formGroup appointment__timeGroup">
                    <label>Horários disponíveis</label>
                    <button
                      type="button"
                      className="appointment__timeSelect"
                      onClick={() => setShowTimeDropdown((prev) => !prev)}
                      disabled={!formData.date || !formData.service}
                    >
                      {formData.startTime && formData.endTime
                        ? `${formData.startTime} às ${formData.endTime}`
                        : formData.startTime
                          ? `Início: ${formData.startTime} - selecione o fim`
                          : "Selecione início e fim"}
                    </button>
                    {showTimeDropdown && formData.date && formData.service && (
                      <div className="appointment__timeDropdown">
                        {availableTimes.length > 0 ? (
                          availableTimes.map((time) => (
                            <button
                              type="button"
                              key={time}
                              className={`
            ${
              formData.startTime === time || formData.endTime === time
                ? "active"
                : ""
            }
            ${
              formData.startTime &&
              formData.endTime &&
              time > formData.startTime &&
              time < formData.endTime
                ? "range"
                : ""
            }
          `}
                              onClick={() => {
                                handleTimeSelection(time);
                              }}
                            >
                              {time}
                            </button>
                          ))
                        ) : (
                          <div className="appointment__noTimes">
                            <p>Nenhum horário disponível para finalizar.</p>

                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  startTime: "",
                                  endTime: "",
                                }));
                              }}
                            >
                              Escolher outro início
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="appointment__formGroup">
                    <label>Fim automático</label>

                    <input
                      type="time"
                      value={formData.endTime}
                      disabled
                      placeholder="Selecione um horário"
                    />
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
                  {editId ? "Salvar Alterações" : "Cadastrar Agendamento"}
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
      {showHistoryModal && (
        <div className="appointment__modalOverlay">
          <div className="appointment__modal">
            <div className="appointment__modalHeader">
              <h3>Histórico de Agendamentos</h3>

              <button
                className="appointment__closeBtn"
                onClick={() => setShowHistoryModal(false)}
              >
                ×
              </button>
            </div>

            <div className="appointment__historyFilters">
              <div className="appointment__formGroup">
                <label>Data</label>
                <input
                  type="date"
                  value={historyFilters.date}
                  onChange={(e) =>
                    setHistoryFilters((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="appointment__formGroup">
                <label>Mês</label>
                <select
                  value={historyFilters.month}
                  onChange={(e) =>
                    setHistoryFilters((prev) => ({
                      ...prev,
                      month: e.target.value,
                    }))
                  }
                >
                  <option value="">Todos</option>
                  <option value="01">Janeiro</option>
                  <option value="02">Fevereiro</option>
                  <option value="03">Março</option>
                  <option value="04">Abril</option>
                  <option value="05">Maio</option>
                  <option value="06">Junho</option>
                  <option value="07">Julho</option>
                  <option value="08">Agosto</option>
                  <option value="09">Setembro</option>
                  <option value="10">Outubro</option>
                  <option value="11">Novembro</option>
                  <option value="12">Dezembro</option>
                </select>
              </div>

              <div className="appointment__formGroup">
                <label>Ano</label>
                <input
                  type="number"
                  placeholder="2026"
                  value={historyFilters.year}
                  onChange={(e) =>
                    setHistoryFilters((prev) => ({
                      ...prev,
                      year: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="appointment__historyList">
              {historyAppointments.length === 0 && (
                <p className="appointment__empty">
                  Nenhum agendamento encontrado.
                </p>
              )}

              {historyAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className={`appointment__historyItem ${appointment.status?.toLowerCase()}`}
                >
                  <strong>{appointment.title}</strong>

                  <span>
                    {formatDateToCompare(appointment.date)
                      .split("-")
                      .reverse()
                      .join("/")}{" "}
                    às {appointment.startTime || "--:--"}
                  </span>

                  <small>
                    Cliente: {getClientName(appointment)} • CPF/CNPJ:{" "}
                    {formatCpfCnpj(getClientDocument(appointment)) || "-"} •
                    Status: {translateStatus(appointment.status)}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showOverdueModal && overdueAppointments.length > 0 && (
        <div className="appointment__modalOverlay">
          <div className="appointment__modal">
            <div className="appointment__modalHeader">
              <h3>Agendamentos pendentes de marcação</h3>

              <button
                className="appointment__closeBtn"
                onClick={() => setShowOverdueModal(false)}
              >
                ×
              </button>
            </div>

            <div className="appointment__overdueAlert">
              <p>
                Existem agendamentos cujo dia e horário já passaram, mas ainda
                não foram marcados como concluídos ou cancelados.
              </p>
            </div>

            <div className="appointment__historyList">
              {overdueAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className={`appointment__historyItem ${appointment.status?.toLowerCase()}`}
                >
                  <strong>{appointment.title}</strong>

                  <span>
                    {formatDateToCompare(appointment.date)
                      .split("-")
                      .reverse()
                      .join("/")}{" "}
                    das {appointment.startTime || "--:--"} às{" "}
                    {appointment.endTime || "--:--"}
                  </span>

                  <small>
                    Cliente: {getClientName(appointment)} • Status:{" "}
                    {translateStatus(appointment.status)}
                  </small>

                  <div className="appointment__overdueActions">
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusUpdate(appointment._id, "FINISHED")
                      }
                    >
                      Marcar como concluído
                    </button>

                    <button
                      type="button"
                      className="cancel"
                      onClick={() =>
                        handleStatusUpdate(appointment._id, "CANCELLED")
                      }
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
