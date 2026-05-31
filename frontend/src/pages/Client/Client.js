import "./Client.css";

//React
import { useEffect, useState } from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";
import {
  createClient,
  deleteClient,
  getAllClients,
  updateClient,
  resetMessage,
} from "../../slices/clientSlice";
import { getAllSales } from "../../slices/salesSlice";

//Icons
import { MdDelete, MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";

//Components
import Message from "../../components/Message/Message";

const Clients = () => {
  const dispatch = useDispatch();

  const { clients, error, message } = useSelector((state) => state.client);
  const { sales } = useSelector((state) => state.sales);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedPhones, setSelectedPhones] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedPurchaseHistory, setSelectedPurchaseHistory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpfCnpj: "",

    primaryPhone: "",
    secondaryPhone: "",
    emergencyPhone: "",

    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "MG",
    zipCode: "",

    type: "PERSON",
    financial: "ACTIVE",
    notes: "",
  });

  const onlyNumbers = (value) => value.replace(/\D/g, "");

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (value.trim().length < 3) {
          error = "O nome deve ter no mínimo 3 caracteres.";
        }
        break;

      case "email":
        if (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!emailRegex.test(value)) {
            error = "Insira um e-mail válido.";
          }
        }
        break;

      case "primaryPhone":
        if (onlyNumbers(value).length < 10) {
          error = "Telefone principal inválido.";
        }
        break;

      case "secondaryPhone":
        if (
          value &&
          onlyNumbers(value).length > 0 &&
          onlyNumbers(value).length < 10
        ) {
          error = "Telefone secundário inválido.";
        }
        break;

      case "emergencyPhone":
        if (
          value &&
          onlyNumbers(value).length > 0 &&
          onlyNumbers(value).length < 10
        ) {
          error = "Telefone de emergência inválido.";
        }
        break;

      case "cpfCnpj":
        error = validateCpfCnpj(value);
        break;

      case "zipCode":
        if (
          value &&
          onlyNumbers(value).length > 0 &&
          onlyNumbers(value).length < 8
        ) {
          error = "CEP incompleto.";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

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
    const numbers = onlyNumbers(value);

    return numbers.length > 11 ? formatCNPJ(numbers) : formatCPF(numbers);
  };

  const formatPhone = (value) => {
    value = onlyNumbers(value).slice(0, 11);

    if (value.length <= 10) {
      value = value.replace(/^(\d{2})(\d)/, "($1) $2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");
      return value;
    }

    value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");

    return value;
  };

  const formatCEP = (value) => {
    value = onlyNumbers(value).slice(0, 8);
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    return value;
  };

  const validateCPF = (cpf) => {
    cpf = onlyNumbers(cpf);

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    let rest;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;

    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;

    return rest === parseInt(cpf.substring(10, 11));
  };

  const validateCNPJ = (cnpj) => {
    cnpj = onlyNumbers(cnpj);

    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += numbers.charAt(size - i) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number(digits.charAt(0))) return false;

    size += 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += numbers.charAt(size - i) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    return result === Number(digits.charAt(1));
  };

  const validateCpfCnpj = (value) => {
    const numbers = onlyNumbers(value);

    if (!numbers) return "";
    if (numbers.length <= 11) {
      if (numbers.length < 11) return "CPF incompleto.";
      return validateCPF(numbers) ? "" : "CPF inválido.";
    }

    if (numbers.length < 14) return "CNPJ incompleto.";
    return validateCNPJ(numbers) ? "" : "CNPJ inválido.";
  };

  const fetchAddressByCEP = async (cep) => {
    const cleanedCEP = onlyNumbers(cep);

    if (cleanedCEP.length !== 8) return;

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanedCEP}/json/`,
      );
      const data = await response.json();

      if (data.erro) {
        setErrors((prev) => ({
          ...prev,
          zipCode: "CEP não encontrado.",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        street: data.logradouro || prev.street,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.localidade || prev.city,
        state: data.uf || prev.state,
      }));

      setErrors((prev) => ({
        ...prev,
        zipCode: "",
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        zipCode: "Erro ao buscar CEP.",
      }));
    }
  };

  const activeClients = clients.filter(
    (client) => client.financial === "ACTIVE",
  ).length;

  const cancelledClients = clients.filter(
    (client) => client.financial === "CANCELLED",
  ).length;

  const companyClients = clients.filter(
    (client) => client.type === "COMPANY",
  ).length;

  const filteredClients = clients.filter((client) => {
    const searchText = search.toLowerCase();

    return (
      client.name?.toLowerCase().includes(searchText) ||
      client.email?.toLowerCase().includes(searchText) ||
      client.cpfCnpj?.toLowerCase().includes(searchText) ||
      client.type?.toLowerCase().includes(searchText) ||
      client.financial?.toLowerCase().includes(searchText) ||
      client.phones?.primary?.toLowerCase().includes(searchText) ||
      client.phones?.secondary?.toLowerCase().includes(searchText) ||
      client.phones?.emergency?.toLowerCase().includes(searchText) ||
      client.address?.street?.toLowerCase().includes(searchText) ||
      client.address?.number?.toLowerCase().includes(searchText) ||
      client.address?.complement?.toLowerCase().includes(searchText) ||
      client.address?.neighborhood?.toLowerCase().includes(searchText) ||
      client.address?.city?.toLowerCase().includes(searchText) ||
      client.address?.state?.toLowerCase().includes(searchText) ||
      client.address?.zipCode?.toLowerCase().includes(searchText)
    );
  });

  useEffect(() => {
    dispatch(getAllClients());
    dispatch(getAllSales());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "cpfCnpj") {
      formattedValue = formatCpfCnpj(value);
    }

    if (
      name === "primaryPhone" ||
      name === "secondaryPhone" ||
      name === "emergencyPhone"
    ) {
      formattedValue = formatPhone(value);
    }

    if (name === "zipCode") {
      formattedValue = formatCEP(value);

      if (onlyNumbers(formattedValue).length === 8) {
        fetchAddressByCEP(formattedValue);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    validateField(name, formattedValue);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      cpfCnpj: "",

      primaryPhone: "",
      secondaryPhone: "",
      emergencyPhone: "",

      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "MG",
      zipCode: "",

      type: "PERSON",
      financial: "ACTIVE",
      notes: "",
    });

    setEditId(null);
  };

  // 🔥 PAYLOAD CORRETO (COM SCHEMA REAL)
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      cpfCnpj: formData.cpfCnpj,

      primaryPhone: formData.primaryPhone,
      secondaryPhone: formData.secondaryPhone,
      emergencyPhone: formData.emergencyPhone,

      street: formData.street,
      number: formData.number,
      complement: formData.complement,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,

      type: formData.type,
      financial: formData.financial,
      notes: formData.notes,
    };

    if (editId) {
      dispatch(updateClient({ ...payload, id: editId }));
    } else {
      dispatch(createClient(payload));
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (client) => {
    setEditId(client._id);

    setFormData({
      name: client.name || "",
      email: client.email || "",
      cpfCnpj: client.cpfCnpj || "",

      primaryPhone: client.phones?.primary || "",
      secondaryPhone: client.phones?.secondary || "",
      emergencyPhone: client.phones?.emergency || "",

      street: client.address?.street || "",
      number: client.address?.number || "",
      complement: client.address?.complement || "",
      neighborhood: client.address?.neighborhood || "",
      city: client.address?.city || "",
      state: client.address?.state || "",
      zipCode: client.address?.zipCode || "",

      type: client.type || "PERSON",
      financial: client.financial || "ACTIVE",
      notes: client.notes || "",
    });

    setShowModal(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteClient(id));
  };

  const getClientSales = (client) => {
    return sales?.filter((sale) => {
      const saleClientId =
        typeof sale.client === "object" ? sale.client?._id : sale.client;

      return saleClientId === client._id;
    });
  };

  return (
    <div className="clients">
      {/* HEADER */}
      <div className="clients__header">
        <h2>Clientes</h2>

        <button
          className="clients__btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Novo Cliente
        </button>
      </div>
      <div className="clients__cards">
        <div className="clientCard green">{clients.length} Clientes</div>
        <div className="clientCard blue">{activeClients} Ativos</div>
        <div className="clientCard orange">{companyClients} Empresas</div>
        <div className="clientCard red">{cancelledClients} Cancelados</div>
      </div>
      <div className="clients__filters">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="clients__table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefones</th>
              <th>CPF/CNPJ</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Endereço</th>
              <th>Histórico</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {clients &&
              filteredClients.map((client) => (
                <tr key={client._id}>
                  <td>{client.name}</td>
                  <td>{client.email || "-"}</td>
                  <td>
                    <button
                      className="addressBtn"
                      onClick={() => setSelectedPhones(client.phones)}
                    >
                      Ver telefones
                    </button>
                  </td>
                  <td>
                    {client.cpfCnpj ? formatCpfCnpj(client.cpfCnpj) : "-"}
                  </td>
                  <td>
                    {client.type === "PERSON" ? "Pessoa Física" : "Empresa"}
                  </td>

                  <td>
                    <span
                      className={`status ${
                        client.financial === "ACTIVE" ? "active" : "inactive"
                      }`}
                    >
                      {client.financial === "ACTIVE" ? "Ativo" : "Cancelado"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="addressBtn"
                      onClick={() => setSelectedAddress(client.address)}
                    >
                      Ver endereço
                    </button>
                  </td>
                  <td>
                    <button
                      className="addressBtn"
                      onClick={() => setSelectedPurchaseHistory(client)}
                    >
                      Ver histórico
                    </button>
                  </td>
                  <td>
                    <div className="table__edit--close">
                      <MdEdit
                        className="client__actionIcon edit"
                        onClick={() => handleEdit(client)}
                      />

                      <MdDelete
                        className="client__actionIcon delete"
                        onClick={() => handleDelete(client._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CLIENTE */}
      {showModal && (
        <div className="clients__modalOverlay">
          <div className="clients__modal">
            <div className="clients__modalHeader">
              <h3>{editId ? "Editar Cliente" : "Novo Cliente"}</h3>

              <button
                className="clients__closeBtn"
                onClick={() => setShowModal(false)}
              >
                <IoClose />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="form__client">
              {/* IDENTIFICAÇÃO */}
              <div className="form__section">
                <h4>Dados do Cliente</h4>

                <div className="form__group--client">
                  <label>Nome</label>
                  <input
                    name="name"
                    placeholder="Digite o nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "input__error" : ""}
                    required
                  />
                  {errors.name && (
                    <span className="field__error">{errors.name}</span>
                  )}
                </div>

                <div className="form__group--client">
                  <label>Email</label>
                  <input
                    name="email"
                    placeholder="Digite o e-mail do cliente"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "input__error" : ""}
                  />
                  {errors.email && (
                    <span className="field__error">{errors.email}</span>
                  )}
                </div>

                <div className="form__group--client">
                  <label>CPF / CNPJ</label>
                  <input
                    name="cpfCnpj"
                    placeholder="Digite CPF ou CNPJ"
                    value={formData.cpfCnpj}
                    onChange={handleChange}
                    className={errors.cpfCnpj ? "input__error" : ""}
                  />
                  {errors.cpfCnpj && (
                    <span className="field__error">{errors.cpfCnpj}</span>
                  )}
                </div>
              </div>

              {/* TELEFONES */}
              <div className="form__section">
                <h4>Telefones</h4>

                <div className="form__group--client">
                  <label>Telefone Principal</label>
                  <input
                    name="primaryPhone"
                    placeholder="(00) 00000-0000"
                    value={formData.primaryPhone}
                    onChange={handleChange}
                    className={errors.primaryPhone ? "input__error" : ""}
                  />
                  {errors.primaryPhone && (
                    <span className="field__error">{errors.primaryPhone}</span>
                  )}
                </div>

                <div className="form__group--client">
                  <label>Telefone Secundário</label>
                  <input
                    name="secondaryPhone"
                    placeholder="(00) 00000-0000"
                    value={formData.secondaryPhone}
                    onChange={handleChange}
                    className={errors.secondaryPhone ? "input__error" : ""}
                  />
                  {errors.secondaryPhone && (
                    <span className="field__error">
                      {errors.secondaryPhone}
                    </span>
                  )}
                </div>

                <div className="form__group--client">
                  <label>Telefone de Emergência</label>
                  <input
                    name="emergencyPhone"
                    placeholder="(00) 00000-0000"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    className={errors.emergencyPhone ? "input__error" : ""}
                  />
                  {errors.emergencyPhone && (
                    <span className="field__error">
                      {errors.emergencyPhone}
                    </span>
                  )}
                </div>
              </div>

              <div className="form__section">
                <h4>Endereço</h4>

                <div className="form__section-grid">
                  <div className="form__group--client form__full">
                    <label>Rua</label>
                    <input
                      name="street"
                      placeholder="Digite o nome da rua"
                      value={formData.street}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form__group--client">
                    <label>Número</label>
                    <input
                      name="number"
                      placeholder="Número"
                      value={formData.number}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form__group--client">
                    <label>Complemento</label>
                    <input
                      name="complement"
                      placeholder="Complemento"
                      value={formData.complement}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form__group--client">
                    <label>Bairro</label>
                    <input
                      name="neighborhood"
                      placeholder="Digite o bairro"
                      value={formData.neighborhood}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form__group--client">
                    <label>Cidade</label>
                    <input
                      name="city"
                      placeholder="Digite a cidade"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form__group--client">
                    <label>Estado</label>

                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    >
                      <option value="AC">AC</option>
                      <option value="AL">AL</option>
                      <option value="AP">AP</option>
                      <option value="AM">AM</option>
                      <option value="BA">BA</option>
                      <option value="CE">CE</option>
                      <option value="DF">DF</option>
                      <option value="ES">ES</option>
                      <option value="GO">GO</option>
                      <option value="MA">MA</option>
                      <option value="MT">MT</option>
                      <option value="MS">MS</option>
                      <option value="MG">MG</option>
                      <option value="PA">PA</option>
                      <option value="PB">PB</option>
                      <option value="PR">PR</option>
                      <option value="PE">PE</option>
                      <option value="PI">PI</option>
                      <option value="RJ">RJ</option>
                      <option value="RN">RN</option>
                      <option value="RS">RS</option>
                      <option value="RO">RO</option>
                      <option value="RR">RR</option>
                      <option value="SC">SC</option>
                      <option value="SP">SP</option>
                      <option value="SE">SE</option>
                      <option value="TO">TO</option>
                    </select>
                  </div>

                  <div className="form__group--client">
                    <label>CEP</label>
                    <input
                      name="zipCode"
                      placeholder="00000-000"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={errors.zipCode ? "input__error" : ""}
                    />
                    {errors.zipCode && (
                      <span className="field__error">{errors.zipCode}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* TIPOS */}
              <div className="form__group--client">
                <label>Tipo de Cliente</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="PERSON">Pessoa Física</option>
                  <option value="COMPANY">Empresa</option>
                </select>
              </div>

              <div className="form__group--client">
                <label>Status Financeiro</label>
                <select
                  name="financial"
                  value={formData.financial}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">Ativo</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>

              {/* OBSERVAÇÕES */}
              <div className="form__group--client">
                <label>Observações</label>
                <textarea
                  name="notes"
                  placeholder="Adicione observações importantes sobre o cliente"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="clients__btn">
                {editId ? "Atualizar Cliente" : "Cadastrar Cliente"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ENDEREÇO */}
      {selectedAddress && (
        <div className="clients__modalOverlay">
          <div className="clients__modal clientViewModal">
            <div className="clients__modalHeader">
              <h3>Endereço do Cliente</h3>

              <button
                className="clients__closeBtn"
                onClick={() => setSelectedAddress(null)}
              >
                <IoClose />
              </button>
            </div>

            <div className="form__section clientViewSection">
              <div className="form__section-grid clientViewGrid">
                <div className="form__group--client form__full">
                  <label>Rua</label>
                  <input value={selectedAddress.street || "-"} disabled />
                </div>

                <div className="form__group--client">
                  <label>Número</label>
                  <input value={selectedAddress.number || "-"} disabled />
                </div>

                <div className="form__group--client">
                  <label>Complemento</label>
                  <input value={selectedAddress.complement || "-"} disabled />
                </div>

                <div className="form__group--client">
                  <label>Bairro</label>
                  <input value={selectedAddress.neighborhood || "-"} disabled />
                </div>

                <div className="form__group--client">
                  <label>Cidade</label>
                  <input value={selectedAddress.city || "-"} disabled />
                </div>

                <div className="form__group--client">
                  <label>Estado</label>
                  <input value={selectedAddress.state || "-"} disabled />
                </div>

                <div className="form__group--client">
                  <label>CEP</label>
                  <input
                    value={
                      selectedAddress.zipCode
                        ? formatCEP(selectedAddress.zipCode)
                        : "-"
                    }
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TELEFONES */}
      {selectedPhones && (
        <div className="clients__modalOverlay">
          <div className="clients__modal clientViewModal">
            <div className="clients__modalHeader">
              <h3>Telefones do Cliente</h3>

              <button
                className="clients__closeBtn"
                onClick={() => setSelectedPhones(null)}
              >
                <IoClose />
              </button>
            </div>

            <div className="form__section clientViewSection">
              <div className="clientViewColumn">
                <div className="form__group--client">
                  <label>Telefone Principal</label>
                  <input
                    value={
                      selectedPhones.primary
                        ? formatPhone(selectedPhones.primary)
                        : "-"
                    }
                    disabled
                  />
                </div>

                <div className="form__group--client">
                  <label>Telefone Secundário</label>
                  <input
                    value={
                      selectedPhones.secondary
                        ? formatPhone(selectedPhones.secondary)
                        : "-"
                    }
                    disabled
                  />
                </div>

                <div className="form__group--client">
                  <label>Telefone de Emergência</label>
                  <input
                    value={
                      selectedPhones.emergency
                        ? formatPhone(selectedPhones.emergency)
                        : "-"
                    }
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedPurchaseHistory && (
        <div className="clients__modalOverlay">
          <div className="clients__modal purchaseHistoryModal">
            <div className="clients__modalHeader">
              <h3>Histórico de Compras</h3>

              <button
                className="clients__closeBtn"
                onClick={() => setSelectedPurchaseHistory(null)}
              >
                <IoClose />
              </button>
            </div>

            <div className="purchase__summary">
              <div>
                <strong>Cliente</strong>
                <p>{selectedPurchaseHistory.name}</p>
              </div>

              <div>
                <strong>Total de compras</strong>
                <p>{getClientSales(selectedPurchaseHistory)?.length || 0}</p>
              </div>

              <div>
                <strong>Itens comprados</strong>
                <p>
                  {getClientSales(selectedPurchaseHistory)?.reduce(
                    (acc, sale) => {
                      const totalItems = sale.products?.reduce(
                        (sum, item) => sum + Number(item.quantity || 0),
                        0,
                      );

                      return acc + Number(totalItems || 0);
                    },
                    0,
                  )}
                </p>
              </div>

              <div>
                <strong>Valor gasto</strong>
                <p>
                  R${" "}
                  {getClientSales(selectedPurchaseHistory)
                    ?.reduce((acc, sale) => acc + Number(sale.total || 0), 0)
                    .toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </p>
              </div>
            </div>

            <div className="purchase__history">
              {getClientSales(selectedPurchaseHistory)?.length > 0 ? (
                getClientSales(selectedPurchaseHistory).map((sale) => (
                  <div className="purchase__couponWrapper" key={sale._id}>
                    <div className="purchase__coupon">
                      <div className="purchase__couponHeader">
                        <div>
                          <strong>{sale.saleNumber}</strong>
                          <span>
                            {sale.createdAt
                              ? new Date(sale.createdAt).toLocaleString("pt-BR")
                              : "-"}
                          </span>
                        </div>

                        <span
                          className={`status ${
                            sale.payment?.status === "PAID"
                              ? "active"
                              : "pending"
                          }`}
                        >
                          {sale.payment?.status === "PAID"
                            ? "Pago"
                            : sale.payment?.status === "PENDING"
                              ? "Pendente"
                              : sale.payment?.status === "CANCELLED"
                                ? "Cancelado"
                                : "Reembolsado"}
                        </span>
                      </div>

                      <div className="purchase__productsTable">
                        <div className="purchase__productsHeader">
                          <span>Produto</span>
                          <span>Qtd</span>
                          <span>Unitário</span>
                          <span>Total</span>
                        </div>

                        {sale.products?.map((item, index) => (
                          <div key={index} className="purchase__productsRow">
                            <span>{item.name}</span>
                            <span>{item.quantity}</span>
                            <span>
                              R${" "}
                              {Number(item.unityPrice || 0).toLocaleString(
                                "pt-BR",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </span>
                            <span>
                              R${" "}
                              {Number(item.totalPrice || 0).toLocaleString(
                                "pt-BR",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="purchase__couponFooter">
                        <div>
                          <strong>Pagamento</strong>
                          <p>
                            {sale.payment?.method === "CASH"
                              ? "Dinheiro"
                              : sale.payment?.method === "PIX"
                                ? "Pix"
                                : sale.payment?.method === "CREDIT_CARD"
                                  ? "Cartão de crédito"
                                  : sale.payment?.method === "DEBIT_CARD"
                                    ? "Cartão de débito"
                                    : sale.payment?.method === "BANK_SLIP"
                                      ? "Boleto"
                                      : "Transferência"}{" "}
                            /{" "}
                            {sale.payment?.installments
                              ? `${sale.payment.installments}x`
                              : "1x"}
                          </p>
                        </div>

                        <div>
                          <strong>Total</strong>
                          <p>
                            R${" "}
                            {Number(sale.total || 0).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="purchase__empty">
                  Nenhuma compra encontrada para este cliente.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
