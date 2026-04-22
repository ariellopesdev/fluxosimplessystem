import "./Reports.css";

const Reports = () => {
  return (
    <div className="reports">

      {/* HEADER */}
      <div className="reports__header">
        <h2>Relatórios</h2>

        <select className="reports__filter">
          <option>Últimos 7 dias</option>
          <option>Últimos 30 dias</option>
          <option>Este mês</option>
        </select>
      </div>

      {/* CARDS */}
      <div className="reports__cards">
        <div className="card green">R$ 12.500 Receita</div>
        <div className="card blue">320 Vendidos</div>
        <div className="card orange">R$ 8.000 Custos</div>
        <div className="card teal">R$ 4.500 Lucro</div>
      </div>

      {/* GRÁFICOS */}
      <div className="reports__charts">

        <div className="chart">
          <h3>Receita por mês</h3>
          <div className="chart__placeholder">
            📊 gráfico aqui
          </div>
        </div>

        <div className="chart">
          <h3>Produtos mais vendidos</h3>
          <div className="chart__placeholder">
            📊 gráfico aqui
          </div>
        </div>

      </div>

      {/* TABELA */}
      <div className="reports__table">
        <h3>Resumo de Produtos</h3>

        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Qtd Vendida</th>
              <th>Receita</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Arroz</td>
              <td>120</td>
              <td>R$ 3.000</td>
            </tr>
            <tr>
              <td>Leite</td>
              <td>80</td>
              <td>R$ 520</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Reports;
