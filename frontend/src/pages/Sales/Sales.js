// CSS
import "./Sales.css";

// React
import { useEffect, useMemo, useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  createSale,
  getAllSales,
  updateSale,
  resetMessage,
} from "../../slices/salesSlice";

import { getAllClients } from "../../slices/clientSlice";
import { getProducts } from "../../slices/productSlice";

// Icons
import { MdEdit, MdVisibility } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

// Components
import Message from "../../components/Message/Message";

const Sales = () => {
  const dispatch = useDispatch();

  const { sales, loading, error, message } = useSelector(
    (state) => state.sales,
  );

  const { clients } = useSelector((state) => state.client);
  const { products } = useSelector((state) => state.product);

  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [detailsSale, setDetailsSale] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    client: "",
    customerDocument: "",
    products: [
      {
        product: "",
        name: "",
        quantity: 1,
        unityPrice: 0,
        totalPrice: 0,
      },
    ],
    payment: {
      method: "PIX",
      status: "PENDING",
      installments: 1,
    },
    discount: 0,
    shipping: 0,
    notes: "",
    status: "OPEN",
  });

  const [paymentData, setPaymentData] = useState({
    method: "PIX",
    status: "PENDING",
    installments: 1,
    statusSale: "OPEN",
  });

  useEffect(() => {
    dispatch(getAllSales());
    dispatch(getAllClients());
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch]);

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

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
      REFUNDED: "Reembolsado",
    };

    return statuses[status] || "-";
  };

  const translateSaleStatus = (status) => {
    const statuses = {
      OPEN: "Aberta",
      FINISHED: "Finalizada",
      CANCELLED: "Cancelada",
    };

    return statuses[status] || "-";
  };

  const onlyNumbers = (value) => value.replace(/\D/g, "");

  const formatCPF = (value) => {
    value = onlyNumbers(value).slice(0, 11);

    value = value.replace(/^(\d{3})(\d)/, "$1.$2");
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1-$2");

    return value;
  };

  const formatCNPJ = (value) => {
    value = onlyNumbers(value).slice(0, 14);

    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");

    return value;
  };

  const formatCpfCnpj = (value) => {
    const numbers = onlyNumbers(value || "");

    return numbers.length > 11 ? formatCNPJ(numbers) : formatCPF(numbers);
  };

  const getClientName = (sale) => {
    if (typeof sale.client === "object") {
      return sale.client?.name || "-";
    }

    const client = clients?.find((item) => item._id === sale.client);
    return client?.name || "-";
  };

  const getSellerName = (sale) => {
    if (typeof sale.seller === "object") {
      return sale.seller?.name || sale.seller?.email || "-";
    }

    return "-";
  };

  const getProductById = (id) => {
    return products?.find((product) => product._id === id);
  };

  const getSellableProducts = () => {
    return products?.filter(
      (product) =>
        product.category === "SELLABLE" &&
        Number(product.stock) > 0 &&
        Number(product.unityPrice) > 0,
    );
  };

  const subtotal = useMemo(() => {
    return formData.products.reduce(
      (acc, item) => acc + Number(item.totalPrice || 0),
      0,
    );
  }, [formData.products]);

  const total = useMemo(() => {
    return (
      Number(subtotal || 0) -
      Number(formData.discount || 0) +
      Number(formData.shipping || 0)
    );
  }, [subtotal, formData.discount, formData.shipping]);

  const paidSales =
    sales?.filter((sale) => sale.payment?.status === "PAID").length || 0;

  const pendingSales =
    sales?.filter((sale) => sale.payment?.status === "PENDING").length || 0;

  const totalRevenue =
    sales?.reduce((acc, sale) => acc + Number(sale.total || 0), 0) || 0;

  const filteredSales = sales?.filter((sale) => {
    const searchText = search.toLowerCase();

    const productsText = sale.products
      ?.map((item) => item.name)
      .join(" ")
      .toLowerCase();

    return (
      sale.saleNumber?.toLowerCase().includes(searchText) ||
      getClientName(sale).toLowerCase().includes(searchText) ||
      sale.customerDocument?.toLowerCase().includes(searchText) ||
      productsText?.includes(searchText) ||
      sale.payment?.method?.toLowerCase().includes(searchText) ||
      sale.payment?.status?.toLowerCase().includes(searchText) ||
      sale.status?.toLowerCase().includes(searchText)
    );
  });

  const resetForm = () => {
    setFormData({
      client: "",
      customerDocument: "",
      products: [
        {
          product: "",
          name: "",
          quantity: 1,
          unityPrice: 0,
          totalPrice: 0,
        },
      ],
      payment: {
        method: "PIX",
        status: "PENDING",
        installments: 1,
      },
      discount: 0,
      shipping: 0,
      notes: "",
      status: "OPEN",
    });
  };

  const handleProductChange = (index, productId) => {
    const selectedProduct = getProductById(productId);

    const updatedProducts = [...formData.products];

    updatedProducts[index] = {
      product: selectedProduct?._id || "",
      name: selectedProduct?.name || "",
      quantity: 1,
      unityPrice: Number(selectedProduct?.unityPrice || 0),
      totalPrice: Number(selectedProduct?.unityPrice || 0),
    };

    setFormData((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedProducts = [...formData.products];
    const item = updatedProducts[index];
    const product = getProductById(item.product);

    const maxStock = Number(product?.stock || 0);
    const validQuantity = Math.min(Number(quantity || 1), maxStock);

    updatedProducts[index] = {
      ...item,
      quantity: validQuantity,
      totalPrice: Number(item.unityPrice || 0) * validQuantity,
    };

    setFormData((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };

  const addProductRow = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          product: "",
          name: "",
          quantity: 1,
          unityPrice: 0,
          totalPrice: 0,
        },
      ],
    }));
  };

  const removeProductRow = (index) => {
    if (formData.products.length === 1) return;

    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const invalidProduct = formData.products.some(
      (item) => !item.product || Number(item.quantity) < 1,
    );

    if (invalidProduct) return;

    const payload = {
      client: formData.client || null,
      customerDocument: formData.customerDocument,
      products: formData.products,
      payment: {
        ...formData.payment,
        installments:
          formData.payment.method === "CREDIT_CARD"
            ? Number(formData.payment.installments)
            : 1,
      },
      subtotal,
      discount: Number(formData.discount || 0),
      shipping: Number(formData.shipping || 0),
      total,
      notes: formData.notes,
      status: formData.status,
    };

    dispatch(createSale(payload));

    setShowSaleModal(false);
    resetForm();
  };

  const openPaymentEdit = (sale) => {
    setSelectedSale(sale);

    setPaymentData({
      method: sale.payment?.method || "PIX",
      status: sale.payment?.status || "PENDING",
      installments: sale.payment?.installments || 1,
      statusSale: sale.status || "OPEN",
    });

    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      updateSale({
        id: selectedSale._id,
        saleData: {
          payment: {
            method: paymentData.method,
            status: paymentData.status,
            installments:
              paymentData.method === "CREDIT_CARD"
                ? Number(paymentData.installments)
                : 1,
          },
          status: paymentData.statusSale,
        },
      }),
    ).unwrap();

    dispatch(getAllSales());

    setShowPaymentModal(false);
    setSelectedSale(null);
  };

  const handleClientChange = (clientId) => {
    const selectedClient = clients?.find((client) => client._id === clientId);

    setFormData((prev) => ({
      ...prev,
      client: clientId,
      customerDocument: selectedClient?.cpfCnpj
        ? formatCpfCnpj(selectedClient.cpfCnpj)
        : "",
    }));
  };

  return (
    <div className="sales">
      <div className="sales__header">
        <h2>
          <FaShoppingCart />
          Vendas
        </h2>

        <button
          className="sales__btn"
          onClick={() => {
            resetForm();
            setShowSaleModal(true);
          }}
        >
          + Nova Venda
        </button>
      </div>

      {error && <Message msg={error} type="error" />}
      {message && <Message msg={message} type="success" />}

      <div className="sales__cards">
        <div className="card green">{sales?.length || 0} Vendas</div>
        <div className="card blue">{paidSales} Pagas</div>
        <div className="card orange">{pendingSales} Pendentes</div>
        <div className="card red">{formatCurrency(totalRevenue)}</div>
      </div>

      <div className="sales__filters">
        <input
          type="text"
          placeholder="Buscar venda..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="sales__table">
        <table>
          <thead>
            <tr>
              <th>ID Compra</th>
              <th>Cliente</th>
              <th>CPF/CNPJ</th>
              <th>Itens comprados</th>
              <th>Total</th>
              <th>Pagamento</th>
              <th>Status</th>
              <th>Data</th>
              <th>Dados</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {filteredSales && filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale.saleNumber || sale._id}</td>
                  <td>{getClientName(sale)}</td>
                  <td>{sale.customerDocument || "-"}</td>

                  <td>
                    <div className="sales__itemsList">
                      {sale.products?.map((item, index) => (
                        <span key={index}>
                          {item.quantity}x {item.name} —{" "}
                          {formatCurrency(item.totalPrice)}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td>{formatCurrency(sale.total)}</td>

                  <td>
                    {translatePaymentMethod(sale.payment?.method)} /{" "}
                    {translatePaymentStatus(sale.payment?.status)}
                  </td>

                  <td>
                    <span
                      className={`status ${
                        sale.status === "FINISHED"
                          ? "active"
                          : sale.status === "CANCELLED"
                            ? "inactive"
                            : "pending"
                      }`}
                    >
                      {translateSaleStatus(sale.status)}
                    </span>
                  </td>

                  <td>
                    {sale.createdAt
                      ? new Date(sale.createdAt).toLocaleDateString("pt-BR")
                      : "-"}
                  </td>

                  <td>
                    <button
                      className="sales__smallBtn"
                      onClick={() => setDetailsSale(sale)}
                    >
                      <MdVisibility /> Ver dados
                    </button>
                  </td>

                  <td>
                    <div className="table__edit--close">
                      <MdEdit
                        className="sales__actionIcon edit"
                        onClick={() => openPaymentEdit(sale)}
                        title="Editar pagamento"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">Nenhuma venda encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showSaleModal && (
        <div className="sales__modalOverlay">
          <div className="sales__modal sales__receiptModal">
            <div className="sales__modalHeader">
              <h3>Nova Venda</h3>

              <button
                className="sales__closeBtn"
                onClick={() => {
                  setShowSaleModal(false);
                  resetForm();
                }}
              >
                <IoClose />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="form__sales">
              <div className="sales__receipt">
                <div className="sales__receiptTop">
                  <strong>Comprovante de Venda</strong>
                  <span>{new Date().toLocaleDateString("pt-BR")}</span>
                </div>

                <div className="sales__customerGrid">
                  <div className="form__group--sales">
                    <label>Cliente cadastrado</label>

                    <select
                      value={formData.client}
                      onChange={(e) => handleClientChange(e.target.value)}
                    >
                      <option value="">Venda sem cliente vinculado</option>

                      {clients?.map((client) => (
                        <option key={client._id} value={client._id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form__group--sales">
                    <label>CPF/CNPJ na nota</label>

                    <input
                      type="text"
                      placeholder="Opcional"
                      value={formData.customerDocument}
                      maxLength={18}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customerDocument: formatCpfCnpj(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="sales__productsBox">
                  <h4>Produtos</h4>

                  {formData.products.map((item, index) => {
                    const product = getProductById(item.product);

                    return (
                      <div className="sales__productRow" key={index}>
                        <div className="form__group--sales">
                          <label>Produto</label>

                          <select
                            value={item.product}
                            onChange={(e) =>
                              handleProductChange(index, e.target.value)
                            }
                            required
                          >
                            <option value="">Selecione</option>

                            {getSellableProducts()?.map((product) => (
                              <option key={product._id} value={product._id}>
                                {product.name} | Estoque: {product.stock} |{" "}
                                {formatCurrency(product.unityPrice)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form__group--sales">
                          <label>Qtd</label>

                          <input
                            type="number"
                            min="1"
                            max={product?.stock || 1}
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(index, e.target.value)
                            }
                            required
                          />
                        </div>

                        <div className="form__group--sales">
                          <label>Preço</label>
                          <input
                            type="text"
                            value={formatCurrency(item.unityPrice)}
                            disabled
                          />
                        </div>

                        <div className="form__group--sales">
                          <label>Total</label>
                          <input
                            type="text"
                            value={formatCurrency(item.totalPrice)}
                            disabled
                          />
                        </div>

                        <button
                          type="button"
                          className="sales__removeBtn"
                          onClick={() => removeProductRow(index)}
                        >
                          Remover
                        </button>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    className="sales__outlineBtn"
                    onClick={addProductRow}
                  >
                    + Adicionar produto
                  </button>
                </div>

                <div className="sales__paymentGrid">
                  <div className="form__group--sales">
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

                  <div className="form__group--sales">
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
                    <div className="form__group--sales">
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

                  <div className="form__group--sales">
                    <label>Status da venda</label>

                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                    >
                      <option value="OPEN">Aberta</option>
                      <option value="FINISHED">Finalizada</option>
                      <option value="CANCELLED">Cancelada</option>
                    </select>
                  </div>
                </div>

                <div className="sales__totals">
                  <div className="form__group--sales">
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

                  <div className="form__group--sales">
                    <label>Frete</label>

                    <input
                      type="number"
                      min="0"
                      value={formData.shipping}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          shipping: Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div className="sales__summary">
                    <p>
                      <span>Subtotal:</span>
                      <strong>{formatCurrency(subtotal)}</strong>
                    </p>

                    <p>
                      <span>Desconto:</span>
                      <strong>{formatCurrency(formData.discount)}</strong>
                    </p>

                    <p>
                      <span>Frete:</span>
                      <strong>{formatCurrency(formData.shipping)}</strong>
                    </p>

                    <p className="sales__summaryTotal">
                      <span>Total:</span>
                      <strong>{formatCurrency(total)}</strong>
                    </p>
                  </div>
                </div>

                <div className="form__group--sales">
                  <label>Observações</label>

                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Observações da venda"
                  />
                </div>

                {!loading && (
                  <button type="submit" className="sales__btn">
                    Finalizar Venda
                  </button>
                )}

                {loading && (
                  <button type="submit" className="sales__btn" disabled>
                    Aguarde...
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {showPaymentModal && selectedSale && (
        <div className="sales__modalOverlay">
          <div className="sales__modal">
            <div className="sales__modalHeader">
              <h3>Editar Pagamento</h3>

              <button
                className="sales__closeBtn"
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedSale(null);
                }}
              >
                <IoClose />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="form__sales">
              <div className="form__group--sales">
                <label>Forma de pagamento</label>

                <select
                  value={paymentData.method}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      method: e.target.value,
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

              <div className="form__group--sales">
                <label>Status do pagamento</label>

                <select
                  value={paymentData.status}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <option value="PENDING">Pendente</option>
                  <option value="PAID">Pago</option>
                  <option value="CANCELLED">Cancelado</option>
                  <option value="REFUNDED">Reembolsado</option>
                </select>
              </div>

              {paymentData.method === "CREDIT_CARD" && (
                <div className="form__group--sales">
                  <label>Parcelas</label>

                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={paymentData.installments}
                    onChange={(e) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        installments: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              )}

              <div className="form__group--sales">
                <label>Status da venda</label>

                <select
                  value={paymentData.statusSale}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      statusSale: e.target.value,
                    }))
                  }
                >
                  <option value="OPEN">Aberta</option>
                  <option value="FINISHED">Finalizada</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
              </div>

              {!loading && (
                <button type="submit" className="sales__btn">
                  Atualizar Pagamento
                </button>
              )}

              {loading && (
                <button type="submit" className="sales__btn" disabled>
                  Aguarde...
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {detailsSale && (
        <div className="sales__modalOverlay">
          <div className="sales__modal sales__detailsModal">
            <div className="sales__modalHeader">
              <h3>Dados da Venda</h3>

              <button
                className="sales__closeBtn"
                onClick={() => setDetailsSale(null)}
              >
                <IoClose />
              </button>
            </div>

            <div className="sales__details">
              <p>
                <strong>ID Mongo:</strong> {detailsSale._id}
              </p>

              <p>
                <strong>Número da venda:</strong>{" "}
                {detailsSale.saleNumber || "-"}
              </p>

              <p>
                <strong>Cliente:</strong> {getClientName(detailsSale)}
              </p>

              <p>
                <strong>CPF/CNPJ na nota:</strong>{" "}
                {detailsSale.customerDocument || "-"}
              </p>

              <p>
                <strong>Vendedor:</strong> {getSellerName(detailsSale)}
              </p>

              <p>
                <strong>Status da venda:</strong>{" "}
                {translateSaleStatus(detailsSale.status)}
              </p>

              <p>
                <strong>Pagamento:</strong>{" "}
                {translatePaymentMethod(detailsSale.payment?.method)} /{" "}
                {translatePaymentStatus(detailsSale.payment?.status)} /{" "}
                {detailsSale.payment?.installments}x
              </p>

              <p>
                <strong>Subtotal:</strong>{" "}
                {formatCurrency(detailsSale.subtotal)}
              </p>

              <p>
                <strong>Desconto:</strong>{" "}
                {formatCurrency(detailsSale.discount)}
              </p>

              <p>
                <strong>Frete:</strong> {formatCurrency(detailsSale.shipping)}
              </p>

              <p>
                <strong>Total:</strong> {formatCurrency(detailsSale.total)}
              </p>

              <p>
                <strong>Observações:</strong> {detailsSale.notes || "-"}
              </p>

              <p>
                <strong>Criado em:</strong>{" "}
                {detailsSale.createdAt
                  ? new Date(detailsSale.createdAt).toLocaleString("pt-BR")
                  : "-"}
              </p>

              <p>
                <strong>Atualizado em:</strong>{" "}
                {detailsSale.updatedAt
                  ? new Date(detailsSale.updatedAt).toLocaleString("pt-BR")
                  : "-"}
              </p>

              <div className="sales__detailsProducts">
                <strong>Produtos:</strong>

                {detailsSale.products?.map((item, index) => (
                  <div key={index} className="sales__detailsProduct">
                    <span>{item.name}</span>
                    <span>Qtd: {item.quantity}</span>
                    <span>Unitário: {formatCurrency(item.unityPrice)}</span>
                    <span>Total: {formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
