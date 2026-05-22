// CSS
import "./Sales.css";

// Components
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Message from "../../components/Message/Message";

// Hooks
import { useState } from "react";

const Sales = () => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  // MOCK DATA
  const sales = [
    {
      id: 1,
      client: "João Silva",
      product: "Notebook Dell",
      quantity: 2,
      total: 9000,
      status: "PAID",
      createdAt: "2026-05-22",
    },
    {
      id: 2,
      client: "Maria Souza",
      product: "Monitor LG",
      quantity: 1,
      total: 1200,
      status: "PENDING",
      createdAt: "2026-05-21",
    },
  ];

  const filteredSales = sales.filter((sale) =>
    sale.client.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="sales">
      <main className="sales__main">
        <div className="sales__header">
          <h2>Vendas</h2>

          <button className="sales__btn" onClick={() => setShowModal(true)}>
            + Nova Venda
          </button>
        </div>

        {/* CARDS */}
        <div className="sales__cards">
          <div className="card green">{sales.length} Vendas</div>

          <div className="card blue">Clientes ativos: 12</div>

          <div className="card orange">
            Pendentes:{" "}
            {sales.filter((sale) => sale.status === "PENDING").length}
          </div>

          <div className="card red">
            R${" "}
            {sales
              .reduce((acc, sale) => acc + sale.total, 0)
              .toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </div>
        </div>

        {/* FILTER */}
        <div className="sales__filters">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="sales__modalOverlay">
            <div className="sales__modal">
              <div className="sales__modalHeader">
                <h3>Nova Venda</h3>

                <button
                  className="sales__closeBtn"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>

              <form className="form__sales">
                <div className="form__group--sales">
                  <label>Cliente</label>
                  <input type="text" placeholder="Digite o nome do cliente" />
                </div>

                <div className="form__group--sales">
                  <label>Produto</label>

                  <select>
                    <option>Selecione um produto</option>
                  </select>
                </div>

                <div className="form__group--sales">
                  <label>Quantidade</label>
                  <input type="number" placeholder="Quantidade" />
                </div>

                <div className="form__group--sales">
                  <label>Forma de pagamento</label>

                  <select>
                    <option>Pix</option>
                    <option>Cartão</option>
                    <option>Dinheiro</option>
                  </select>
                </div>

                <button className="sales__btn">Finalizar Venda</button>
              </form>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="sales__table">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Total</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.client}</td>
                  <td>{sale.product}</td>
                  <td>{sale.quantity}</td>

                  <td>R$ {sale.total.toFixed(2)}</td>

                  <td>
                    <span
                      className={
                        sale.status === "PAID"
                          ? "status active"
                          : "status pending"
                      }
                    >
                      {sale.status === "PAID" ? "Pago" : "Pendente"}
                    </span>
                  </td>

                  <td>
                    {new Date(sale.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Sales;
