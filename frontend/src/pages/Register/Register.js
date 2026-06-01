//CSS
import "./Register.css";

//Components
import Message from "../../components/Message/Message";

//Hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRegisterForm } from "../../hooks/useRegisterForm";

//Redux
import { reset } from "../../slices/authSlice";
import { createUser } from "../../slices/userSlice";
import { resetMessage } from "../../slices/userSlice";

//Icons
import { FiUsers } from "react-icons/fi";

const Register = () => {
  const dispatch = useDispatch();

  // Register form state and validations
  const { formData, errors, hasErrors, handleChange, validateForm, resetForm } =
    useRegisterForm();

  // Redux state
  const { loading, error, success, message } = useSelector(
    (state) => state.user,
  );

  // Authenticated user
  const { user: loggedUser } = useSelector((state) => state.auth);

  //Reset auth states on mount
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  //Clear form after succestul registration
  useEffect(() => {
    if (success) {
      resetForm();
    }
  }, [success, resetForm]);

  //Auto clear messages
  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [error, message, dispatch]);

  //Check user permissions
  const canAccess =
    loggedUser?.role === "SUPER_ADMIN" || loggedUser?.role === "ADMIN";

  if (!canAccess) {
    return <Message msg="Acesso negado." type="error" />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const user = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      companyName: formData.companyName.trim(),
      cnpj: formData.cnpj,
      role: formData.role,
    };

    dispatch(createUser(user));
  };

  return (
    <div id="register">
      <main id="register__main">
        {/* HEADER */}
        <div className="register__header">
          <div className="register__headerTop">
            <span className="register__headerIcon">
              <FiUsers />
            </span>
            <h2>Cadastro de usuários</h2>
          </div>
          <p>
            Crie novos acessos para colaboradores e administradores da empresa.
          </p>
        </div>

        {/* REGISTER FORM */}
        <form onSubmit={handleSubmit} className="form__register">
          {/* USER ROLE */}
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

          {/* USER FULL NAME */}
          <div className="form__group--register">
            <label>Nome completo</label>
            <input
              type="text"
              placeholder="Digite o nome completo"
              value={formData.name}
              onChange={(e) => {
                handleChange("name", e.target.value);
              }}
              className={errors.name ? "input__error" : ""}
            />
            {errors.name && <Message msg={errors.name} type="error" />}
          </div>

          {/* EMAIL */}
          <div className="form__group--register">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="Digite o e-mail"
              value={formData.email}
              onChange={(e) => {
                handleChange("email", e.target.value);
              }}
              className={errors.email ? "input__error" : ""}
            />
            {errors.email && <Message msg={errors.email} type="error" />}
          </div>

          {/* PASSWORD */}
          <div className="form__group--register">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite a senha"
              value={formData.password}
              onChange={(e) => {
                handleChange("password", e.target.value);
              }}
              className={errors.password ? "input__error" : ""}
            />

            {/* PASSWORD STRENGTH */}
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

          {/* CONFIRM PASSWORD */}
          <div className="form__group--register">
            <label>Confirmar senha</label>
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={formData.confirmPassword}
              onChange={(e) => {
                handleChange("confirmPassword", e.target.value);
              }}
              className={errors.confirmPassword ? "input__error" : ""}
            />
            {errors.confirmPassword && (
              <Message msg={errors.confirmPassword} type="error" />
            )}
          </div>

          {/* COMPANY NAME */}
          <div className="form__group--register">
            <label>Nome da empresa</label>
            <input
              type="text"
              placeholder="Digite o nome da empresa"
              value={formData.companyName}
              onChange={(e) => {
                handleChange("companyName", e.target.value);
              }}
              className={errors.companyName ? "input__error" : ""}
            />
            {errors.companyName && (
              <Message msg={errors.companyName} type="error" />
            )}
          </div>

          {/* CNPJ */}
          <div className="form__group--register">
            <label>CNPJ da empresa</label>
            <input
              type="text"
              placeholder="Digite o CNPJ da empresa"
              value={formData.cnpj}
              maxLength={18}
              onChange={(e) => {
                handleChange("cnpj", e.target.value);
              }}
              className={errors.cnpj ? "input__error" : ""}
            />
            {errors.cnpj && <Message msg={errors.cnpj} type="error" />}
          </div>

          {/* SUBMIT BUTTON */}
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

          {/* GLOBAL BACKEND MESSAGES */}
          {error && <Message msg={error} type="error" />}
          {message && <Message msg={message} type="success" />}
        </form>
      </main>
    </div>
  );
};

export default Register;
