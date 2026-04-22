import "./Product.css";

const Product = () => {
  return (
    <div className="product">

      {/* HEADER */}
      <div className="product__header">
        <h2>Produtos</h2>
        <button className="product__btn">+ Novo Produto</button>
      </div>

      {/* CARDS */}
      <div className="product__cards">
        <div className="card green">120 Produtos</div>
        <div className="card blue">8 Categorias</div>
        <div className="card orange">Mais vendido: Arroz</div>
        <div className="card red">5 Inativos</div>
      </div>

      {/* FILTROS */}
      <div className="product__filters">
        <input type="text" placeholder="Buscar produto..." />
        <select>
          <option>Categoria</option>
          <option>Grãos</option>
          <option>Laticínios</option>
        </select>
      </div>

      {/* TABELA */}
      <div className="product__table">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>SKU</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Arroz</td>
              <td>Grãos</td>
              <td>R$ 25,00</td>
              <td>ARZ001</td>
              <td><span className="status active">Ativo</span></td>
              <td>👁 ✏️ 🗑</td>
            </tr>

            <tr>
              <td>Leite</td>
              <td>Laticínios</td>
              <td>R$ 6,50</td>
              <td>LTE002</td>
              <td><span className="status inactive">Inativo</span></td>
              <td>👁 ✏️ 🗑</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Product;