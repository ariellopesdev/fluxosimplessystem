// Icons
import {
  FaBoxOpen,
  FaUsers,
  FaTools,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaChartBar,
  FaTachometerAlt,
  FaCog,
} from "react-icons/fa";

// Help categories
export const helpCategories = [
  {
    id: "products",
    icon: <FaBoxOpen />,
    title: "Produtos",
    description: "Cadastro, estoque, imagens e controle de produtos.",
  },
  {
    id: "clients",
    icon: <FaUsers />,
    title: "Clientes",
    description: "Dados, contatos, endereço e histórico do cliente.",
  },
  {
    id: "services",
    icon: <FaTools />,
    title: "Serviços",
    description: "Serviços vendáveis, agendáveis e duração estimada.",
  },
  {
    id: "appointments",
    icon: <FaCalendarAlt />,
    title: "Agendamentos",
    description: "Agenda, disponibilidade, conclusão e cancelamento.",
  },
  {
    id: "financial",
    icon: <FaMoneyBillWave />,
    title: "Financeiro",
    description: "Receitas, despesas, patrimônio e movimentações.",
  },
  {
    id: "reports",
    icon: <FaChartBar />,
    title: "Relatórios",
    description: "Relatórios gerais, específicos e exportação PDF.",
  },
  {
    id: "dashboard",
    icon: <FaTachometerAlt />,
    title: "Dashboard",
    description: "Indicadores, gráficos, alertas e atividades recentes.",
  },
  {
    id: "settings",
    icon: <FaCog />,
    title: "Configurações",
    description: "Perfil, empresa e preferências do sistema.",
  },
];

// Help tutorials
export const tutorials = [
  {
    category: "products",
    question: "Como cadastrar um produto?",
    answer:
      "Acesse Produtos, clique em '+ Novo produto', preencha nome, estoque, preço unitário, categoria e imagem se desejar. Depois salve o cadastro.",
  },
  {
    category: "clients",
    question: "Como cadastrar um cliente?",
    answer:
      "Acesse Clientes, clique em '+ Novo cliente', informe nome, CPF/CNPJ, telefone, e-mail e endereço.",
  },
  {
    category: "services",
    question: "Como criar um serviço?",
    answer:
      "Acesse Serviços, clique em '+ Novo serviço', informe nome, descrição, preço, duração estimada e marque se ele pode ser agendado ou vendido.",
  },
  {
    category: "appointments",
    question: "Como criar um agendamento?",
    answer:
      "Acesse Agendamentos, escolha uma data disponível e clique duas vezes no dia para abrir o novo agendamento.",
  },
  {
    category: "financial",
    question: "Como registrar uma despesa?",
    answer:
      "Acesse Financeiro, clique em '+ Novo registro', selecione o tipo 'Despesa', informe categoria, valor, forma de pagamento e status.",
  },
  {
    category: "reports",
    question: "Como gerar um relatório?",
    answer:
      "Acesse Relatórios, escolha o tipo do relatório, selecione o período e clique em 'Gerar relatório'.",
  },
  {
    category: "dashboard",
    question: "Como atualizar os dados do dashboard?",
    answer:
      "Acesse Dashboard, escolha o período desejado e clique em 'Atualizar'.",
  },
  {
    category: "settings",
    question: "Como editar meus dados?",
    answer:
      "Acesse Configurações, altere os dados do perfil ou da empresa e salve.",
  },
];

// Help tips
export const tips = [
  "Cadastre clientes antes de criar agendamentos.",
  "Mantenha o estoque sempre atualizado.",
  "Use o Financeiro para separar receitas, despesas e patrimônio.",
  "Conclua ou cancele agendamentos após o horário do serviço.",
  "Gere relatórios semanalmente para acompanhar o desempenho.",
  "Verifique os alertas do Dashboard com frequência.",
];

// Support options
export const supportCategories = [
  { value: "ACCOUNT", label: "Conta" },
  { value: "PRODUCTS", label: "Produtos" },
  { value: "CLIENTS", label: "Clientes" },
  { value: "SERVICES", label: "Serviços" },
  { value: "APPOINTMENTS", label: "Agendamentos" },
  { value: "FINANCIAL", label: "Financeiro" },
  { value: "REPORTS", label: "Relatórios" },
  { value: "DASHBOARD", label: "Dashboard" },
  { value: "SETTINGS", label: "Configurações" },
  { value: "BUG", label: "Bug" },
  { value: "OTHER", label: "Outro" },
];

export const supportPriorities = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
];