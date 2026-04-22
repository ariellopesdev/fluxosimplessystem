import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div id="dashboard-page">
      <div className="dashboardPage__container">

        {/* HEADER */}
        <div className="dashboardPage__header">
          <h2>Dashboard</h2>

          <select className="dashboardPage__filter">
            <option>Hoje</option>
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
          </select>
        </div>

        {/* CARDS */}
        <div className="dashboardPage__cards">
          <div className="dashboardPage__card green">
            <h3>Receita</h3>
            <p>R$ 12.500</p>
          </div>

          <div className="dashboardPage__card blue">
            <h3>Produtos</h3>
            <p>120</p>
          </div>

          <div className="dashboardPage__card purple">
            <h3>Vendas</h3>
            <p>320</p>
          </div>

          <div className="dashboardPage__card orange">
            <h3>Despesas</h3>
            <p>R$ 8.000</p>
          </div>
        </div>

        {/* GRÁFICOS */}
        <div className="dashboardPage__charts">

          <div className="dashboardPage__chart">
            <h3>Receita por período</h3>
            <div className="dashboardPage__chartBox">
              📈 gráfico aqui
            </div>
          </div>

          <div className="dashboardPage__chart">
            <h3>Vendas por categoria</h3>
            <div className="dashboardPage__chartBox">
              📊 gráfico aqui
            </div>
          </div>

        </div>

        {/* GRID INFERIOR */}
        <div className="dashboardPage__bottom">

          {/* ATIVIDADES */}
          <div className="dashboardPage__activities">
            <h3>Atividades Recentes</h3>

            <ul>
              <li>Produto "Arroz" cadastrado</li>
              <li>Venda realizada - R$ 120</li>
              <li>Perfil atualizado</li>
            </ul>
          </div>

          {/* ALERTAS */}
          <div className="dashboardPage__alerts">
            <h3>Alertas</h3>

            <div className="dashboardPage__alert warning">
              ⚠ Estoque baixo: Leite
            </div>

            <div className="dashboardPage__alert info">
              ℹ Atualize seus dados
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;