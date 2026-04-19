import "./EditProfile.css";

const EditProfile = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div id="editProfile">
      <h2 className="editProfile__title">Edite seus dados</h2>
      <p className="editProfile__subtitle">Adicione uma imagem de perfil.</p>
      {/* preview da imagem */}
      <form onSubmit={handleSubmit} className="editProfile__data">
        <input type="text" placeholder="Nome completo" />
        <input type="email" placeholder="Email" disabled />
        <input type="text" placeholder="Nome da Empresa" disabled />
        <input type="text" placeholder="CNPJ da Empresa" disabled />
        <label>
          <span>Imagem do Perfil:</span>
          <input type="file" />
        </label>
        <label>
          <span>Quer alterar sua senha?</span>
          <input type="password" placeholder="Digite sua nova senha" />
        </label>
        <input type="submit" value="Atualizar dados" />
      </form>
    </div>
  );
};

export default EditProfile;
