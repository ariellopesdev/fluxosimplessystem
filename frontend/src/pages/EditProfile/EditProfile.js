//CSS
import "./EditProfile.css";

//Storage
import { uploads } from "../../utils/config";

//Hooks
import { useState, useEffectEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//Redux
import { profile, resetMessage } from "../../slices/userSlice";

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
  const [cnjp, setCnpj] = useState("");
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
      setCompanyName(user.companyName);
      setCnpj(user.cnpj);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div id="editProfile">
      <h2 className="editProfile__title">Edite seus dados</h2>
      <p className="editProfile__subtitle">Adicione uma imagem de perfil.</p>
      {/* preview da imagem */}
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
          <input type="file" />
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
        <input type="submit" value="Atualizar dados" />
      </form>
    </div>
  );
};

export default EditProfile;
