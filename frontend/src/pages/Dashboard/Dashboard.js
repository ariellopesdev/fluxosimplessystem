import "./Dashboard.css";

// React
import { useEffect, useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { getDashboard, resetMessage } from "../../slices/dashboardSlice";

// Components
import Message from "../../components/Message/Message";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    dashboard,
    summary,
    charts,
    alerts,
    recentActivities,
    loading,
    error,
    message,
  } = useSelector((state) => state.dashboard);

  const [filters, setFilters] = useState({
    period: "CURRENT_MONTH",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(getDashboard(filters));
  }, [dispatch]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const translatePeriod = (period) => {
    const periods = {
      TODAY: "Hoje",
      LAST_7_DAYS: "Últimos 7 dias",
      LAST_30_DAYS: "Últimos 30 dias",
      CURRENT_MONTH: "Este mês",
      CUSTOM: "Personalizado",
    };

    return periods[period] || "-";
  };

  const translateModule = (module) => {
    const modules = {
      FINANCIAL: "Financeiro",
      SALES: "Vendas",
      PRODUCTS: "Produtos",
      CLIENTS: "Clientes",
      APPOINTMENTS: "Agendamentos",
      SERVICES: "Serviços",
      REPORTS: "Relatórios",
      GENERAL: "Geral",
    };

    return modules[module] || module || "-";
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoadDashboard = () => {
    dispatch(getDashboard(filters));
  };

  const dashboardSummary = summary || {};
  const dashboardCharts = charts || {};
  const dashboardAlerts = Array.isArray(alerts) ? alerts : [];
  const activities = Array.isArray(recentActivities) ? recentActivities : [];

  const financialEvolution = dashboardCharts.financialEvolution || [];
  const salesEvolution = dashboardCharts.salesEvolution || [];
  const appointmentStatus = dashboardCharts.appointmentStatus || [];
  const topProducts = dashboardCharts.topProducts || [];
  const topClients = dashboardCharts.topClients || [];

  return (
    <div id="dashboard-page">
      <div className="dashboardPage__container">
        <div className="dashboardPage__header">
          <div>
            <h2>Dashboard</h2>
            <p>
              Acompanhe indicadores, alertas e atividades recentes do sistema.
            </p>
          </div>

          <div className="dashboardPage__filters">
            <select
              name="period"
              value={filters.period}
              onChange={handleFilterChange}
            >
              <option value="TODAY">Hoje</option>
              <option value="LAST_7_DAYS">Últimos 7 dias</option>
              <option value="LAST_30_DAYS">Últimos 30 dias</option>
              <option value="CURRENT_MONTH">Este mês</option>
              <option value="CUSTOM">Personalizado</option>
            </select>

            {filters.period === "CUSTOM" && (
              <>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />

                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </>
            )}

            {!loading && (
              <button type="button" onClick={handleLoadDashboard}>
                Atualizar
              </button>
            )}

            {loading && (
              <button type="button" disabled>
                Aguarde...
              </button>
            )}
          </div>
        </div>

        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}

        {dashboard && (
          <div className="dashboardPage__period">
            <strong>{dashboard.title}</strong>
            <span>
              {translatePeriod(dashboard.period?.label)} •{" "}
              {formatDate(dashboard.period?.startDate)} até{" "}
              {formatDate(dashboard.period?.endDate)}
            </span>
          </div>
        )}

        <div className="dashboardPage__cards">
          <div className="dashboardPage__card green">
            <span>Receita</span>
            <strong>{formatCurrency(dashboardSummary.totalRevenue)}</strong>
          </div>

          <div className="dashboardPage__card orange">
            <span>Despesas</span>
            <strong>{formatCurrency(dashboardSummary.totalExpenses)}</strong>
          </div>

          <div className="dashboardPage__card teal">
            <span>Lucro</span>
            <strong>{formatCurrency(dashboardSummary.totalProfit)}</strong>
          </div>

          <div className="dashboardPage__card blue">
            <span>Vendas</span>
            <strong>{dashboardSummary.totalSales || 0}</strong>
          </div>

          <div className="dashboardPage__card purple">
            <span>Produtos vendidos</span>
            <strong>{dashboardSummary.totalProductsSold || 0}</strong>
          </div>

          <div className="dashboardPage__card indigo">
            <span>Clientes</span>
            <strong>{dashboardSummary.totalClients || 0}</strong>
          </div>

          <div className="dashboardPage__card yellow">
            <span>Agendamentos</span>
            <strong>{dashboardSummary.totalAppointments || 0}</strong>
          </div>

          <div className="dashboardPage__card red">
            <span>Estoque baixo</span>
            <strong>{dashboardSummary.lowStockProducts || 0}</strong>
          </div>
        </div>

        <div className="dashboardPage__charts">
          <div className="dashboardPage__chart">
            <h3>Evolução financeira</h3>

            {financialEvolution.length === 0 ? (
              <p className="dashboardPage__empty">Nenhum dado financeiro.</p>
            ) : (
              <div className="dashboardPage__chartBox">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={financialEvolution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(label) => formatDate(label)}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Receita"
                      stroke="#10b981"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      name="Lucro"
                      stroke="#3b82f6"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      name="Despesas"
                      stroke="#ef4444"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="dashboardPage__chart">
            <h3>Status dos agendamentos</h3>

            {appointmentStatus.length === 0 ? (
              <p className="dashboardPage__empty">Nenhum agendamento.</p>
            ) : (
              <div className="dashboardPage__chartBox">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={appointmentStatus}
                      dataKey="total"
                      nameKey="status"
                      outerRadius={90}
                      label
                    >
                      {appointmentStatus.map((_, index) => (
                        <Cell
                          key={index}
                          fill={
                            [
                              "#10b981", // concluídos
                              "#f59e0b", // pendentes
                              "#3b82f6", // confirmados
                              "#ef4444", // cancelados
                              "#8b5cf6",
                            ][index % 5]
                          }
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="dashboardPage__charts">
          <div className="dashboardPage__chart">
            <h3>Produtos em destaque</h3>

            {topProducts.length === 0 ? (
              <p className="dashboardPage__empty">Nenhum produto vendido.</p>
            ) : (
              <div className="dashboardPage__chartBox">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar
                      dataKey="revenue"
                      name="Receita"
                      fill="#10b981"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="dashboardPage__chart">
            <h3>Clientes em destaque</h3>

            {topClients.length === 0 ? (
              <p className="dashboardPage__empty">Nenhum cliente encontrado.</p>
            ) : (
              <div className="dashboardPage__chartBox">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topClients}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar
                      dataKey="totalSpent"
                      name="Total gasto"
                      fill="#6366f1"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div className="dashboardPage__charts">
          <div className="dashboardPage__chart">
            <h3>Produtos em destaque</h3>

            {topProducts.length === 0 && (
              <p className="dashboardPage__empty">Nenhum produto vendido.</p>
            )}

            {topProducts.map((product) => (
              <div
                key={product.productId || product.name}
                className="dashboardPage__bar"
              >
                <div>
                  <strong>{product.name}</strong>
                  <small>{product.quantitySold || 0} vendidos</small>
                </div>

                <span>{formatCurrency(product.revenue)}</span>
              </div>
            ))}
          </div>

          <div className="dashboardPage__chart">
            <h3>Clientes em destaque</h3>

            {topClients.length === 0 && (
              <p className="dashboardPage__empty">Nenhum cliente encontrado.</p>
            )}

            {topClients.map((client) => (
              <div
                key={client.clientId || client.name}
                className="dashboardPage__bar"
              >
                <div>
                  <strong>{client.name}</strong>
                  <small>
                    {client.totalSales || 0} vendas •{" "}
                    {client.totalAppointments || 0} agendamentos
                  </small>
                </div>

                <span>{formatCurrency(client.totalSpent)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboardPage__section">
          <h3>Resumo de vendas</h3>

          {salesEvolution.length === 0 && (
            <p className="dashboardPage__empty">Nenhuma venda no período.</p>
          )}

          {salesEvolution.map((item) => (
            <div key={item.date} className="dashboardPage__salesLine">
              <span>{formatDate(item.date)}</span>
              <strong>{item.sales} venda(s)</strong>
              <small>{item.productsSold} produto(s)</small>
            </div>
          ))}
        </div>

        <div className="dashboardPage__bottom">
          <div className="dashboardPage__activities">
            <h3>Atividades recentes</h3>

            {activities.length === 0 && (
              <p className="dashboardPage__empty">Nenhuma atividade recente.</p>
            )}

            <ul>
              {activities.map((activity, index) => (
                <li key={`${activity.referenceId}-${index}`}>
                  <div>
                    <strong>{activity.action}</strong>
                    <span>{activity.description}</span>
                  </div>

                  <small>
                    {translateModule(activity.module)} •{" "}
                    {formatDate(activity.date)}
                  </small>
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboardPage__alerts">
            <h3>Alertas</h3>

            {dashboardAlerts.length === 0 && (
              <p className="dashboardPage__empty">Nenhum alerta no momento.</p>
            )}

            {dashboardAlerts.map((alert, index) => (
              <div
                key={`${alert.referenceId}-${index}`}
                className={`dashboardPage__alert ${alert.type?.toLowerCase()}`}
              >
                <strong>{alert.title}</strong>
                <span>{alert.message}</span>
                <small>{translateModule(alert.module)}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
