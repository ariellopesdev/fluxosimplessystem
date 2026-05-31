const Dashboard = require("../models/Dashboard");

const Financial = require("../models/Financial");
const Sale = require("../models/Sales");
const Product = require("../models/Product");
const Client = require("../models/Client");
const Appointment = require("../models/Appointment");
const Service = require("../models/Service");
const Reports = require("../models/reports");

const getCompanyId = (reqUser) => {
  return reqUser.company?._id || reqUser.company;
};

const getPeriod = (period = "CURRENT_MONTH", startDate, endDate) => {
  const now = new Date();

  const end = endDate ? new Date(endDate) : new Date(now);
  const start = startDate ? new Date(startDate) : new Date(now);

  if (!startDate) {
    if (period === "TODAY") {
      start.setHours(0, 0, 0, 0);
    }

    if (period === "LAST_7_DAYS") {
      start.setDate(end.getDate() - 7);
      start.setHours(0, 0, 0, 0);
    }

    if (period === "LAST_30_DAYS") {
      start.setDate(end.getDate() - 30);
      start.setHours(0, 0, 0, 0);
    }

    if (period === "CURRENT_MONTH") {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    }
  }

  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const formatDateKey = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

const getDashboard = async (req, res) => {
  const { period = "CURRENT_MONTH", startDate, endDate } = req.query;

  try {
    const reqUser = req.user;
    const companyId = getCompanyId(reqUser);
    const { start, end } = getPeriod(period, startDate, endDate);

    const financials = await Financial.find({
      company: companyId,
      createdAt: { $gte: start, $lte: end },
    });

    const sales = await Sale.find({
      seller: reqUser._id,
      createdAt: { $gte: start, $lte: end },
    })
      .populate("client", "name cpfCnpj phones email")
      .populate("products.product", "name stock unityPrice category");

    const products = await Product.find({
      company: companyId,
    });

    const clients = await Client.find();

    const appointments = await Appointment.find({
      company: companyId,
      date: { $gte: start, $lte: end },
    }).populate("client", "name cpfCnpj phones email");

    const services = await Service.find({
      company: companyId,
    });

    const reports = await Reports.find({
      company: companyId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const totalRevenueFromFinancial = financials
      .filter((item) => item.type === "INCOME")
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);

    const totalRevenueFromSales = sales
      .filter((sale) => sale.status !== "CANCELLED")
      .reduce((acc, sale) => acc + Number(sale.total || 0), 0);

    const totalRevenueFromAppointments = appointments
      .filter(
        (appointment) =>
          appointment.status === "FINISHED" &&
          appointment.payment?.status === "PAID",
      )
      .reduce((acc, appointment) => acc + Number(appointment.total || 0), 0);

    const totalRevenue =
      totalRevenueFromFinancial +
      totalRevenueFromSales +
      totalRevenueFromAppointments;

    const totalExpensesFromFinancial = financials
      .filter((item) => item.type === "EXPENSE")
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);

    const totalExpensesFromProducts = products
      .filter((product) => product.category !== "ASSET")
      .filter((product) => {
        const createdAt = new Date(product.createdAt);
        return createdAt >= start && createdAt <= end;
      })
      .reduce((acc, product) => acc + Number(product.totalPrice || 0), 0);

    const totalExpenses =
      totalExpensesFromFinancial + totalExpensesFromProducts;

    const totalAssetsFromFinancial = financials
      .filter((item) => item.type === "ASSET")
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);

    const totalAssetsFromProducts = products
      .filter((product) => product.category === "ASSET")
      .filter((product) => {
        const createdAt = new Date(product.createdAt);
        return createdAt >= start && createdAt <= end;
      })
      .reduce((acc, product) => acc + Number(product.totalPrice || 0), 0);

    const totalAssets = totalAssetsFromFinancial + totalAssetsFromProducts;

    const finishedSales = sales.filter((sale) => sale.status === "FINISHED");

    const totalSales = finishedSales.length;

    const totalProductsSold = finishedSales.reduce((acc, sale) => {
      return (
        acc +
        sale.products.reduce(
          (sum, product) => sum + Number(product.quantity || 0),
          0,
        )
      );
    }, 0);

    const newClients = clients.filter((client) => {
      const createdAt = new Date(client.createdAt);
      return createdAt >= start && createdAt <= end;
    });

    const financialEvolutionMap = {};

    financials.forEach((item) => {
      const date = formatDateKey(item.createdAt);

      if (!financialEvolutionMap[date]) {
        financialEvolutionMap[date] = {
          date,
          revenue: 0,
          expenses: 0,
          profit: 0,
        };
      }

      if (item.type === "INCOME") {
        financialEvolutionMap[date].revenue += Number(item.amount || 0);
      }

      if (item.type === "EXPENSE") {
        financialEvolutionMap[date].expenses += Number(item.amount || 0);
      }

      financialEvolutionMap[date].profit =
        financialEvolutionMap[date].revenue -
        financialEvolutionMap[date].expenses;
    });

    sales.forEach((sale) => {
      if (sale.status === "CANCELLED") return;

      const date = formatDateKey(sale.createdAt);

      if (!financialEvolutionMap[date]) {
        financialEvolutionMap[date] = {
          date,
          revenue: 0,
          expenses: 0,
          profit: 0,
        };
      }

      financialEvolutionMap[date].revenue += Number(sale.total || 0);
      financialEvolutionMap[date].profit =
        financialEvolutionMap[date].revenue -
        financialEvolutionMap[date].expenses;
    });

    appointments.forEach((appointment) => {
      if (
        appointment.status !== "FINISHED" ||
        appointment.payment?.status !== "PAID"
      ) {
        return;
      }

      const date = formatDateKey(appointment.date);

      if (!financialEvolutionMap[date]) {
        financialEvolutionMap[date] = {
          date,
          revenue: 0,
          expenses: 0,
          profit: 0,
        };
      }

      financialEvolutionMap[date].revenue += Number(appointment.total || 0);
      financialEvolutionMap[date].profit =
        financialEvolutionMap[date].revenue -
        financialEvolutionMap[date].expenses;
    });

    const financialEvolution = Object.values(financialEvolutionMap).sort(
      (a, b) => a.date.localeCompare(b.date),
    );

    const salesEvolutionMap = {};

    finishedSales.forEach((sale) => {
      const date = formatDateKey(sale.createdAt);

      if (!salesEvolutionMap[date]) {
        salesEvolutionMap[date] = {
          date,
          sales: 0,
          productsSold: 0,
        };
      }

      salesEvolutionMap[date].sales += 1;
      salesEvolutionMap[date].productsSold += sale.products.reduce(
        (acc, product) => acc + Number(product.quantity || 0),
        0,
      );
    });

    const salesEvolution = Object.values(salesEvolutionMap).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    const appointmentStatus = [
      {
        status: "Pendentes",
        total: appointments.filter((item) => item.status === "PENDING").length,
      },
      {
        status: "Confirmados",
        total: appointments.filter((item) => item.status === "CONFIRMED")
          .length,
      },
      {
        status: "Concluídos",
        total: appointments.filter((item) => item.status === "FINISHED").length,
      },
      {
        status: "Cancelados",
        total: appointments.filter((item) => item.status === "CANCELLED")
          .length,
      },
    ];

    const salesItems = [];

    finishedSales.forEach((sale) => {
      sale.products.forEach((item) => {
        salesItems.push({
          productId: item.product?._id || item.product,
          name: item.name || item.product?.name || "-",
          quantity: Number(item.quantity || 0),
          revenue: Number(item.totalPrice || 0),
        });
      });
    });

    const topProductsMap = {};

    salesItems.forEach((item) => {
      const key = item.productId?.toString() || item.name;

      if (!topProductsMap[key]) {
        topProductsMap[key] = {
          productId: item.productId,
          name: item.name,
          quantitySold: 0,
          revenue: 0,
        };
      }

      topProductsMap[key].quantitySold += item.quantity;
      topProductsMap[key].revenue += item.revenue;
    });

    const topProducts = Object.values(topProductsMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const topClients = clients
      .map((client) => {
        const clientSales = sales.filter((sale) => {
          const saleClientId =
            typeof sale.client === "object"
              ? sale.client?._id?.toString()
              : sale.client?.toString();

          return saleClientId === client._id.toString();
        });

        const validSales = clientSales.filter(
          (sale) => sale.status !== "CANCELLED",
        );

        const totalSpent = validSales.reduce(
          (acc, sale) => acc + Number(sale.total || 0),
          0,
        );

        const clientAppointments = appointments.filter((appointment) => {
          const appointmentClientId =
            typeof appointment.client === "object"
              ? appointment.client?._id?.toString()
              : appointment.client?.toString();

          return appointmentClientId === client._id.toString();
        });

        return {
          clientId: client._id,
          name: client.name,
          cpfCnpj: client.cpfCnpj,
          phone: client.phones?.primary || "",
          totalSpent,
          totalSales: validSales.length,
          totalAppointments: clientAppointments.length,
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    const lowStockProducts = products.filter(
      (product) => Number(product.stock || 0) <= 5,
    );

    const pendingFinancials = financials.filter(
      (item) => item.payment?.status === "PENDING",
    );

    const overdueAppointments = appointments.filter((appointment) => {
      if (
        appointment.status === "FINISHED" ||
        appointment.status === "CANCELLED"
      ) {
        return false;
      }

      const appointmentDateTime = new Date(
        `${new Date(appointment.date).toISOString().split("T")[0]}T${
          appointment.endTime || appointment.startTime || "23:59"
        }:00`,
      );

      return appointmentDateTime < new Date();
    });

    const alerts = [
      ...lowStockProducts.map((product) => ({
        type: "WARNING",
        title: "Estoque baixo",
        message: `${product.name} possui apenas ${product.stock || 0} unidade(s) em estoque.`,
        module: "PRODUCTS",
        referenceId: product._id,
      })),

      ...pendingFinancials.map((item) => ({
        type: "INFO",
        title: "Pagamento pendente",
        message: `${item.title || "Movimentação financeira"} está com pagamento pendente.`,
        module: "FINANCIAL",
        referenceId: item._id,
      })),

      ...overdueAppointments.map((appointment) => ({
        type: "DANGER",
        title: "Agendamento pendente",
        message: `${appointment.title || "Agendamento"} passou do horário e ainda não foi concluído ou cancelado.`,
        module: "APPOINTMENTS",
        referenceId: appointment._id,
      })),
    ].slice(0, 10);

    const recentActivities = [
      ...sales.slice(0, 5).map((sale) => ({
        module: "SALES",
        action: "Venda registrada",
        description: `${sale.saleNumber || "Venda"} - R$ ${Number(
          sale.total || 0,
        ).toFixed(2)}`,
        date: sale.createdAt,
        referenceId: sale._id,
      })),

      ...appointments.slice(0, 5).map((appointment) => ({
        module: "APPOINTMENTS",
        action: "Agendamento registrado",
        description: `${appointment.title || "Agendamento"} - ${
          appointment.status
        }`,
        date: appointment.date,
        referenceId: appointment._id,
      })),

      ...financials.slice(0, 5).map((item) => ({
        module: "FINANCIAL",
        action: "Movimentação financeira",
        description: `${item.title || "-"} - R$ ${Number(
          item.amount || 0,
        ).toFixed(2)}`,
        date: item.createdAt,
        referenceId: item._id,
      })),

      ...reports.slice(0, 5).map((report) => ({
        module: "REPORTS",
        action: "Relatório gerado",
        description: report.title,
        date: report.createdAt,
        referenceId: report._id,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    const dashboard = await Dashboard.create({
      title: "Dashboard principal",
      period: {
        startDate: start,
        endDate: end,
        label: period,
      },
      summary: {
        totalRevenue,
        totalExpenses,
        totalProfit: totalRevenue - totalExpenses,
        totalAssets,
        totalSales,
        totalProductsSold,
        totalClients: clients.length,
        newClients: newClients.length,
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(
          (item) => item.status === "PENDING",
        ).length,
        completedAppointments: appointments.filter(
          (item) => item.status === "FINISHED",
        ).length,
        cancelledAppointments: appointments.filter(
          (item) => item.status === "CANCELLED",
        ).length,
        totalServices: services.length,
        activeServices: services.filter(
          (service) => service.status === "ACTIVE",
        ).length,
        lowStockProducts: lowStockProducts.length,
      },
      charts: {
        financialEvolution,
        salesEvolution,
        appointmentStatus,
        topProducts,
        topClients,
      },
      alerts,
      recentActivities,
      company: companyId,
      generatedBy: reqUser._id,
      cnpj: reqUser.company?.cnpj,
    });

    res.status(200).json(dashboard);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao carregar dashboard."],
    });
  }
};

const getLatestDashboard = async (req, res) => {
  try {
    const companyId = getCompanyId(req.user);

    const dashboard = await Dashboard.findOne({
      company: companyId,
    }).sort({ createdAt: -1 });

    if (!dashboard) {
      return res.status(404).json({
        errors: ["Nenhum dashboard encontrado."],
      });
    }

    res.status(200).json(dashboard);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao buscar dashboard."],
    });
  }
};

const deleteDashboard = async (req, res) => {
  const { id } = req.params;

  try {
    const companyId = getCompanyId(req.user);

    const dashboard = await Dashboard.findOne({
      _id: id,
      company: companyId,
    });

    if (!dashboard) {
      return res.status(404).json({
        errors: ["Dashboard não encontrado."],
      });
    }

    await Dashboard.findByIdAndDelete(dashboard._id);

    res.status(200).json({
      message: "Dashboard removido com sucesso.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao remover dashboard."],
    });
  }
};

module.exports = {
  getDashboard,
  getLatestDashboard,
  deleteDashboard,
};
