//CSS
import "./Reports.css";

// React
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  getReports,
  generateReport,
  deleteReport,
  resetMessage,
  resetReport,
} from "../../slices/reportsSlice";

// Components
import Message from "../../components/Message/Message";

//Icons
import { FiBarChart2 } from "react-icons/fi";
import { FaEye, FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

//Hooks
import { useModal } from "../../hooks/useModal";

const Reports = () => {
  const dispatch = useDispatch();

  const { reports, report, loading, error, message } = useSelector(
    (state) => state.reports,
  );

  const [filters, setFilters] = useState({
    type: "GENERAL",
    period: "LAST_30_DAYS",
    startDate: "",
    endDate: "",
  });

  const [selectedReport, setSelectedReport] = useState(null);

  const {
    isOpen: showReportModal,
    openModal: openReportModal,
    closeModal: closeReportModal,
  } = useModal();

  const {
    isOpen: showDeleteModal,
    modalData: selectedDeleteReport,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const reportsList = Array.isArray(reports) ? reports : [];
  const currentReport = selectedReport || report || reportsList[0] || null;

  useEffect(() => {
    dispatch(getReports());
  }, [dispatch]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  useEffect(() => {
    if (report) {
      setSelectedReport(report);
    }
  }, [report]);

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

  const translateType = (type) => {
    const types = {
      FINANCIAL: "Financeiro",
      SALES: "Vendas",
      PRODUCTS: "Produtos",
      CLIENTS: "Clientes",
      APPOINTMENTS: "Agendamentos",
      SERVICES: "Serviços",
      GENERAL: "Geral",
    };

    return types[type] || type || "-";
  };

  const translatePeriod = (period) => {
    const periods = {
      LAST_7_DAYS: "Últimos 7 dias",
      LAST_30_DAYS: "Últimos 30 dias",
      CURRENT_MONTH: "Este mês",
      CUSTOM: "Personalizado",
    };

    return periods[period] || "-";
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateReport = async () => {
    const payload = {
      type: filters.type,
      period: filters.period,
    };

    if (filters.period === "CUSTOM") {
      payload.startDate = filters.startDate;
      payload.endDate = filters.endDate;
    }

    await dispatch(generateReport(payload));
    await dispatch(getReports());
  };

  const handleSelectReport = (item) => {
    setSelectedReport(item);
    openReportModal();
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteReport?._id) return;

    await dispatch(deleteReport(selectedDeleteReport._id));

    if (selectedReport?._id === selectedDeleteReport._id) {
      setSelectedReport(null);
      dispatch(resetReport());
    }

    closeDeleteModal();
  };

  const buildRows = (headers, rows) => {
    if (!rows || rows.length === 0) {
      return `
      <table>
        <tbody>
          <tr>
            <td>Nenhum dado encontrado.</td>
          </tr>
        </tbody>
      </table>
    `;
    }

    return `
    <table>
      <thead>
        <tr>
          ${headers.map((header) => `<th>${header.label}</th>`).join("")}
        </tr>
      </thead>

      <tbody>
        ${rows
          .map(
            (row) => `
              <tr>
                ${headers
                  .map((header) => `<td>${row[header.key] ?? "-"}</td>`)
                  .join("")}
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
  };

  const buildGeneralPdfSections = (reportData) => {
    const summary = reportData?.summary || {};

    return `
    <h2>Resumo Geral</h2>
    ${buildRows(
      [
        { label: "Indicador", key: "label" },
        { label: "Valor", key: "value" },
      ],
      [
        { label: "Receita", value: formatCurrency(summary.totalRevenue) },
        { label: "Despesas", value: formatCurrency(summary.totalExpenses) },
        { label: "Lucro", value: formatCurrency(summary.totalProfit) },
        { label: "Patrimônio", value: formatCurrency(summary.totalAssets) },
        { label: "Vendas", value: summary.totalSales || 0 },
        { label: "Produtos vendidos", value: summary.totalProductsSold || 0 },
        { label: "Total de clientes", value: summary.totalClients || 0 },
        { label: "Clientes novos", value: summary.newClients || 0 },
        {
          label: "Clientes recorrentes",
          value: summary.returningClients || 0,
        },
        {
          label: "Total de agendamentos",
          value: summary.totalAppointments || 0,
        },
        {
          label: "Agendamentos concluídos",
          value: summary.completedAppointments || 0,
        },
        {
          label: "Agendamentos pendentes",
          value: summary.pendingAppointments || 0,
        },
        {
          label: "Agendamentos cancelados",
          value: summary.cancelledAppointments || 0,
        },
        { label: "Serviços cadastrados", value: summary.totalServices || 0 },
      ],
    )}

    <h2>Financeiro</h2>
    ${buildRows(
      [
        { label: "Título", key: "title" },
        { label: "Tipo", key: "type" },
        { label: "Categoria", key: "category" },
        { label: "Valor", key: "amount" },
        { label: "Pagamento", key: "paymentMethod" },
        { label: "Status", key: "paymentStatus" },
        { label: "Data", key: "date" },
      ],
      (reportData.financialData || []).map((item) => ({
        ...item,
        amount: formatCurrency(item.amount),
        date: formatDate(item.date),
      })),
    )}

    <h2>Vendas</h2>
    ${buildRows(
      [
        { label: "Venda", key: "saleNumber" },
        { label: "Cliente", key: "clientName" },
        { label: "Produto", key: "productName" },
        { label: "Qtd", key: "quantity" },
        { label: "Total", key: "total" },
        { label: "Pagamento", key: "paymentMethod" },
        { label: "Status", key: "paymentStatus" },
        { label: "Data", key: "date" },
      ],
      (reportData.salesData || []).map((item) => ({
        ...item,
        total: formatCurrency(item.total),
        date: formatDate(item.date),
      })),
    )}

    <h2>Produtos</h2>
    ${buildRows(
      [
        { label: "Produto", key: "name" },
        { label: "Categoria", key: "category" },
        { label: "Preço", key: "unityPrice" },
        { label: "Qtd vendida", key: "quantitySold" },
        { label: "Receita", key: "revenue" },
        { label: "Estoque", key: "currentStock" },
        { label: "Valor em estoque", key: "stockValue" },
      ],
      (reportData.productsData || []).map((item) => ({
        ...item,
        unityPrice: formatCurrency(item.unityPrice),
        revenue: formatCurrency(item.revenue),
        stockValue: formatCurrency(item.stockValue),
      })),
    )}

    <h2>Clientes</h2>
    ${buildRows(
      [
        { label: "Nome", key: "name" },
        { label: "CPF/CNPJ", key: "cpfCnpj" },
        { label: "Telefone", key: "phone" },
        { label: "E-mail", key: "email" },
        { label: "Compras", key: "totalPurchases" },
        { label: "Total gasto", key: "totalSpent" },
        { label: "Última compra", key: "lastPurchaseDate" },
        { label: "Último agendamento", key: "lastAppointmentDate" },
      ],
      (reportData.clientsData || []).map((item) => ({
        ...item,
        totalSpent: formatCurrency(item.totalSpent),
        lastPurchaseDate: formatDate(item.lastPurchaseDate),
        lastAppointmentDate: formatDate(item.lastAppointmentDate),
      })),
    )}

    <h2>Agendamentos</h2>
    ${buildRows(
      [
        { label: "Serviço", key: "serviceName" },
        { label: "Cliente", key: "clientName" },
        { label: "Status", key: "status" },
        { label: "Prioridade", key: "priority" },
        { label: "Pagamento", key: "paymentMethod" },
        { label: "Status Pgto", key: "paymentStatus" },
        { label: "Total", key: "total" },
        { label: "Data", key: "date" },
        { label: "Início", key: "startTime" },
        { label: "Fim", key: "endTime" },
      ],
      (reportData.appointmentsData || []).map((item) => ({
        ...item,
        total: formatCurrency(item.total),
        date: formatDate(item.date),
      })),
    )}

    <h2>Serviços</h2>
    ${buildRows(
      [
        { label: "Serviço", key: "name" },
        { label: "Categoria", key: "category" },
        { label: "Preço", key: "unityPrice" },
        { label: "Status", key: "status" },
        { label: "Agendamentos", key: "totalAppointments" },
        { label: "Concluídos", key: "completedAppointments" },
        { label: "Receita", key: "revenue" },
      ],
      (reportData.servicesData || []).map((item) => ({
        ...item,
        unityPrice: formatCurrency(item.unityPrice),
        revenue: formatCurrency(item.revenue),
      })),
    )}
  `;
  };

  const buildSpecificPdfSections = (reportData) => {
    if (reportData.type === "FINANCIAL") {
      return `
      <h2>Relatório Financeiro</h2>
      ${buildRows(
        [
          { label: "Título", key: "title" },
          { label: "Descrição", key: "description" },
          { label: "Tipo", key: "type" },
          { label: "Categoria", key: "category" },
          { label: "Valor", key: "amount" },
          { label: "Pagamento", key: "paymentMethod" },
          { label: "Status", key: "paymentStatus" },
          { label: "Parcelas", key: "installments" },
          { label: "Data", key: "date" },
        ],
        (reportData.financialData || []).map((item) => ({
          ...item,
          amount: formatCurrency(item.amount),
          date: formatDate(item.date),
        })),
      )}
    `;
    }

    if (reportData.type === "SALES") {
      return `
      <h2>Relatório de Vendas</h2>
      ${buildRows(
        [
          { label: "Venda", key: "saleNumber" },
          { label: "Cliente", key: "clientName" },
          { label: "Documento", key: "customerDocument" },
          { label: "Produto", key: "productName" },
          { label: "Qtd", key: "quantity" },
          { label: "Preço un.", key: "unityPrice" },
          { label: "Total", key: "total" },
          { label: "Pagamento", key: "paymentMethod" },
          { label: "Status", key: "saleStatus" },
          { label: "Data", key: "date" },
        ],
        (reportData.salesData || []).map((item) => ({
          ...item,
          unityPrice: formatCurrency(item.unityPrice),
          total: formatCurrency(item.total),
          date: formatDate(item.date),
        })),
      )}
    `;
    }

    if (reportData.type === "PRODUCTS") {
      return `
      <h2>Relatório de Produtos</h2>
      ${buildRows(
        [
          { label: "Produto", key: "name" },
          { label: "Categoria", key: "category" },
          { label: "Preço", key: "unityPrice" },
          { label: "Qtd vendida", key: "quantitySold" },
          { label: "Receita", key: "revenue" },
          { label: "Estoque", key: "currentStock" },
          { label: "Valor em estoque", key: "stockValue" },
        ],
        (reportData.productsData || []).map((item) => ({
          ...item,
          unityPrice: formatCurrency(item.unityPrice),
          revenue: formatCurrency(item.revenue),
          stockValue: formatCurrency(item.stockValue),
        })),
      )}
    `;
    }

    if (reportData.type === "CLIENTS") {
      return `
      <h2>Relatório de Clientes</h2>
      ${buildRows(
        [
          { label: "Nome", key: "name" },
          { label: "CPF/CNPJ", key: "cpfCnpj" },
          { label: "Telefone", key: "phone" },
          { label: "E-mail", key: "email" },
          { label: "Tipo", key: "type" },
          { label: "Status financeiro", key: "financial" },
          { label: "Compras", key: "totalPurchases" },
          { label: "Total gasto", key: "totalSpent" },
          { label: "Última compra", key: "lastPurchaseDate" },
          { label: "Último agendamento", key: "lastAppointmentDate" },
        ],
        (reportData.clientsData || []).map((item) => ({
          ...item,
          totalSpent: formatCurrency(item.totalSpent),
          lastPurchaseDate: formatDate(item.lastPurchaseDate),
          lastAppointmentDate: formatDate(item.lastAppointmentDate),
        })),
      )}
    `;
    }

    if (reportData.type === "APPOINTMENTS") {
      return `
      <h2>Relatório de Agendamentos</h2>
      ${buildRows(
        [
          { label: "Serviço", key: "serviceName" },
          { label: "Cliente", key: "clientName" },
          { label: "Documento", key: "clientDocument" },
          { label: "Telefone", key: "clientPhone" },
          { label: "Status", key: "status" },
          { label: "Prioridade", key: "priority" },
          { label: "Pagamento", key: "paymentMethod" },
          { label: "Status Pgto", key: "paymentStatus" },
          { label: "Total", key: "total" },
          { label: "Data", key: "date" },
          { label: "Início", key: "startTime" },
          { label: "Fim", key: "endTime" },
        ],
        (reportData.appointmentsData || []).map((item) => ({
          ...item,
          total: formatCurrency(item.total),
          date: formatDate(item.date),
        })),
      )}
    `;
    }

    if (reportData.type === "SERVICES") {
      return `
      <h2>Relatório de Serviços</h2>
      ${buildRows(
        [
          { label: "Serviço", key: "name" },
          { label: "Descrição", key: "description" },
          { label: "Categoria", key: "category" },
          { label: "Preço", key: "unityPrice" },
          { label: "Status", key: "status" },
          { label: "Agendável", key: "isSchedulable" },
          { label: "Vendável", key: "isSellable" },
          { label: "Agendamentos", key: "totalAppointments" },
          { label: "Concluídos", key: "completedAppointments" },
          { label: "Receita", key: "revenue" },
        ],
        (reportData.servicesData || []).map((item) => ({
          ...item,
          isSchedulable: item.isSchedulable ? "Sim" : "Não",
          isSellable: item.isSellable ? "Sim" : "Não",
          unityPrice: formatCurrency(item.unityPrice),
          revenue: formatCurrency(item.revenue),
        })),
      )}
    `;
    }

    return buildGeneralPdfSections(reportData);
  };

  const buildPdfHtml = (reportData) => {
    const summary = reportData?.summary || {};

    const sections =
      reportData?.type === "GENERAL"
        ? buildGeneralPdfSections(reportData)
        : buildSpecificPdfSections(reportData);

    return `
    <html>
      <head>
        <title>Relatório ${translateType(reportData?.type)}</title>
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            padding: 32px;
            color: #111827;
            background: #fff;
          }

          h1 {
            margin: 0 0 6px;
            color: #047857;
            font-size: 26px;
          }

          h2 {
            margin-top: 28px;
            margin-bottom: 10px;
            border-bottom: 2px solid #047857;
            padding-bottom: 8px;
            color: #111827;
            font-size: 18px;
          }

          .meta {
            color: #6b7280;
            margin-bottom: 24px;
            font-size: 13px;
          }

          .cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 24px;
          }

          .card {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 12px;
            background: #f9fafb;
          }

          .card span {
            display: block;
            color: #6b7280;
            font-size: 11px;
            margin-bottom: 6px;
          }

          .card strong {
            display: block;
            font-size: 15px;
            color: #111827;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            margin-bottom: 20px;
            font-size: 11px;
            page-break-inside: auto;
          }

          th,
          td {
            border: 1px solid #e5e7eb;
            padding: 7px;
            text-align: left;
            vertical-align: top;
          }

          th {
            background: #f3f4f6;
            color: #374151;
            font-weight: 700;
          }

          tr {
            page-break-inside: avoid;
          }

          @media print {
            body {
              padding: 18px;
            }

            h2 {
              page-break-after: avoid;
            }

            table {
              page-break-inside: auto;
            }
          }
        </style>
      </head>

      <body>
        <h1>Relatório ${translateType(reportData?.type)}</h1>

        <p class="meta">
          Tipo: ${translateType(reportData?.type)} |
          Período: ${translatePeriod(reportData?.period?.label)} |
          ${formatDate(reportData?.period?.startDate)} até ${formatDate(
            reportData?.period?.endDate,
          )}
        </p>

        <div class="cards">
          <div class="card">
            <span>Receita</span>
            <strong>${formatCurrency(summary.totalRevenue)}</strong>
          </div>

          <div class="card">
            <span>Despesas</span>
            <strong>${formatCurrency(summary.totalExpenses)}</strong>
          </div>

          <div class="card">
            <span>Lucro</span>
            <strong>${formatCurrency(summary.totalProfit)}</strong>
          </div>

          <div class="card">
            <span>Patrimônio</span>
            <strong>${formatCurrency(summary.totalAssets)}</strong>
          </div>
        </div>

        ${sections}
      </body>
    </html>
  `;
  };

  const handleViewPdf = () => {
    if (!currentReport) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(buildPdfHtml(currentReport));
    printWindow.document.close();
  };

  const handleExportPdf = () => {
    if (!currentReport) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(buildPdfHtml(currentReport));
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const summary = currentReport?.summary || {};

  const topProducts = useMemo(() => {
    return [...(currentReport?.productsData || [])]
      .sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0))
      .slice(0, 5);
  }, [currentReport]);

  const topClients = useMemo(() => {
    return [...(currentReport?.clientsData || [])]
      .sort((a, b) => Number(b.totalSpent || 0) - Number(a.totalSpent || 0))
      .slice(0, 5);
  }, [currentReport]);

  return (
    <div className="reports">
      <div className="reports__header">
        <div>
          <h2>
            <FiBarChart2 />
            Relatórios
          </h2>
          <p>Visualize, gere e exporte relatórios do Fluxo Simples.</p>
        </div>

        <div className="reports__actions">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="GENERAL">Geral</option>
            <option value="FINANCIAL">Financeiro</option>
            <option value="SALES">Vendas</option>
            <option value="PRODUCTS">Produtos</option>
            <option value="CLIENTS">Clientes</option>
            <option value="APPOINTMENTS">Agendamentos</option>
            <option value="SERVICES">Serviços</option>
          </select>

          <select
            name="period"
            value={filters.period}
            onChange={handleFilterChange}
          >
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
            <button className="reports__btn" onClick={handleGenerateReport}>
              Gerar Relatório
            </button>
          )}

          {loading && (
            <button className="reports__btn" disabled>
              Aguarde...
            </button>
          )}
        </div>
      </div>

      {error && <Message msg={error} type="error" />}
      {message && <Message msg={message} type="success" />}

      {!currentReport && !loading && (
        <div className="reports__empty">
          Nenhum relatório encontrado. Gere um novo relatório para visualizar os
          dados.
        </div>
      )}

      {currentReport && (
        <>
          <div className="reports__toolbar">
            <div>
              <strong>Relatório {translateType(currentReport.type)}</strong>
              <span>
                {translateType(currentReport.type)} •{" "}
                {formatDate(currentReport.period?.startDate)} até{" "}
                {formatDate(currentReport.period?.endDate)}
              </span>
            </div>

            <div>
              <button onClick={handleViewPdf}>Visualizar PDF</button>
              <button onClick={handleExportPdf}>Exportar PDF</button>
            </div>
          </div>

          <div className="reports__cards">
            <div className="reports__card green">
              <span>Receita</span>
              <strong>{formatCurrency(summary.totalRevenue)}</strong>
            </div>

            <div className="reports__card orange">
              <span>Despesas</span>
              <strong>{formatCurrency(summary.totalExpenses)}</strong>
            </div>

            <div className="reports__card teal">
              <span>Lucro</span>
              <strong>{formatCurrency(summary.totalProfit)}</strong>
            </div>

            <div className="reports__card blue">
              <span>Vendas</span>
              <strong>{summary.totalSales || 0}</strong>
            </div>

            <div className="reports__card purple">
              <span>Produtos vendidos</span>
              <strong>{summary.totalProductsSold || 0}</strong>
            </div>

            <div className="reports__card indigo">
              <span>Clientes</span>
              <strong>{summary.totalClients || 0}</strong>
            </div>

            <div className="reports__card yellow">
              <span>Agendamentos</span>
              <strong>{summary.totalAppointments || 0}</strong>
            </div>

            <div className="reports__card red">
              <span>Cancelados</span>
              <strong>{summary.cancelledAppointments || 0}</strong>
            </div>
          </div>

          <div className="reports__charts">
            <div className="reports__chart">
              <h3>Produtos em destaque</h3>

              {topProducts.length === 0 && <p>Nenhum produto encontrado.</p>}

              {topProducts.map((product) => (
                <div key={product.productId || product.name} className="bar">
                  <span>{product.name}</span>
                  <div>
                    <strong>{formatCurrency(product.revenue)}</strong>
                    <small>Estoque: {product.currentStock || 0}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="reports__chart">
              <h3>Clientes em destaque</h3>

              {topClients.length === 0 && <p>Nenhum cliente encontrado.</p>}

              {topClients.map((client) => (
                <div key={client.clientId || client.name} className="bar">
                  <span>{client.name}</span>
                  <div>
                    <strong>{formatCurrency(client.totalSpent)}</strong>
                    <small>{client.totalPurchases || 0} compras</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reports__section">
            <h3>Resumo de Agendamentos</h3>

            <div className="reports__miniCards">
              <div>Concluídos: {summary.completedAppointments || 0}</div>
              <div>Pendentes: {summary.pendingAppointments || 0}</div>
              <div>Cancelados: {summary.cancelledAppointments || 0}</div>
            </div>
          </div>

          <div className="reports__table">
            <h3>Clientes</h3>

            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF/CNPJ</th>
                  <th>Telefone</th>
                  <th>Compras</th>
                  <th>Total gasto</th>
                  <th>Agendamentos ativos</th>
                </tr>
              </thead>

              <tbody>
                {(currentReport.clientsData || []).length === 0 && (
                  <tr>
                    <td colSpan="6">Nenhum cliente encontrado.</td>
                  </tr>
                )}

                {(currentReport.clientsData || []).map((client) => (
                  <tr key={client.clientId || client.name}>
                    <td>{client.name || "-"}</td>
                    <td>{client.cpfCnpj || "-"}</td>
                    <td>{client.phone || "-"}</td>
                    <td>{client.totalPurchases || 0}</td>
                    <td>{formatCurrency(client.totalSpent)}</td>
                    <td>{client.activeAppointments || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="reports__table">
            <h3>Produtos</h3>

            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Qtd Vendida</th>
                  <th>Receita</th>
                  <th>Estoque Atual</th>
                </tr>
              </thead>

              <tbody>
                {(currentReport.productsData || []).length === 0 && (
                  <tr>
                    <td colSpan="4">Nenhum produto encontrado.</td>
                  </tr>
                )}

                {(currentReport.productsData || []).map((product) => (
                  <tr key={product.productId || product.name}>
                    <td>{product.name || "-"}</td>
                    <td>{product.quantitySold || 0}</td>
                    <td>{formatCurrency(product.revenue)}</td>
                    <td>{product.currentStock || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="reports__table">
            <h3>Agendamentos</h3>

            <table>
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>Pagamento</th>
                  <th>Total</th>
                  <th>Data</th>
                </tr>
              </thead>

              <tbody>
                {(currentReport.appointmentsData || []).length === 0 && (
                  <tr>
                    <td colSpan="6">Nenhum agendamento encontrado.</td>
                  </tr>
                )}

                {(currentReport.appointmentsData || []).map((appointment) => (
                  <tr key={appointment.appointmentId || appointment.title}>
                    <td>
                      {appointment.serviceName || appointment.title || "-"}
                    </td>
                    <td>{appointment.clientName || "-"}</td>
                    <td>{appointment.status || "-"}</td>
                    <td>{appointment.paymentStatus || "-"}</td>
                    <td>{formatCurrency(appointment.total)}</td>
                    <td>{formatDate(appointment.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="reports__table">
            <h3>Financeiro</h3>

            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Pagamento</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>

              <tbody>
                {(currentReport.financialData || []).length === 0 && (
                  <tr>
                    <td colSpan="7">Nenhuma movimentação encontrada.</td>
                  </tr>
                )}

                {(currentReport.financialData || []).map((item, index) => (
                  <tr key={`${item.title}-${index}`}>
                    <td>{item.title || "-"}</td>
                    <td>{item.type || "-"}</td>
                    <td>{item.category || "-"}</td>
                    <td>{formatCurrency(item.amount)}</td>
                    <td>{item.paymentMethod || "-"}</td>
                    <td>{item.paymentStatus || "-"}</td>
                    <td>{formatDate(item.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="reports__table">
            <h3>Histórico de Relatórios</h3>

            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Período</th>
                  <th>Gerado em</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {reportsList.length === 0 && (
                  <tr>
                    <td colSpan="5">Nenhum relatório gerado.</td>
                  </tr>
                )}

                {reportsList.map((item) => (
                  <tr key={item._id}>
                    <td>Relatório {translateType(item.type)}</td>
                    <td>{translateType(item.type)}</td>
                    <td>{translatePeriod(item.period?.label)}</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td>
                      <div className="reports__tableActions">
                        <button onClick={() => handleSelectReport(item)}>
                          <FaEye />
                          Ver
                        </button>
                        <button
                          type="button"
                          className="delete"
                          onClick={() => openDeleteModal(item)}
                        >
                          <FaTrash />
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showReportModal &&
        selectedReport &&
        createPortal(
          <div className="reports__modalOverlay">
            <div className="reports__modal">
              <div className="reports__modalHeader">
                <h3>{selectedReport.title}</h3>

                <button
                  type="button"
                  className="reports__closeBtn"
                  onClick={closeReportModal}
                >
                  <IoClose />
                </button>
              </div>

              <div className="reports__modalContent">
                <p>
                  <strong>Tipo:</strong> {translateType(selectedReport.type)}
                </p>
                <p>
                  <strong>Período:</strong>{" "}
                  {formatDate(selectedReport.period?.startDate)} até{" "}
                  {formatDate(selectedReport.period?.endDate)}
                </p>
                <p>
                  <strong>Receita:</strong>{" "}
                  {formatCurrency(selectedReport.summary?.totalRevenue)}
                </p>
                <p>
                  <strong>Despesas:</strong>{" "}
                  {formatCurrency(selectedReport.summary?.totalExpenses)}
                </p>
                <p>
                  <strong>Lucro:</strong>{" "}
                  {formatCurrency(selectedReport.summary?.totalProfit)}
                </p>

                <div className="reports__modalActions">
                  <button onClick={handleViewPdf}>Visualizar PDF</button>
                  <button onClick={handleExportPdf}>Exportar PDF</button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
      {showDeleteModal &&
        selectedDeleteReport &&
        createPortal(
          <div className="reports__modalOverlay">
            <div className="reports__deleteModal">
              <div className="reports__modalHeader">
                <h3>Excluir relatório</h3>

                <button
                  type="button"
                  className="reports__closeBtn"
                  onClick={closeDeleteModal}
                >
                  <IoClose />
                </button>
              </div>

              <div className="reports__deleteContent">
                <p>Deseja realmente excluir o relatório:</p>

                <strong>
                  Relatório {translateType(selectedDeleteReport.type)}
                </strong>

                <span>Esta ação não poderá ser desfeita.</span>
              </div>

              <div className="reports__deleteActions">
                <button
                  type="button"
                  className="reports__btn reports__btnSecondary"
                  onClick={closeDeleteModal}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="reports__btn reports__btnDanger"
                  onClick={handleConfirmDelete}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default Reports;
