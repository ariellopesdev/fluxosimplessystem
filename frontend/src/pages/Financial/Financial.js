// CSS
import "./Financial.css";

// React
import { useEffect, useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";

import {
  createFinancial,
  deleteFinancial,
  getAllFinancials,
  getFinancialSummary,
  updateFinancial,
  resetMessage,
} from "../../slices/financialSlice";
import { getAllSales } from "../../slices/salesSlice";
import { getProducts } from "../../slices/productSlice";
import { getAllAppointments } from "../../slices/appointmentSlice";

// Icons
import { FaChartLine } from "react-icons/fa";
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import { IoClose } from "react-icons/io5";

// Components
import Message from "../../components/Message/Message";

const Financial = () => {
  const dispatch = useDispatch();

  const { financials, loading, error, message } = useSelector(
    (state) => state.financial,
  );

  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsData, setDetailsData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [historyFilters, setHistoryFilters] = useState({
    date: "",
    month: "",
    year: "",
  });
  const { sales } = useSelector((state) => state.sales);
  const { products } = useSelector((state) => state.product);
  const { appointments } = useSelector((state) => state.appointment);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    paymentStatus: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "INCOME",
    category: "SALE",

    amount: "",

    payment: {
      method: "PIX",
      status: "PENDING",
      installments: 1,
      paidAt: "",
      dueDate: "",
    },

    notes: "",

    isRecurring: false,

    recurrence: {
      frequency: "NONE",
      nextDate: "",
    },
  });

  useEffect(() => {
    dispatch(getAllFinancials());
    dispatch(getFinancialSummary());
    dispatch(getAllSales());
    dispatch(getProducts());
    dispatch(getAllAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "INCOME",
      category: "SALE",

      amount: "",

      payment: {
        method: "PIX",
        status: "PENDING",
        installments: 1,
        paidAt: "",
        dueDate: "",
      },

      notes: "",

      isRecurring: false,

      recurrence: {
        frequency: "NONE",
        nextDate: "",
      },
    });

    setEditId(null);
  };

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const translateType = (type) => {
    const types = {
      INCOME: "Receita",
      EXPENSE: "Despesa",
      ASSET: "Patrimônio",
    };

    return types[type] || "-";
  };

  const translateCategory = (category) => {
    const categories = {
      SALE: "Venda",
      PRODUCT_PURCHASE: "Compra de produto",
      PRODUCT_ASSET: "Ativo de produto",
      COMPANY_ASSET: "Patrimônio da empresa",
      MAINTENANCE: "Manutenção",
      TAX: "Imposto",
      SALARY: "Salário",
      RENT: "Aluguel",
      UTILITY: "Serviços",
      OTHER: "Outros",
    };

    return categories[category] || "-";
  };

  const appointmentsAsFinancials = Array.isArray(appointments)
    ? appointments
        .filter((appointment) => Number(appointment.total || 0) > 0)
        .map((appointment) => ({
          _id: `appointment-${appointment._id}`,
          title: `Agendamento - ${appointment.title || "Serviço"}`,
          description: "Receita gerada automaticamente por agendamento.",
          type: "INCOME",
          category: "UTILITY",
          amount: Number(appointment.total || 0),
          payment: {
            method: appointment.payment?.method || "PIX",
            status: appointment.payment?.status || "PENDING",
            installments: appointment.payment?.installments || 1,
            paidAt: appointment.payment?.paidAt || null,
            dueDate: appointment.date || null,
          },
          notes: appointment.notes || "",
          isRecurring: false,
          recurrence: {
            frequency: "NONE",
            nextDate: null,
          },
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt,
          automatic: true,
        }))
    : [];

  const translatePaymentMethod = (method) => {
    const methods = {
      CASH: "Dinheiro",
      PIX: "Pix",
      CREDIT_CARD: "Cartão de crédito",
      DEBIT_CARD: "Cartão de débito",
      BANK_SLIP: "Boleto",
      TRANSFER: "Transferência",
    };

    return methods[method] || "-";
  };

  const translatePaymentStatus = (status) => {
    const statuses = {
      PENDING: "Pendente",
      PAID: "Pago",
      CANCELLED: "Cancelado",
    };

    return statuses[status] || "-";
  };

  const financialList = Array.isArray(financials) ? financials : [];

  const salesAsFinancials = Array.isArray(sales)
    ? sales.map((sale) => ({
        _id: `sale-${sale._id}`,
        title: `Venda ${sale.saleNumber || ""}`,
        description: "Receita gerada automaticamente por venda.",
        type: "INCOME",
        category: "SALE",
        amount: Number(sale.total || 0),
        payment: sale.payment,
        notes: sale.notes || "",
        isRecurring: false,
        recurrence: {
          frequency: "NONE",
          nextDate: null,
        },
        createdAt: sale.createdAt,
        updatedAt: sale.updatedAt,
        automatic: true,
      }))
    : [];

  const productsAsFinancials = Array.isArray(products)
    ? products.map((product) => ({
        _id: `product-${product._id}`,
        title: product.name,
        description:
          product.category === "ASSET"
            ? "Bem da empresa cadastrado em produtos."
            : "Produto cadastrado em estoque.",
        type: product.category === "ASSET" ? "ASSET" : "EXPENSE",
        category:
          product.category === "ASSET" ? "COMPANY_ASSET" : "PRODUCT_PURCHASE",
        amount: Number(product.totalPrice || 0),
        payment: {
          method: "PIX",
          status: "PAID",
          installments: 1,
        },
        notes: "",
        isRecurring: false,
        recurrence: {
          frequency: "NONE",
          nextDate: null,
        },
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        automatic: true,
      }))
    : [];

  const allFinancials = [
    ...financialList,
    ...salesAsFinancials,
    ...productsAsFinancials,
    ...appointmentsAsFinancials,
  ];

  const filteredFinancials = allFinancials.filter((financial) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      !searchText ||
      financial.title?.toLowerCase().includes(searchText) ||
      financial.description?.toLowerCase().includes(searchText) ||
      financial.notes?.toLowerCase().includes(searchText);

    const matchesType = filters.type ? financial.type === filters.type : true;

    const matchesCategory = filters.category
      ? financial.category === filters.category
      : true;

    const matchesPaymentStatus = filters.paymentStatus
      ? (financial.payment?.status || "PENDING") === filters.paymentStatus
      : true;

    return (
      matchesSearch && matchesType && matchesCategory && matchesPaymentStatus
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,

      amount: Number(formData.amount),

      payment: {
        ...formData.payment,
        installments:
          formData.payment.method === "CREDIT_CARD"
            ? Number(formData.payment.installments)
            : 1,
      },
    };

    if (editId) {
      dispatch(
        updateFinancial({
          id: editId,
          financialData: payload,
        }),
      );
    } else {
      dispatch(createFinancial(payload));
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (financial) => {
    setEditId(financial._id);

    setFormData({
      title: financial.title || "",
      description: financial.description || "",
      type: financial.type || "INCOME",
      category: financial.category || "OTHER",

      amount: financial.amount || "",

      payment: {
        method: financial.payment?.method || "PIX",
        status: financial.payment?.status || "PENDING",
        installments: financial.payment?.installments || 1,
        paidAt: financial.payment?.paidAt
          ? financial.payment.paidAt.split("T")[0]
          : "",
        dueDate: financial.payment?.dueDate
          ? financial.payment.dueDate.split("T")[0]
          : "",
      },

      notes: financial.notes || "",

      isRecurring: financial.isRecurring || false,

      recurrence: {
        frequency: financial.recurrence?.frequency || "NONE",
        nextDate: financial.recurrence?.nextDate
          ? financial.recurrence.nextDate.split("T")[0]
          : "",
      },
    });

    setShowModal(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteFinancial(id));
  };

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

  const getFinancialDate = (financial) => {
    return (
      financial.payment?.paidAt ||
      financial.payment?.dueDate ||
      financial.createdAt ||
      financial.updatedAt
    );
  };

  const historyFinancials = allFinancials
    .filter((financial) => {
      const financialDate = formatDateToCompare(getFinancialDate(financial));

      if (!financialDate) return false;

      const [year, month] = financialDate.split("-");

      if (historyFilters.date && financialDate !== historyFilters.date) {
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
      const dateA = formatDateToCompare(getFinancialDate(a));
      const dateB = formatDateToCompare(getFinancialDate(b));

      return dateB.localeCompare(dateA);
    });

  return (
    <div className="financial">
      <div className="financial__header">
        <h2>
          <FaChartLine />
          Financeiro
        </h2>

        <div className="financial__headerActions">
          <button
            className="financial__secondaryBtn"
            onClick={() => setShowHistoryModal(true)}
          >
            Histórico
          </button>

          <button
            className="financial__btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Novo registro
          </button>
        </div>
      </div>

      <div className="financial__cards">
        <div className="financial__card income">
          <span>Receitas</span>

          <strong>
            {formatCurrency(
              allFinancials
                .filter((item) => item.type === "INCOME")
                .reduce((acc, item) => acc + Number(item.amount || 0), 0),
            )}
          </strong>
        </div>

        <div className="financial__card expense">
          <span>Despesas</span>

          <strong>
            {formatCurrency(
              allFinancials
                .filter((item) => item.type === "EXPENSE")
                .reduce((acc, item) => acc + Number(item.amount || 0), 0),
            )}
          </strong>
        </div>

        <div className="financial__card asset">
          <span>Patrimônio</span>

          <strong>
            {formatCurrency(
              allFinancials
                .filter((item) => item.type === "ASSET")
                .reduce((acc, item) => acc + Number(item.amount || 0), 0),
            )}
          </strong>
        </div>

        <div className="financial__card balance">
          <span>Saldo</span>

          <strong>
            {formatCurrency(
              allFinancials.reduce((acc, item) => {
                if (item.type === "INCOME") {
                  return acc + Number(item.amount || 0);
                }

                if (item.type === "EXPENSE") {
                  return acc - Number(item.amount || 0);
                }

                return acc;
              }, 0),
            )}
          </strong>
        </div>
      </div>

      <div className="financial__filters">
        <input
          type="text"
          placeholder="Buscar registro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              type: e.target.value,
            }))
          }
        >
          <option value="">Todos os tipos</option>
          <option value="INCOME">Receita</option>
          <option value="EXPENSE">Despesa</option>
          <option value="ASSET">Patrimônio</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              category: e.target.value,
            }))
          }
        >
          <option value="">Todas as categorias</option>
          <option value="SALE">Venda</option>
          <option value="PRODUCT_PURCHASE">Compra de produto</option>
          <option value="PRODUCT_ASSET">Ativo de produto</option>
          <option value="COMPANY_ASSET">Patrimônio da empresa</option>
          <option value="MAINTENANCE">Manutenção</option>
          <option value="TAX">Imposto</option>
          <option value="SALARY">Salário</option>
          <option value="RENT">Aluguel</option>
          <option value="UTILITY">Serviços</option>
          <option value="OTHER">Outros</option>
        </select>

        <select
          value={filters.paymentStatus}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              paymentStatus: e.target.value,
            }))
          }
        >
          <option value="">Todos os status</option>
          <option value="PENDING">Pendente</option>
          <option value="PAID">Pago</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
        <button
          type="button"
          className="financial__clearBtn"
          onClick={() => {
            setSearch("");
            setFilters({
              type: "",
              category: "",
              paymentStatus: "",
            });
          }}
        >
          Limpar filtros
        </button>
      </div>

      <div className="financial__table">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Categoria</th>
              <th>Valor</th>
              <th>Pagamento</th>
              <th>Status</th>
              <th>Recorrente</th>
              <th>Dados</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {filteredFinancials?.length > 0 ? (
              filteredFinancials.map((financial) => (
                <tr key={financial._id}>
                  <td>{financial.title}</td>

                  <td>{translateType(financial.type)}</td>

                  <td>{translateCategory(financial.category)}</td>

                  <td>{formatCurrency(financial.amount)}</td>

                  <td>{translatePaymentMethod(financial.payment?.method)}</td>

                  <td>
                    <span
                      className={`status ${
                        financial.payment?.status === "PAID"
                          ? "active"
                          : financial.payment?.status === "CANCELLED"
                            ? "inactive"
                            : "pending"
                      }`}
                    >
                      {translatePaymentStatus(financial.payment?.status)}
                    </span>
                  </td>

                  <td>{financial.isRecurring ? "Sim" : "Não"}</td>

                  <td>
                    <button
                      className="financial__smallBtn"
                      onClick={() => {
                        setDetailsData(financial);
                        setShowDetails(true);
                      }}
                    >
                      <MdVisibility />
                      Ver dados
                    </button>
                  </td>

                  <td>
                    {!financial.automatic ? (
                      <div className="table__edit--close">
                        <MdEdit
                          className="financial__actionIcon edit"
                          onClick={() => handleEdit(financial)}
                        />

                        <MdDelete
                          className="financial__actionIcon delete"
                          onClick={() => handleDelete(financial._id)}
                        />
                      </div>
                    ) : (
                      <span className="financial__automatic">Automático</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">Nenhum registro encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="financial__modalOverlay">
          <div className="financial__modal">
            <div className="financial__modalHeader">
              <h3>{editId ? "Editar registro" : "Novo registro financeiro"}</h3>

              <button
                className="financial__closeBtn"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <IoClose />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="financial__form">
              <div className="financial__section">
                <h4>Dados principais</h4>

                <div className="form__group--financial">
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
                  />
                </div>

                <div className="form__group--financial">
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

                <div className="financial__grid">
                  <div className="form__group--financial">
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
                      <option value="INCOME">Receita</option>
                      <option value="EXPENSE">Despesa</option>
                      <option value="ASSET">Patrimônio</option>
                    </select>
                  </div>

                  <div className="form__group--financial">
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
                      <option value="SALE">Venda</option>
                      <option value="PRODUCT_PURCHASE">
                        Compra de produto
                      </option>
                      <option value="PRODUCT_ASSET">Ativo de produto</option>
                      <option value="COMPANY_ASSET">
                        Patrimônio da empresa
                      </option>
                      <option value="MAINTENANCE">Manutenção</option>
                      <option value="TAX">Imposto</option>
                      <option value="SALARY">Salário</option>
                      <option value="RENT">Aluguel</option>
                      <option value="UTILITY">Serviços</option>
                      <option value="OTHER">Outros</option>
                    </select>
                  </div>

                  <div className="form__group--financial">
                    <label>Valor</label>

                    <input
                      type="number"
                      min="0"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="financial__section">
                <h4>Pagamento</h4>

                <div className="financial__grid">
                  <div className="form__group--financial">
                    <label>Forma de pagamento</label>

                    <select
                      value={formData.payment.method}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          payment: {
                            ...prev.payment,
                            method: e.target.value,
                          },
                        }))
                      }
                    >
                      <option value="CASH">Dinheiro</option>
                      <option value="PIX">Pix</option>
                      <option value="CREDIT_CARD">Cartão de crédito</option>
                      <option value="DEBIT_CARD">Cartão de débito</option>
                      <option value="BANK_SLIP">Boleto</option>
                      <option value="TRANSFER">Transferência</option>
                    </select>
                  </div>

                  <div className="form__group--financial">
                    <label>Status do pagamento</label>

                    <select
                      value={formData.payment.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          payment: {
                            ...prev.payment,
                            status: e.target.value,
                          },
                        }))
                      }
                    >
                      <option value="PENDING">Pendente</option>
                      <option value="PAID">Pago</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </div>

                  {formData.payment.method === "CREDIT_CARD" && (
                    <div className="form__group--financial">
                      <label>Parcelas</label>

                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={formData.payment.installments}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            payment: {
                              ...prev.payment,
                              installments: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  )}

                  <div className="form__group--financial">
                    <label>Pago em</label>

                    <input
                      type="date"
                      value={formData.payment.paidAt}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          payment: {
                            ...prev.payment,
                            paidAt: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="form__group--financial">
                    <label>Vencimento</label>

                    <input
                      type="date"
                      value={formData.payment.dueDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          payment: {
                            ...prev.payment,
                            dueDate: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="financial__section">
                <h4>Recorrência</h4>

                <div className="financial__grid">
                  <div className="form__group--financial checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.isRecurring}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isRecurring: e.target.checked,
                          }))
                        }
                      />
                      Registro recorrente
                    </label>
                  </div>

                  {formData.isRecurring && (
                    <>
                      <div className="form__group--financial">
                        <label>Frequência</label>

                        <select
                          value={formData.recurrence.frequency}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              recurrence: {
                                ...prev.recurrence,
                                frequency: e.target.value,
                              },
                            }))
                          }
                        >
                          <option value="NONE">Nenhuma</option>
                          <option value="DAILY">Diária</option>
                          <option value="WEEKLY">Semanal</option>
                          <option value="MONTHLY">Mensal</option>
                          <option value="YEARLY">Anual</option>
                        </select>
                      </div>

                      <div className="form__group--financial">
                        <label>Próxima recorrência</label>

                        <input
                          type="date"
                          value={formData.recurrence.nextDate}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              recurrence: {
                                ...prev.recurrence,
                                nextDate: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="financial__section">
                <h4>Observações</h4>

                <div className="form__group--financial">
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
                <button className="financial__btn" type="submit">
                  {editId ? "Salvar alterações" : "Cadastrar"}
                </button>
              )}

              {loading && (
                <button className="financial__btn" disabled>
                  Aguarde...
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {showDetails && detailsData && (
        <div className="financial__modalOverlay">
          <div className="financial__modal details">
            <div className="financial__modalHeader">
              <h3>Dados do registro</h3>

              <button
                className="financial__closeBtn"
                onClick={() => {
                  setShowDetails(false);
                  setDetailsData(null);
                }}
              >
                <IoClose />
              </button>
            </div>

            <div className="financial__details">
              <div className="financial__detailsSection">
                <h4>Dados principais</h4>

                <p>
                  <strong>ID:</strong> {detailsData._id}
                </p>

                <p>
                  <strong>Título:</strong> {detailsData.title}
                </p>

                <p>
                  <strong>Descrição:</strong> {detailsData.description || "-"}
                </p>

                <p>
                  <strong>Tipo:</strong> {translateType(detailsData.type)}
                </p>

                <p>
                  <strong>Categoria:</strong>{" "}
                  {translateCategory(detailsData.category)}
                </p>

                <p>
                  <strong>Valor:</strong> {formatCurrency(detailsData.amount)}
                </p>
              </div>

              <div className="financial__detailsSection">
                <h4>Pagamento</h4>

                <p>
                  <strong>Forma de pagamento:</strong>{" "}
                  {translatePaymentMethod(detailsData.payment?.method)}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {translatePaymentStatus(detailsData.payment?.status)}
                </p>

                <p>
                  <strong>Parcelas:</strong>{" "}
                  {detailsData.payment?.installments || 1}x
                </p>

                <p>
                  <strong>Pago em:</strong>{" "}
                  {detailsData.payment?.paidAt
                    ? new Date(detailsData.payment.paidAt).toLocaleDateString(
                        "pt-BR",
                      )
                    : "-"}
                </p>

                <p>
                  <strong>Vencimento:</strong>{" "}
                  {detailsData.payment?.dueDate
                    ? new Date(detailsData.payment.dueDate).toLocaleDateString(
                        "pt-BR",
                      )
                    : "-"}
                </p>
              </div>

              <div className="financial__detailsSection">
                <h4>Recorrência</h4>

                <p>
                  <strong>Recorrente:</strong>{" "}
                  {detailsData.isRecurring ? "Sim" : "Não"}
                </p>

                <p>
                  <strong>Frequência:</strong>{" "}
                  {detailsData.recurrence?.frequency || "-"}
                </p>

                <p>
                  <strong>Próxima recorrência:</strong>{" "}
                  {detailsData.recurrence?.nextDate
                    ? new Date(
                        detailsData.recurrence.nextDate,
                      ).toLocaleDateString("pt-BR")
                    : "-"}
                </p>
              </div>

              <div className="financial__detailsSection">
                <h4>Observações e datas</h4>

                <p>
                  <strong>Observações:</strong> {detailsData.notes || "-"}
                </p>

                <p>
                  <strong>Criado em:</strong>{" "}
                  {detailsData.createdAt
                    ? new Date(detailsData.createdAt).toLocaleString("pt-BR")
                    : "-"}
                </p>

                <p>
                  <strong>Atualizado em:</strong>{" "}
                  {detailsData.updatedAt
                    ? new Date(detailsData.updatedAt).toLocaleString("pt-BR")
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showHistoryModal && (
        <div className="financial__modalOverlay">
          <div className="financial__modal">
            <div className="financial__modalHeader">
              <h3>Histórico Financeiro</h3>

              <button
                className="financial__closeBtn"
                onClick={() => setShowHistoryModal(false)}
              >
                <IoClose />
              </button>
            </div>

            <div className="financial__historyFilters">
              <div className="form__group--financial">
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

              <div className="form__group--financial">
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

              <div className="form__group--financial">
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

            <div className="financial__historyList">
              {historyFinancials.length === 0 && (
                <p className="financial__empty">
                  Nenhuma movimentação encontrada.
                </p>
              )}

              {historyFinancials.map((financial) => (
                <div
                  key={financial._id}
                  className={`financial__historyItem ${financial.type?.toLowerCase()}`}
                >
                  <div>
                    <strong>{financial.title}</strong>

                    <span>
                      {formatDateToCompare(getFinancialDate(financial))
                        .split("-")
                        .reverse()
                        .join("/")}
                    </span>
                  </div>

                  <small>
                    {translateType(financial.type)} •{" "}
                    {translateCategory(financial.category)} •{" "}
                    {translatePaymentStatus(
                      financial.payment?.status || "PENDING",
                    )}
                  </small>

                  <p>{formatCurrency(financial.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {error && <Message msg={error} type="error" />}
      {message && <Message msg={message} type="success" />}
    </div>
  );
};

export default Financial;
