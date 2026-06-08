const Report = require("../models/Reports");

const Financial = require("../models/Financial");
const Sale = require("../models/Sales");
const Product = require("../models/Product");
const Client = require("../models/Client");
const Appointment = require("../models/Appointment");
const Service = require("../models/Service");

const getCompanyId = (reqUser) => {
  return reqUser.company?._id || reqUser.company;
};

const getPeriod = (period = "LAST_30_DAYS", startDate, endDate) => {
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : new Date();

  if (!startDate) {
    if (period === "LAST_7_DAYS") {
      start.setDate(end.getDate() - 7);
    } else if (period === "CURRENT_MONTH") {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    } else {
      start.setDate(end.getDate() - 30);
    }
  }

  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const getReports = async (req, res) => {
  try {
    const companyId = getCompanyId(req.user);

    const reports = await Report.find({ company: companyId })
      .sort({ createdAt: -1 })
      .populate("generatedBy", "name email");

    res.status(200).json(reports);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao buscar relatórios."],
    });
  }
};

const getReportById = async (req, res) => {
  const { id } = req.params;

  try {
    const companyId = getCompanyId(req.user);

    const report = await Report.findOne({
      _id: id,
      company: companyId,
    }).populate("generatedBy", "name email");

    if (!report) {
      return res.status(404).json({
        errors: ["Relatório não encontrado."],
      });
    }

    res.status(200).json(report);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao buscar relatório."],
    });
  }
};

