//CSS
import "./EditProfile.css";

//Storage
import { uploads } from "../../utils/config";

//Hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//Redux
import { profile, resetMessage, updateProfile } from "../../slices/userSlice";

//Components
import Message from "../../components/Message/Message";

const EditProfile = () => {
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

    // build form data
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
    <div id="editProfile">
      <h2 className="editProfile__title">Edite seus dados</h2>
      <p className="editProfile__subtitle">Adicione uma imagem de perfil.</p>
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
      <form onSubmit={handleSubmit} className="editProfile__data">
        <input
          type="text"
          placeholder="Nome completo"
          onChange={(e) => setName(e.target.value)}
          value={name || ""}
        />
        <input type="email" placeholder="Email" disabled value={email || ""} />
        <input
          type="text"
          placeholder="Nome da Empresa"
          disabled
          value={companyName || ""}
        />
        <input
          type="text"
          placeholder="CNPJ da Empresa"
          disabled
          value={cnpj || ""}
        />
        <label>
          <span>Imagem do Perfil:</span>
          <input type="file" onChange={handleFile} />
        </label>
        <label>
          <span>Quer alterar sua senha?</span>
          <input
            type="password"
            placeholder="Digite sua nova senha"
            onChange={(e) => setPassword(e.target.value)}
            value={password || ""}
          />
        </label>
        {!loading && (
          <input
            type="submit"
            value="Atualizar"
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
  );
};

export default EditProfile;
