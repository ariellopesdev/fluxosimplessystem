const HelpHero = ({ search, setSearch, openSupportModal }) => {
  return (
    <div className="help__hero">
      <div>
        <span className="help__badge">Central de Ajuda</span>
        <h2>Como podemos ajudar?</h2>
        <p>
          Encontre instruções rápidas, acompanhe seus chamados ou fale com o
          suporte.
        </p>

        <button
          type="button"
          className="help__heroSupportBtn"
          onClick={openSupportModal}
        >
          Falar com suporte
        </button>
      </div>

      <div className="help__searchBox">
        <input
          type="text"
          placeholder="Buscar ajuda..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <button type="button" onClick={() => setSearch("")}>
            Limpar
          </button>
        )}
      </div>
    </div>
  );
};

export default HelpHero;