const generateReport = async (req, res) => {
  const {
    type = "GENERAL",
    period = "LAST_30_DAYS",
    startDate,
    endDate,
  } = req.body;

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

    const newClients = clients.filter((client) => {
      const createdAt = new Date(client.createdAt);
      return createdAt >= start && createdAt <= end;
    });

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

    const totalExpenses = financials
      .filter((item) => item.type === "EXPENSE")
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);

    const totalAssets = financials
      .filter((item) => item.type === "ASSET")
      .reduce((acc, item) => acc + Number(item.amount || 0), 0);

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

    const financialData = financials.map((item) => ({
      title: item.title || "-",
      description: item.description || "",
      type: item.type || "-",
      category: item.category || "-",
      amount: Number(item.amount || 0),
      paymentMethod: item.payment?.method || "-",
      paymentStatus: item.payment?.status || "-",
      installments: item.payment?.installments || 1,
      paidAt: item.payment?.paidAt || null,
      dueDate: item.payment?.dueDate || null,
      isRecurring: item.isRecurring || false,
      recurrence: item.recurrence || null,
      date: item.createdAt,
    }));

    const salesData = [];

    sales.forEach((sale) => {
      sale.products.forEach((item) => {
        salesData.push({
          saleId: sale._id,
          saleNumber: sale.saleNumber,
          clientName: sale.client?.name || "-",
          customerDocument:
            sale.customerDocument || sale.client?.cpfCnpj || "-",
          productId: item.product?._id || item.product || null,
          productName: item.name || item.product?.name || "-",
          quantity: Number(item.quantity || 0),
          unityPrice: Number(item.unityPrice || 0),
          total: Number(item.totalPrice || 0),
          paymentMethod: sale.payment?.method || "-",
          paymentStatus: sale.payment?.status || "-",
          saleStatus: sale.status || "-",
          date: sale.createdAt,
        });
      });
    });

    const productsData = products.map((product) => {
      const productSales = salesData.filter(
        (sale) =>
          sale.productId &&
          sale.productId.toString() === product._id.toString() &&
          sale.saleStatus !== "CANCELLED",
      );

      const quantitySold = productSales.reduce(
        (acc, sale) => acc + Number(sale.quantity || 0),
        0,
      );

      const revenue = productSales.reduce(
        (acc, sale) => acc + Number(sale.total || 0),
        0,
      );

      return {
        productId: product._id,
        name: product.name,
        category: product.category || "-",
        unityPrice: Number(product.unityPrice || 0),
        quantitySold,
        revenue,
        currentStock: Number(product.stock || 0),
        stockValue: Number(product.totalPrice || 0),
      };
    });

    const clientsData = clients.map((client) => {
      const clientSales = sales.filter((sale) => {
        const saleClientId =
          typeof sale.client === "object"
            ? sale.client?._id?.toString()
            : sale.client?.toString();

        return saleClientId === client._id.toString();
      });

      const validClientSales = clientSales.filter(
        (sale) => sale.status !== "CANCELLED",
      );

      const clientAppointments = appointments.filter((appointment) => {
        const appointmentClientId =
          typeof appointment.client === "object"
            ? appointment.client?._id?.toString()
            : appointment.client?.toString();

        return appointmentClientId === client._id.toString();
      });

      const totalPurchases = validClientSales.length;

      const totalSpent = validClientSales.reduce(
        (acc, sale) => acc + Number(sale.total || 0),
        0,
      );

      const sortedSales = [...validClientSales].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      const sortedAppointments = [...clientAppointments].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );

      return {
        clientId: client._id,
        name: client.name,
        cpfCnpj: client.cpfCnpj,
        phone: client.phones?.primary || "",
        email: client.email || "",
        type: client.type || "PERSON",
        financial: client.financial || "ACTIVE",
        totalPurchases,
        totalSpent,
        lastPurchaseDate: sortedSales[0]?.createdAt || null,
        lastAppointmentDate: sortedAppointments[0]?.date || null,
        activeAppointments: clientAppointments.filter(
          (item) => item.status !== "FINISHED" && item.status !== "CANCELLED",
        ).length,
        completedAppointments: clientAppointments.filter(
          (item) => item.status === "FINISHED",
        ).length,
        cancelledAppointments: clientAppointments.filter(
          (item) => item.status === "CANCELLED",
        ).length,
      };
    });

    const appointmentsData = appointments.map((appointment) => ({
      appointmentId: appointment._id,
      title: appointment.title,
      description: appointment.description || "",
      clientName: appointment.client?.name || "-",
      clientDocument: appointment.client?.cpfCnpj || "-",
      clientPhone: appointment.client?.phones?.primary || "-",
      serviceName: appointment.title || "-",
      status: appointment.status,
      priority: appointment.priority,
      paymentMethod: appointment.payment?.method || "-",
      paymentStatus: appointment.payment?.status || "-",
      installments: appointment.payment?.installments || 1,
      discount: Number(appointment.discount || 0),
      total: Number(appointment.total || 0),
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      notes: appointment.notes || "",
    }));

    const servicesData = services.map((service) => {
      const serviceAppointments = appointments.filter(
        (appointment) => appointment.title === service.name,
      );

      const completedServiceAppointments = serviceAppointments.filter(
        (appointment) => appointment.status === "FINISHED",
      );

      return {
        serviceId: service._id,
        name: service.name,
        description: service.description || "",
        unityPrice: Number(service.unityPrice || 0),
        estimatedDuration: service.estimatedDuration,
        category: service.category,
        status: service.status,
        isSchedulable: service.isSchedulable,
        isSellable: service.isSellable,
        requiresClient: service.requiresClient,
        totalAppointments: serviceAppointments.length,
        completedAppointments: completedServiceAppointments.length,
        revenue: completedServiceAppointments.reduce(
          (acc, appointment) => acc + Number(appointment.total || 0),
          0,
        ),
      };
    });

    const report = await Report.create({
      title: `Relatório ${type}`,
      type,
      period: {
        startDate: start,
        endDate: end,
        label: period,
      },
      summary: {
        totalRevenue,
        totalExpenses,
        totalProfit: totalRevenue - totalExpenses,
        totalSales,
        totalProductsSold,
        totalClients: clients.length,
        newClients: newClients.length,
        returningClients: Math.max(clients.length - newClients.length, 0),
        totalAppointments: appointments.length,
        completedAppointments: appointments.filter(
          (item) => item.status === "FINISHED",
        ).length,
        cancelledAppointments: appointments.filter(
          (item) => item.status === "CANCELLED",
        ).length,
        pendingAppointments: appointments.filter(
          (item) => item.status === "PENDING" || item.status === "CONFIRMED",
        ).length,
        totalAssets,
        totalServices: services.length,
      },
      financialData,
      salesData,
      productsData,
      clientsData,
      appointmentsData,
      servicesData,
      generatedBy: reqUser._id,
      company: companyId,
      cnpj: reqUser.company?.cnpj,
    });

    res.status(201).json(report);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao gerar relatório."],
    });
  }
};

const deleteReport = async (req, res) => {
  const { id } = req.params;

  try {
    const companyId = getCompanyId(req.user);

    const report = await Report.findOne({
      _id: id,
      company: companyId,
    });

    if (!report) {
      return res.status(404).json({
        errors: ["Relatório não encontrado."],
      });
    }

    await Report.findByIdAndDelete(report._id);

    res.status(200).json({
      message: "Relatório removido com sucesso.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: ["Erro ao remover relatório."],
    });
  }
};

module.exports = {
  getReports,
  getReportById,
  generateReport,
  deleteReport,
};
