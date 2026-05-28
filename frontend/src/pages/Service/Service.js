import "./Service.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createService,
  deleteService,
  getServices,
  updateService,
  resetMessage,
} from "../../slices/serviceSlice";

import { MdDelete, MdEdit, MdDesignServices } from "react-icons/md";
import { IoClose } from "react-icons/io5";

import Message from "../../components/Message/Message";

const Services = () => {
  const dispatch = useDispatch();

  const { services, loading, error, message } = useSelector(
    (state) => state.service,
  );

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    unityPrice: "",
    estimatedDurationValue: "",
    estimatedDurationUnit: "HOURS",
    category: "SERVICE",
    status: "ACTIVE",
    isSchedulable: true,
    isSellable: true,
    requiresClient: true,
    notes: "",
  });

  const servicesList = Array.isArray(services) ? services : [];

  const activeServices = servicesList.filter(
    (service) => service.status === "ACTIVE",
  ).length;

  const sellableServices = servicesList.filter(
    (service) => service.isSellable,
  ).length;

  const schedulableServices = servicesList.filter(
    (service) => service.isSchedulable,
  ).length;

  const inactiveServices = servicesList.filter(
    (service) => service.status === "INACTIVE",
  ).length;

  const filteredServices = servicesList.filter((service) => {
    const searchText = search.toLowerCase();

    return (
      service.name?.toLowerCase().includes(searchText) ||
      service.description?.toLowerCase().includes(searchText) ||
      service.category?.toLowerCase().includes(searchText) ||
      service.status?.toLowerCase().includes(searchText)
    );
  });

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const translateCategory = (category) => {
    const categories = {
      SERVICE: "Serviço",
      CONSULTATION: "Consulta",
      INSTALLATION: "Instalação",
      MAINTENANCE: "Manutenção",
      DELIVERY: "Entrega",
      SUPPORT: "Suporte",
      OTHER: "Outro",
    };

    return categories[category] || "-";
  };

  const translateDurationUnit = (unit) => {
    const units = {
      MINUTES: "Minutos",
      HOURS: "Horas",
      DAYS: "Dias",
    };

    return units[unit] || "-";
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      unityPrice: "",
      estimatedDurationValue: "",
      estimatedDurationUnit: "HOURS",
      category: "SERVICE",
      status: "ACTIVE",
      isSchedulable: true,
      isSellable: true,
      requiresClient: true,
      notes: "",
    });

    setEditId(null);
  };

  const handleEdit = (service) => {
    setEditId(service._id);

    setFormData({
      name: service.name || "",
      description: service.description || "",
      unityPrice: service.unityPrice || "",
      estimatedDurationValue: service.estimatedDuration?.value || "",
      estimatedDurationUnit: service.estimatedDuration?.unit || "HOURS",
      category: service.category || "SERVICE",
      status: service.status || "ACTIVE",
      isSchedulable: service.isSchedulable ?? true,
      isSellable: service.isSellable ?? true,
      requiresClient: service.requiresClient ?? true,
      notes: service.notes || "",
    });

    setShowModal(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteService(id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      unityPrice: formData.unityPrice,
      estimatedDurationValue: formData.estimatedDurationValue,
      estimatedDurationUnit: formData.estimatedDurationUnit,
      category: formData.category,
      status: formData.status,
      isSchedulable: formData.isSchedulable,
      isSellable: formData.isSellable,
      requiresClient: formData.requiresClient,
      notes: formData.notes,
    };

    if (editId) {
      await dispatch(updateService({ id: editId, serviceData: payload }));
    } else {
      await dispatch(createService(payload));
    }

    dispatch(getServices());
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="services">
      <div className="services__header">
        <h2>
          <MdDesignServices /> Serviços
        </h2>

        <button
          className="services__btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Novo Serviço
        </button>
      </div>

      {error && <Message msg={error} type="error" />}
      {message && <Message msg={message} type="success" />}

      <div className="services__cards">
        <div className="serviceCard green">{activeServices} Ativos</div>
        <div className="serviceCard blue">{sellableServices} Vendáveis</div>
        <div className="serviceCard orange">
          {schedulableServices} Agendáveis
        </div>
        <div className="serviceCard red">{inactiveServices} Inativos</div>
      </div>

      <div className="services__filters">
        <input
          type="text"
          placeholder="Buscar serviço..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="services__table">
        <table>
          <thead>
            <tr>
              <th>Serviço</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Duração</th>
              <th>Venda</th>
              <th>Agendamento</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {filteredServices.map((service) => (
              <tr key={service._id}>
                <td>
                  <strong>{service.name}</strong>
                  <span>{service.description || "-"}</span>
                </td>

                <td>{translateCategory(service.category)}</td>

                <td>{formatCurrency(service.unityPrice)}</td>

                <td>
                  {service.estimatedDuration?.value || "-"}{" "}
                  {translateDurationUnit(service.estimatedDuration?.unit)}
                </td>

                <td>{service.isSellable ? "Sim" : "Não"}</td>

                <td>{service.isSchedulable ? "Sim" : "Não"}</td>

                <td>
                  <span
                    className={`status ${
                      service.status === "ACTIVE" ? "active" : "inactive"
                    }`}
                  >
                    {service.status === "ACTIVE" ? "Ativo" : "Inativo"}
                  </span>
                </td>

                <td>
                  <div className="table__edit--close">
                    <MdEdit
                      className="service__actionIcon edit"
                      onClick={() => handleEdit(service)}
                    />

                    <MdDelete
                      className="service__actionIcon delete"
                      onClick={() => handleDelete(service._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="services__modalOverlay">
          <div className="services__modal">
            <div className="services__modalHeader">
              <h3>{editId ? "Editar Serviço" : "Novo Serviço"}</h3>

              <button
                className="services__closeBtn"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <IoClose />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="services__form">
              <div className="services__section">
                <h4>Dados principais</h4>

                <div className="form__group--service">
                  <label>Nome do serviço</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="form__group--service">
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

                <div className="services__grid">
                  <div className="form__group--service">
                    <label>Preço</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.unityPrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          unityPrice: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="form__group--service">
                    <label>Categoria</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                    >
                      <option value="SERVICE">Serviço</option>
                      <option value="CONSULTATION">Consulta</option>
                      <option value="INSTALLATION">Instalação</option>
                      <option value="MAINTENANCE">Manutenção</option>
                      <option value="DELIVERY">Entrega</option>
                      <option value="SUPPORT">Suporte</option>
                      <option value="OTHER">Outro</option>
                    </select>
                  </div>

                  <div className="form__group--service">
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
                      <option value="ACTIVE">Ativo</option>
                      <option value="INACTIVE">Inativo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="services__section">
                <h4>Vendas e agendamentos</h4>

                <div className="services__grid">
                  <div className="form__group--service">
                    <label>Vendável em vendas?</label>
                    <select
                      value={String(formData.isSellable)}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isSellable: e.target.value === "true",
                        }))
                      }
                    >
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </select>
                  </div>

                  <div className="form__group--service">
                    <label>Agendável?</label>
                    <select
                      value={String(formData.isSchedulable)}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isSchedulable: e.target.value === "true",
                        }))
                      }
                    >
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </select>
                  </div>

                  <div className="form__group--service">
                    <label>Exige cliente?</label>
                    <select
                      value={String(formData.requiresClient)}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          requiresClient: e.target.value === "true",
                        }))
                      }
                    >
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="services__section">
                <h4>Duração estimada</h4>

                <div className="services__grid two">
                  <div className="form__group--service">
                    <label>Duração</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.estimatedDurationValue}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          estimatedDurationValue: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="form__group--service">
                    <label>Unidade</label>
                    <select
                      value={formData.estimatedDurationUnit}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          estimatedDurationUnit: e.target.value,
                        }))
                      }
                    >
                      <option value="MINUTES">Minutos</option>
                      <option value="HOURS">Horas</option>
                      <option value="DAYS">Dias</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="services__section">
                <h4>Observações</h4>

                <div className="form__group--service">
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
                <button type="submit" className="services__btn">
                  {editId ? "Salvar alterações" : "Cadastrar Serviço"}
                </button>
              )}

              {loading && (
                <button type="submit" className="services__btn" disabled>
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

export default Services;