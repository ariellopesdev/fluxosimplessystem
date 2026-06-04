const HelpHero = ({ search, setSearch }) => {
  return (
    <div className="help__hero">
      <div>
        <span className="help__badge">Central de Ajuda</span>
        <h2>Como podemos ajudar?</h2>
        <p>
          Encontre instruções rápidas ou abra um chamado de suporte para falar
          com a administração.
        </p>
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