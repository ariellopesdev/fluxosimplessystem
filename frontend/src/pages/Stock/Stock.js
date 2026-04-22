import "./Stock.css";

const Stock = () => {
  return (
    <div className="stock">

      {/* HEADER */}
      <div className="stock__header">
        <h2>Estoque</h2>
        <button className="stock__btn">+ Adicionar Produto</button>
      </div>

      {/* CARDS */}
      <div className="stock__cards">
        <div className="card green">120 Produtos</div>
        <div className="card orange">8 Baixo estoque</div>
        <div className="card blue">Última entrada: Hoje</div>
        <div className="card teal">R$ 12.500 em estoque</div>
      </div>

      {/* TABELA */}
      <div className="stock__table">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Qtd</th>
              <th>Status</th>
              <th>Atualizado</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Arroz 5kg</td>
              <td>Grãos</td>
              <td>10</td>
              <td><span className="status ok">OK</span></td>
              <td>Hoje</td>
              <td>✏️ 🗑</td>
            </tr>

            <tr>
              <td>Leite</td>
              <td>Laticínios</td>
              <td>2</td>
              <td><span className="status low">Baixo</span></td>
              <td>Ontem</td>
              <td>✏️ 🗑</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Stock;