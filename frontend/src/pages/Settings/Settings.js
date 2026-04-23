//CSS
import "./Settings.css";

//Storage
import { uploads } from "../../utils/config";

//Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//Redux
import { profile, resetMessage, updateProfile } from "../../slices/userSlice";

//Components
import Message from "../../components/Message/Message";

const Settings = () => {
  const dispatch = useDispatch();

  const { user, message, error, loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  //Load user data
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  //Fill form with user data
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setCompanyName(user.company?.name);
      setCnpj(user.company?.cnpj);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Gather user data from states
    const userData = { name };

    if (profileImage) {
      userData.profileImage = profileImage;
    }

    if (password) {
      userData.password = password;
    }

    //Build form data
    const formData = new FormData();

    const userFormData = Object.keys(userData).forEach((key) =>
      formData.append(key, userData[key]),
    );

    formData.append("user", userFormData);

    await dispatch(updateProfile(formData));

    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleFile = (e) => {
    //Image preview
    const image = e.target.files[0];

    setPreviewImage(image);

    //Update image state
    setProfileImage(image);
  };

  return (
    <div id="settings-page">
      <div className="settingsPage__container">
        {/* HEADER */}
        <div className="settingsPage__header">
          <h2>Configurações</h2>
          <p>Gerencie seus dados e preferências</p>
        </div>
        {(user.profileImage || previewImage) && (
          <img
            className="editProfile__image"
            src={
              previewImage
                ? URL.createObjectURL(previewImage)
                : `${uploads}/users/${user.profileImage}`
            }
            alt={user.name}
          />
        )}
        <form onSubmit={handleSubmit}>
          {/* GRID */}
          <div className="settingsPage__grid">
            {/* CONTA */}
            <div className="settingsPage__card">
              <h3>Conta</h3>

              <input
                type="text"
                value={name || ""}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
              />

              <input type="email" value={email || ""} disabled />
            </div>

            {/* SEGURANÇA */}
            <div className="settingsPage__card">
              <h3>Segurança</h3>

              <input
                type="password"
                placeholder="Nova senha"
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* EMPRESA */}
            <div className="settingsPage__card">
              <h3>Empresa</h3>

              <input type="text" value={companyName || ""} disabled />
              <input type="text" value={cnpj || ""} disabled />
            </div>

            {/* PREFERÊNCIAS */}
            <div className="settingsPage__card">
              <h3>Preferências</h3>
              <label>
                <span>Imagem do Perfil:</span>
                <input type="file" onChange={handleFile} />
              </label>
              <label>
                <input type="checkbox" />
                Tema escuro
              </label>

              <label>
                <input type="checkbox" />
                Receber notificações
              </label>
            </div>
          </div>

          {!loading && (
            <input
              type="submit"
              value="Salvar alterações"
              className="auth__btn--primary"
            />
          )}
          {loading && (
            <input
              type="submit"
              value="Aguarde..."
              className="auth__btn--primary"
              disabled
            />
          )}
          {error && <Message msg={error} type="error" />}
          {message && <Message msg={message} type="success" />}
        </form>
      </div>
    </div>
  );
};

export default Settings;
