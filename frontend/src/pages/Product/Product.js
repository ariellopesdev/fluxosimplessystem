// CSS
import "./Product.css";

// Components
import Message from "../../components/Message/Message";

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

//Storage
import { uploads } from "../../utils/config";

import { FaEdit, FaTrash } from "react-icons/fa";

const Product = () => {
  const dispatch = useDispatch();

  const { products, loading, error, message } = useSelector(
    (state) => state.product,
  );

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [unityPrice, setUnityPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [category, setCategory] = useState("");

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (value.trim().length < 3) {
          error = "O nome do produto precisa ter no mínimo 3 caracteres.";
        }
        break;
      case "stock":
        if (value === "") {
          error = "Estoque é obrigatório.";
        } else if (Number(value) < 0) {
          error = "O estoque não pode ser negativo.";
        }
        break;
      case "unityPrice":
        if (value === "") {
          error = "O preço do produto unitário é obrigatório.";
        } else if (Number(value) <= 0) {
          error = "O preço precisa ser um valor maior que zero.";
        }
        break;
      case "category":
        if (!value) {
          error = "A categoria é obrigatória.";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

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
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  // Submit create/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    validateField("name", name);
    validateField("stock", stock);
    validateField("unityPrice", unityPrice);
    validateField("category", category);

    if (
      !name ||
      name.length < 3 ||
      stock === "" ||
      Number(stock) < 0 ||
      unityPrice === "" ||
      Number(unityPrice) <= 0 ||
      !category
    ) {
      return;
    }

    const productData = new FormData();

    productData.append("name", name);
    productData.append("stock", stock);
    productData.append("unityPrice", unityPrice);
    productData.append("category", category);

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
        }),
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
      setCategory("");

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
      setCategory(product.category || "");

      setShowModal(true);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    await dispatch(deleteProduct(id));
  };

  // FILTER
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="product">
      <main className="product__main">
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

              <form onSubmit={handleSubmit} className="form__product">
                <div className="form__group--product">
                  <label>Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      validateField("category", e.target.value);
                    }}
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="ASSET">Bem da Empresa</option>
                    <option value="SELLABLE">Produto vendável</option>
                    <option value="OPERATIONAL">Produto operacional</option>
                  </select>
                  {errors.category && (
                    <Message msg={errors.category} type="error" />
                  )}
                </div>
                <div className="form__group--product">
                  <label>Nome do produto</label>
                  <input
                    type="text"
                    placeholder="Digite o nome do produto"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      validateField("name", e.target.value);
                    }}
                  />
                  {errors.name && <Message msg={errors.name} type="error" />}
                </div>
                <div className="form__group--product">
                  <label>Estoque</label>
                  <input
                    type="number"
                    placeholder="Digite a quantidade do produto"
                    value={stock}
                    onChange={(e) => {
                      setStock(e.target.value);
                      validateField("stock", e.target.value);
                    }}
                  />
                  {errors.stock && <Message msg={errors.stock} type="error" />}
                </div>
                <div className="form__group--product">
                  <label>Preço unitário</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Digite o preço unitário"
                    value={unityPrice}
                    onChange={(e) => {
                      setUnityPrice(e.target.value);
                      validateField("unityPrice", e.target.value);
                    }}
                  />
                  {errors.unityPrice && (
                    <Message msg={errors.unityPrice} type="error" />
                  )}
                </div>
                <div className="form__group--product">
                  <label>Imagem do produto</label>
                  <input
                    type="file"
                    onChange={(e) => setProductImage(e.target.files[0])}
                  />
                </div>
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
          <div className="card green">{products.length} Produtos</div>

          <div className="card blue">
            Estoque total:{" "}
            {products.reduce((acc, p) => acc + (p.stock || 0), 0)}
          </div>

          <div className="card orange">
            Última entrada:{" "}
            {products.length > 0
              ? (() => {
                  const latestProduct = [...products].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                  )[0];

                  const latestDate = new Date(latestProduct.createdAt);
                  const today = new Date();

                  const isToday =
                    latestDate.getDate() === today.getDate() &&
                    latestDate.getMonth() === today.getMonth() &&
                    latestDate.getFullYear() === today.getFullYear();

                  return isToday
                    ? "Hoje"
                    : latestDate.toLocaleDateString("pt-BR");
                })()
              : "Nenhum produto"}
          </div>

          <div className="card red">
            R${" "}
            {products
              .reduce((acc, product) => {
                return acc + Number(product.totalPrice || 0);
              }, 0)
              .toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
            em estoque
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
                <th>Imagem</th>
                <th>Categoria</th>
                <th>Produto</th>
                <th>Estoque</th>
                <th>Preço Unitário</th>
                <th>Total</th>
                <th>Empresa</th>
                <th>Status</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    {product.productImage ? (
                      <img
                        src={`${uploads}/products/${product.productImage}`}
                        alt={product.name}
                        className="product__tableImage"
                      />
                    ) : (
                      <div className="product__tableImagePlaceholder">
                        Sem imagem
                      </div>
                    )}
                  </td>
                  <td>
                    {product.category === "ASSET"
                      ? "Bem da empresa"
                      : product.category === "SELLABLE"
                        ? "Vendável"
                        : "Operacional"}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                  <td>R$ {Number(product.unityPrice).toFixed(2)}</td>
                  <td>R$ {Number(product.totalPrice).toFixed(2)}</td>
                  <td>{product.company?.name}</td>
                  <td>
                    <span
                      className={
                        Number(product.stock) > 0
                          ? "status active"
                          : "status inactive"
                      }
                    >
                      {Number(product.stock) > 0 ? "Ativo" : "Sem estoque"}
                    </span>
                  </td>
                  <td>
                    {new Date(product.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td>
                    <div className="table__edit--close">
                      <span
                        className="product__actionIcon edit"
                        onClick={() => handleEdit(product._id)}
                      >
                        <FaEdit />
                      </span>
                      <span
                        className="product__actionIcon delete"
                        onClick={() => handleDelete(product._id)}
                      >
                        <FaTrash />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {message && <Message msg={message} type="success" />}

          {loading && <p>Carregando produtos...</p>}
        </div>
      </main>
    </div>
  );
};

export default Product;
