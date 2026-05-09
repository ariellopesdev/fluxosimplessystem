// CSS
import "./Product.css";

// Components
import Navbar from "../../components/Navbar/Navbar";
import Message from "../../components/Message/Message";
import Footer from "../../components/Footer/Footer";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import {
  getProducts,
  resetMessage,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../../slices/productSlice";

const Product = () => {
  const dispatch = useDispatch();

  const { products, loading, error, message } = useSelector(
    (state) => state.product
  );

  // Modal
  const [showModal, setShowModal] = useState(false);

  // Edit
  const [editId, setEditId] = useState(null);

  // Form states (AJUSTADO PARA BACKEND)
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [unityPrice, setUnityPrice] = useState("");
  const [productImage, setProductImage] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Load products
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Reset messages ao abrir página
  useEffect(() => {
    dispatch(resetMessage());
  }, [dispatch]);

  // Auto remove messages
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  // Submit create/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = new FormData();

    productData.append("name", name);
    productData.append("stock", stock);
    productData.append("unityPrice", unityPrice);

    if (productImage) {
      productData.append("productImage", productImage);
    }

    let result;

    // UPDATE
    if (editId) {
      result = await dispatch(
        updateProduct({
          id: editId,
          productData,
        })
      );
    }

    // CREATE
    else {
      result = await dispatch(createProduct(productData));
    }

    const success =
      createProduct.fulfilled.match(result) ||
      updateProduct.fulfilled.match(result);

    if (success) {
      setName("");
      setStock("");
      setUnityPrice("");
      setProductImage("");

      setEditId(null);
      setShowModal(false);
    }
  };

  // EDIT
  const handleEdit = async (id) => {
    const result = await dispatch(getProductById(id));

    if (getProductById.fulfilled.match(result)) {
      const product = result.payload;

      setEditId(product._id);

      setName(product.name || "");
      setStock(product.stock || "");
      setUnityPrice(product.unityPrice || "");

      setShowModal(true);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    await dispatch(deleteProduct(id));
  };

  // FILTER
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="product">
      <main className="product__main">

        {/* HEADER */}
        <div className="product__header">
          <h2>Produtos</h2>

          <button
            className="product__btn"
            onClick={() => {
              setShowModal(true);
              setEditId(null);

              setName("");
              setStock("");
              setUnityPrice("");
              setProductImage("");

              dispatch(resetMessage());
            }}
          >
            + Novo Produto
          </button>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="product__modalOverlay">
            <div className="product__modal">

              <div className="product__modalHeader">
                <h3>{editId ? "Editar Produto" : "Novo Produto"}</h3>

                <button
                  className="product__closeBtn"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);

                    setName("");
                    setStock("");
                    setUnityPrice("");
                    setProductImage("");

                    dispatch(resetMessage());
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>

                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Estoque"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Preço unitário"
                  value={unityPrice}
                  onChange={(e) => setUnityPrice(e.target.value)}
                />

                <input
                  type="file"
                  onChange={(e) => setProductImage(e.target.files[0])}
                />

                {!loading && (
                  <input
                    type="submit"
                    value={editId ? "Salvar Alterações" : "Cadastrar Produto"}
                    className="product__btn"
                  />
                )}

                {loading && (
                  <input
                    type="submit"
                    value="Aguarde..."
                    className="product__btn"
                    disabled
                  />
                )}

                {error && <Message msg={error} type="error" />}
              </form>
            </div>
          </div>
        )}

        {/* CARDS */}
        <div className="product__cards">
          <div className="card green">
            {products.length} Produtos
          </div>

          <div className="card blue">
            Estoque total:{" "}
            {products.reduce((acc, p) => acc + (p.stock || 0), 0)}
          </div>

          <div className="card orange">
            Controle de estoque
          </div>

          <div className="card red">
            Sistema ativo
          </div>
        </div>

        {/* FILTERS */}
        <div className="product__filters">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="product__table">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Estoque</th>
                <th>Preço Unitário</th>
                <th>Total</th>
                <th>Empresa</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>

                  <td>{product.stock}</td>

                  <td>R$ {Number(product.unityPrice).toFixed(2)}</td>

                  <td>R$ {Number(product.totalPrice).toFixed(2)}</td>

                  <td>{product.company?.name}</td>

                  <td>
                    <span className="status active">Ativo</span>
                  </td>

                  <td>
                    <span
                      style={{ cursor: "pointer", marginRight: "10px" }}
                      onClick={() => handleEdit(product._id)}
                    >
                      ✏️
                    </span>

                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(product._id)}
                    >
                      🗑
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {message && <Message msg={message} type="success" />}

          {loading && <p>Carregando produtos...</p>}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Product;