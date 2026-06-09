//CSS
import "./Register.css";

// React
import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

// Components
import Message from "../../components/Message/Message";

// Hooks
import { useSelector, useDispatch } from "react-redux";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { useModal } from "../../hooks/useModal";
import { useSearch } from "../../hooks/useSearch";

// Redux
import { reset } from "../../slices/authSlice";
import {
  createUser,
  deleteUser,
  getUsers,
  resetMessage,
  updateUser,
} from "../../slices/userSlice";

// Icons
import { FiUsers } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";

const Register = () => {
  const dispatch = useDispatch();

  const {
    formData,
    errors,
    hasErrors,
    handleChange,
    validateForm,
    resetForm,
    setFormData,
  } = useRegisterForm();

  const { users, loading, error, success, message } = useSelector(
    (state) => state.user,
  );

  const { user: loggedUser } = useSelector((state) => state.auth);

  const isSuperAdmin = loggedUser?.role === "SUPER_ADMIN";
  const isAdmin = loggedUser?.role === "ADMIN";
  const canAccess = isSuperAdmin || isAdmin;

  // Translate the user's position.
  const translateRole = (role) => {
    const roles = {
      SUPER_ADMIN: "Super Admin",
      ADMIN: "Administrador",
      USER: "Usuário",
    };

    return roles[role] || "-";
  };

  // Formats CNPJ for display in the table
  const formatCnpj = (cnpj) => {
    const cleanCnpj = String(cnpj || "").replace(/\D/g, "");

    if (cleanCnpj.length !== 14) {
      return cnpj || "-";
    }

    return cleanCnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    );
  };

  const {
    isOpen: showAccessModal,
    modalData: selectedAccess,
    openModal: openAccessModal,
    closeModal: closeAccessModal,
  } = useModal();

  const {
    isOpen: showDeleteModal,
    modalData: selectedDeleteUser,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const usersList = useMemo(() => {
    return Array.isArray(users) ? users : [];
  }, [users]);

  const {
    search,
    setSearch,
    filteredItems: filteredUsers,
  } = useSearch(usersList, [
    "name",
    "email",
    "role",
    (user) => user.company?.name || "",
    (user) => user.company?.cnpj || "",
    (user) => translateRole(user.role),
  ]);

  const totalUsers = usersList.length;
  const totalAdmins = usersList.filter((user) => user.role === "ADMIN").length;
  const totalCommonUsers = usersList.filter(
    (user) => user.role === "USER",
  ).length;
  const totalCompanies = new Set(
    usersList.map((user) => user.company?._id).filter(Boolean),
  ).size;

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (isSuperAdmin) {
      dispatch(getUsers());
    }
  }, [dispatch, isSuperAdmin]);

  useEffect(() => {
    if (success) {
      resetForm();
    }
  }, [success, resetForm]);

  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch]);

  const fillFormWithUser = (user) => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      confirmPassword: "",
      companyName: user.company?.name || "",
      cnpj: user.company?.cnpj || "",
      role: user.role || "USER",
    });
  };

  const handleOpenCreateModal = () => {
    resetForm();
    openAccessModal(null);
  };

  const handleOpenEditModal = (user) => {
    fillFormWithUser(user);
    openAccessModal(user);
  };

  const handleCloseAccessModal = () => {
    closeAccessModal();
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // When editing, password is optional
    const isValid = validateForm(Boolean(selectedAccess?._id));

    if (!isValid) {
      return;
    }

    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      companyName: formData.companyName.trim(),
      cnpj: formData.cnpj,
      role: formData.role,
    };

    // Only send password when creating or when editing with a new password
    if (!selectedAccess?._id || formData.password) {
      userData.password = formData.password;
      userData.confirmPassword = formData.confirmPassword;
    }

    if (selectedAccess?._id) {
      await dispatch(
        updateUser({
          id: selectedAccess._id,
          userData,
        }),
      );
    } else {
      await dispatch(createUser(userData));
    }

    if (isSuperAdmin) {
      dispatch(getUsers());
    }

    handleCloseAccessModal();
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteUser?._id) return;

    await dispatch(deleteUser(selectedDeleteUser._id));

    dispatch(getUsers());
    closeDeleteModal();
  };

  if (!canAccess) {
    return <Message msg="Acesso negado." type="error" />;
  }

  if (isAdmin && !isSuperAdmin) {
    return (
      <div id="register">
        <main id="register__main">
          <div className="register__header">
            <div className="register__headerTop">
              <span className="register__headerIcon">
                <FiUsers />
              </span>
              <h2>Cadastro de usuários</h2>
            </div>

            <p>
              Crie novos acessos para colaboradores e administradores da
              empresa.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form__register">
            <RegisterFormFields
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />

            {!loading && (
              <input
                type="submit"
                value="Cadastrar usuário"
                className="register__btn--primary"
                disabled={hasErrors}
              />
            )}

            {loading && (
              <input
                type="submit"
                value="Aguarde..."
                className="register__btn--primary"
                disabled
              />
            )}

            {error && <Message msg={error} type="error" />}
            {message && <Message msg={message} type="success" />}
          </form>
        </main>
      </div>
    );
  }

  return (
    <div id="register" className="registerAccess">
      <div className="registerAccess__header">
        <h2>
          <FiUsers />
          Acessos
        </h2>

        <button
          type="button"
          className="registerAccess__btn"
          onClick={handleOpenCreateModal}
        >
          + Novo Acesso
        </button>
      </div>

      {error && <Message msg={error} type="error" />}
      {message && <Message msg={message} type="success" />}

      <div className="registerAccess__cards">
        <div className="registerAccessCard green">{totalUsers} Acessos</div>
        <div className="registerAccessCard blue">{totalAdmins} Admins</div>
        <div className="registerAccessCard orange">
          {totalCommonUsers} Usuários
        </div>
        <div className="registerAccessCard red">{totalCompanies} Empresas</div>
      </div>

      <div className="registerAccess__filters">
        <input
          type="text"
          placeholder="Buscar acesso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="registerAccess__table">
        <table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Tipo</th>
              <th>Empresa</th>
              <th>CNPJ</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <strong>{user.name}</strong>
                  <span>{user._id?.slice(-4).padStart(4, "0")}</span>
                </td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={`status ${
                      user.role === "ADMIN" || user.role === "SUPER_ADMIN"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {translateRole(user.role)}
                  </span>
                </td>

                <td>{user.company?.name || "-"}</td>
                <td>{formatCnpj(user.company?.cnpj)}</td>

                <td>
                  {user._id === loggedUser?._id ? (
                    <span className="status active">Meu perfil</span>
                  ) : (
                    <div className="table__edit--close">
                      <span
                        className="registerAccess__actionIcon edit"
                        onClick={() => handleOpenEditModal(user)}
                      >
                        <FaEdit />
                      </span>
                      <span
                        className="registerAccess__actionIcon delete"
                        onClick={() => openDeleteModal(user)}
                      >
                        <FaTrash />
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filteredUsers.length === 0 && (
          <p className="registerAccess__empty">Nenhum acesso encontrado.</p>
        )}

        {loading && (
          <p className="registerAccess__empty">Carregando acessos...</p>
        )}
      </div>

      {showAccessModal &&
        createPortal(
          <div className="registerAccess__modalOverlay">
            <div className="registerAccess__modal">
              <div className="registerAccess__modalHeader">
                <h3>{selectedAccess ? "Editar Acesso" : "Novo Acesso"}</h3>

                <button
                  type="button"
                  className="registerAccess__closeBtn"
                  onClick={handleCloseAccessModal}
                >
                  <IoClose />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="registerAccess__form">
                <div className="registerAccess__section">
                  <h4>Dados do acesso</h4>

                  <div className="registerAccess__grid">
                    <RegisterFormFields
                      formData={formData}
                      errors={errors}
                      handleChange={handleChange}
                    />
                  </div>
                </div>

                {!loading && (
                  <button type="submit" className="registerAccess__btn">
                    {selectedAccess ? "Salvar alterações" : "Cadastrar Acesso"}
                  </button>
                )}

                {loading && (
                  <button
                    type="submit"
                    className="registerAccess__btn"
                    disabled
                  >
                    Aguarde...
                  </button>
                )}
              </form>
            </div>
          </div>,
          document.body,
        )}

      {showDeleteModal &&
        selectedDeleteUser &&
        createPortal(
          <div className="registerAccess__modalOverlay">
            <div className="registerAccess__deleteModal">
              <div className="registerAccess__modalHeader">
                <h3>Excluir Acesso</h3>

                <button
                  type="button"
                  className="registerAccess__closeBtn"
                  onClick={closeDeleteModal}
                >
                  <IoClose />
                </button>
              </div>

              <div className="registerAccess__deleteContent">
                <p>Deseja realmente excluir o acesso:</p>
                <strong>{selectedDeleteUser.name}</strong>
                <span>Esta ação não poderá ser desfeita.</span>
              </div>

              <div className="registerAccess__deleteActions">
                <button
                  type="button"
                  className="registerAccess__btn registerAccess__btnSecondary"
                  onClick={closeDeleteModal}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="registerAccess__btn registerAccess__btnDanger"
                  onClick={handleConfirmDelete}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

const RegisterFormFields = ({ formData, errors, handleChange }) => {
  return (
    <>
      <div className="form__group--register">
        <label>Tipo de usuário</label>
        <select
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
        >
          <option value="USER">Usuário</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      <div className="form__group--register">
        <label>Nome completo</label>
        <input
          type="text"
          placeholder="Digite o nome completo"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={errors.name ? "input__error" : ""}
        />
        {errors.name && <Message msg={errors.name} type="error" />}
      </div>

      <div className="form__group--register">
        <label>E-mail</label>
        <input
          type="email"
          placeholder="Digite o e-mail"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={errors.email ? "input__error" : ""}
        />
        {errors.email && <Message msg={errors.email} type="error" />}
      </div>

      <div className="form__group--register">
        <label>Senha</label>
        <input
          type="password"
          placeholder="Digite a senha"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className={errors.password ? "input__error" : ""}
        />

        <div className="password__strength">
          <div
            className="password__strength--bar"
            style={{
              width:
                formData.password.length >= 10
                  ? "100%"
                  : formData.password.length >= 6
                    ? "70%"
                    : formData.password.length > 0
                      ? "40%"
                      : "0%",
              backgroundColor:
                formData.password.length >= 10
                  ? "#10b981"
                  : formData.password.length >= 6
                    ? "#f59e0b"
                    : "#ef4444",
            }}
          />
        </div>

        {errors.password && <Message msg={errors.password} type="error" />}
      </div>

      <div className="form__group--register">
        <label>Confirmar senha</label>
        <input
          type="password"
          placeholder="Confirme sua senha"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          className={errors.confirmPassword ? "input__error" : ""}
        />
        {errors.confirmPassword && (
          <Message msg={errors.confirmPassword} type="error" />
        )}
      </div>

      <div className="form__group--register">
        <label>Nome da empresa</label>
        <input
          type="text"
          placeholder="Digite o nome da empresa"
          value={formData.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
          className={errors.companyName ? "input__error" : ""}
        />
        {errors.companyName && (
          <Message msg={errors.companyName} type="error" />
        )}
      </div>

      <div className="form__group--register">
        <label>CNPJ da empresa</label>
        <input
          type="text"
          placeholder="Digite o CNPJ da empresa"
          value={formData.cnpj}
          maxLength={18}
          onChange={(e) => handleChange("cnpj", e.target.value)}
          className={errors.cnpj ? "input__error" : ""}
        />
        {errors.cnpj && <Message msg={errors.cnpj} type="error" />}
      </div>
    </>
  );
};

export default Register;
