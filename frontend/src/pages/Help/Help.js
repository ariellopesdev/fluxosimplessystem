import "./Help.css";

// React
import { useMemo, useState } from "react";

import {
  FaBoxOpen,
  FaUsers,
  FaTools,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaChartBar,
  FaTachometerAlt,
  FaCog,
  FaQuestionCircle,
  FaLightbulb,
  FaPuzzlePiece,
} from "react-icons/fa";

const helpCategories = [
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

const tutorials = [
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
      "Acesse Clientes, clique em '+ Novo cliente', informe nome, CPF/CNPJ, telefone, e-mail e endereço. O endereço pode ser visualizado separadamente no modal de dados.",
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
      "Acesse Agendamentos, escolha uma data disponível no calendário e clique duas vezes no dia para abrir o novo agendamento. Selecione cliente, serviço, horário inicial e horário final.",
  },
  {
    category: "appointments",
    question: "Como concluir ou cancelar um agendamento?",
    answer:
      "Na lista de agendamentos pendentes, use os botões 'Concluir' ou 'Cancelar'. Agendamentos concluídos e cancelados ficam disponíveis no histórico.",
  },
  {
    category: "financial",
    question: "Como registrar uma despesa?",
    answer:
      "Acesse Financeiro, clique em '+ Novo registro', selecione o tipo 'Despesa', informe categoria, valor, forma de pagamento e status.",
  },
  {
    category: "financial",
    question: "Como ver o histórico financeiro?",
    answer:
      "Na página Financeiro, clique em 'Histórico'. Você poderá filtrar movimentações por dia, mês ou ano.",
  },
  {
    category: "reports",
    question: "Como gerar um relatório?",
    answer:
      "Acesse Relatórios, escolha o tipo do relatório, selecione o período e clique em 'Gerar relatório'. Você poderá visualizar ou exportar em PDF.",
  },
  {
    category: "dashboard",
    question: "Como atualizar os dados do dashboard?",
    answer:
      "Acesse Dashboard, escolha o período desejado e clique em 'Atualizar'. Os cards, gráficos, alertas e atividades serão recalculados.",
  },
  {
    category: "settings",
    question: "Como editar meus dados?",
    answer:
      "Acesse Configurações, altere os dados do perfil ou da empresa e salve. Também é possível trocar a imagem do perfil.",
  },
];

const tips = [
  "Cadastre clientes antes de criar agendamentos.",
  "Mantenha o estoque sempre atualizado.",
  "Use o Financeiro para separar receitas, despesas e patrimônio.",
  "Conclua ou cancele agendamentos após o horário do serviço.",
  "Gere relatórios semanalmente para acompanhar o desempenho.",
  "Verifique os alertas do Dashboard com frequência.",
];

const Help = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openTutorial, setOpenTutorial] = useState(null);

  const filteredTutorials = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return tutorials.filter((item) => {
      const matchesSearch =
        !searchText ||
        item.question.toLowerCase().includes(searchText) ||
        item.answer.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const selectedCategoryData = helpCategories.find(
    (category) => category.id === selectedCategory,
  );

  return (
    <div className="help">
      <div className="help__hero">
        <div>
          <span className="help__badge">Central de Ajuda</span>
          <h2>Como podemos ajudar?</h2>
          <p>
            Encontre instruções rápidas sobre produtos, clientes, serviços,
            agendamentos, financeiro, relatórios e dashboard.
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

      <div className="help__cards">
        <button
          type="button"
          className={`help__card ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => {
            setSelectedCategory("all");
            setOpenTutorial(null);
          }}
        >
          <span>
            <FaQuestionCircle />
          </span>
          <strong>Todos</strong>
          <small>Ver toda a ajuda</small>
        </button>

        {helpCategories.map((category) => (
          <button
            type="button"
            key={category.id}
            className={`help__card ${
              selectedCategory === category.id ? "active" : ""
            }`}
            onClick={() => {
              setSelectedCategory(category.id);
              setOpenTutorial(null);
            }}
          >
            <span>{category.icon}</span>
            <strong>{category.title}</strong>
            <small>{category.description}</small>
          </button>
        ))}
      </div>

      <div className="help__content">
        <div className="help__main">
          <div className="help__sectionHeader">
            <div>
              <h3>
                {selectedCategory === "all"
                  ? "Tutoriais rápidos"
                  : selectedCategoryData?.title}
              </h3>

              <p>
                {selectedCategory === "all"
                  ? "Veja respostas para as principais dúvidas do sistema."
                  : selectedCategoryData?.description}
              </p>
            </div>

            <span>{filteredTutorials.length} item(ns)</span>
          </div>

          <div className="help__faq">
            {filteredTutorials.length > 0 ? (
              filteredTutorials.map((item, index) => (
                <div
                  key={`${item.category}-${index}`}
                  className={`help__faqItem ${
                    openTutorial === index ? "open" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenTutorial(openTutorial === index ? null : index)
                    }
                  >
                    <span>{item.question}</span>
                    <strong>{openTutorial === index ? "−" : "+"}</strong>
                  </button>

                  {openTutorial === index && <p>{item.answer}</p>}
                </div>
              ))
            ) : (
              <div className="help__empty">
                Nenhuma ajuda encontrada para essa busca.
              </div>
            )}
          </div>
        </div>

        <aside className="help__sidebar">
          <div className="help__tips">
            <h3>
              <FaLightbulb />
              Dicas do sistema
            </h3>

            <ul>
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="help__support">
            <span>
              <FaPuzzlePiece />
            </span>
            <h3>Precisa de suporte?</h3>
            <p>
              Caso não encontre sua dúvida aqui, registre o problema para que
              possamos criar uma área de suporte futuramente.
            </p>

            <button type="button">Falar com suporte</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Help;
