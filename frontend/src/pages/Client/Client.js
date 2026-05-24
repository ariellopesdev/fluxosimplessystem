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

//Icons
import { FaUsers } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";

//Components
import Message from "../../components/Message/Message";

const Clients = () => {
  const dispatch = useDispatch();

  const { clients, loading, error, message } = useSelector(
    (state) => state.client,
  );

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpfCnpj: "",

    primaryPhone: "",
    secondaryPhone: "",
    emergencyPhone: "",

    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",

    type: "PERSON",
    financial: "ACTIVE",
    notes: "",
  });

  useEffect(() => {
    dispatch(getAllClients());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(resetMessage());
      }, 2000);
    }
  }, [message, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",

      type: "PERSON",
      financial: "ACTIVE",
      notes: "",
    });

    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      dispatch(
        updateClient({
          ...formData,
          id: editId,
        }),
      );
    } else {
      dispatch(createClient(formData));
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

  return (
    <div className="clients">

      {/* HEADER */}
      <div className="clients__header">
        <h2>
          <FaUsers /> Clientes
        </h2>

        <button
          className="clients__btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          Novo Cliente
        </button>
      </div>

      {message && <Message msg={message} type={error ? "error" : "success"} />}

      {/* TABLE */}
      <div className="clients__table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Documento</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {clients &&
              clients.map((client) => (
                <tr key={client._id}>
                  <td>{client.name}</td>
                  <td>{client.email || "-"}</td>
                  <td>{client.phones?.primary}</td>
                  <td>{client.cpfCnpj || "-"}</td>
                  <td>{client.type}</td>

                  <td>
                    <span
                      className={`status ${
                        client.financial === "ACTIVE" ? "active" : "inactive"
                      }`}
                    >
                      {client.financial}
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

      {/* MODAL CADASTRO */}
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

              <div className="form__group--client">
                <label>Nome</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form__group--client">
                <label>Email</label>
                <input name="email" value={formData.email} onChange={handleChange} />
              </div>

              <div className="form__group--client">
                <label>Telefone Principal</label>
                <input name="primaryPhone" value={formData.primaryPhone} onChange={handleChange} required />
              </div>

              <div className="form__group--client">
                <label>CPF/CNPJ</label>
                <input name="cpfCnpj" value={formData.cpfCnpj} onChange={handleChange} />
              </div>

              <div className="form__section">
                <h4>Endereço</h4>

                <input name="street" placeholder="Rua" value={formData.street} onChange={handleChange} />
                <input name="number" placeholder="Número" value={formData.number} onChange={handleChange} />
                <input name="neighborhood" placeholder="Bairro" value={formData.neighborhood} onChange={handleChange} />
                <input name="city" placeholder="Cidade" value={formData.city} onChange={handleChange} />
                <input name="state" placeholder="Estado" value={formData.state} onChange={handleChange} />
                <input name="zipCode" placeholder="CEP" value={formData.zipCode} onChange={handleChange} />
              </div>

              <div className="form__group--client">
                <label>Tipo</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="PERSON">Pessoa</option>
                  <option value="COMPANY">Empresa</option>
                </select>
              </div>

              <div className="form__group--client">
                <label>Status</label>
                <select name="financial" value={formData.financial} onChange={handleChange}>
                  <option value="ACTIVE">Ativo</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>

              <div className="form__group--client">
                <label>Observações</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} />
              </div>

              <button type="submit" className="clients__btn">
                {editId ? "Atualizar Cliente" : "Cadastrar Cliente"}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* MODAL ENDEREÇO (SEPARADO - CORRETO) */}
      {selectedAddress && (
        <div className="clients__modalOverlay">
          <div className="clients__modal">

            <div className="clients__modalHeader">
              <h3>Endereço do Cliente</h3>

              <button
                className="clients__closeBtn"
                onClick={() => setSelectedAddress(null)}
              >
                <IoClose />
              </button>
            </div>

            <div className="address__content">
              <p><strong>Rua:</strong> {selectedAddress.street}</p>
              <p><strong>Número:</strong> {selectedAddress.number}</p>
              <p><strong>Bairro:</strong> {selectedAddress.neighborhood}</p>
              <p><strong>Cidade:</strong> {selectedAddress.city}</p>
              <p><strong>Estado:</strong> {selectedAddress.state}</p>
              <p><strong>CEP:</strong> {selectedAddress.zipCode}</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Clients;