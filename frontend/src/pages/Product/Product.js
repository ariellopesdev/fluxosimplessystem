// CSS
import "./Product.css";

// React
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  getProducts,
  resetMessage,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../../slices/productSlice";

// Components
import Message from "../../components/Message/Message";

// Hooks
import { useModal } from "../../hooks/useModal";
import { useSearch } from "../../hooks/useSearch";

// Storage
import { uploads } from "../../utils/config";

// Icons
import { FaEdit, FaTrash, FaBoxOpen } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const Product = () => {
  const dispatch = useDispatch();

  const { products, loading, error, message } = useSelector(
    (state) => state.product,
  );

  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [unityPrice, setUnityPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [errors, setErrors] = useState({});
  const [category, setCategory] = useState("");

  const {
    isOpen: showProductModal,
    openModal: openProductModal,
    closeModal: closeProductModal,
  } = useModal();

  const {
    isOpen: showDeleteModal,
    modalData: selectedDeleteProduct,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const productsList = useMemo(() => {
    return Array.isArray(products) ? products : [];
  }, [products]);

  const {
    search,
    setSearch,
    filteredItems: filteredProducts,
  } = useSearch(productsList, [
    "name",
    "category",
    "company.name",
    (product) =>
      product.category === "ASSET"
        ? "bem da empresa asset"
        : product.category === "SELLABLE"
          ? "vendável vendavel produto vendável sellable"
          : "operacional operational",
    (product) => (Number(product.stock) > 0 ? "ativo estoque" : "sem estoque"),
  ]);

  const resetForm = () => {
    setEditId(null);
    setName("");
    setStock("");
    setUnityPrice("");
    setProductImage("");
    setCategory("");
    setErrors({});
  };

  const handleCloseProductModal = () => {
    closeProductModal();
    resetForm();
    dispatch(resetMessage());
  };

  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
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
          error = "O preço unitário é obrigatório.";
        } else if (Number(value) <= 0) {
          error = "O preço precisa ser maior que zero.";
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
      [fieldName]: error,
    }));

    return error;
  };

  const validateForm = () => {
    const validationErrors = {
      name: validateField("name", name),
      stock: validateField("stock", stock),
      unityPrice: validateField("unityPrice", unityPrice),
      category: validateField("category", category),
    };

    return !Object.values(validationErrors).some((item) => item);
  };

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetMessage());
  }, [dispatch]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch(resetMessage());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
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

    if (editId) {
      result = await dispatch(
        updateProduct({
          id: editId,
          productData,
        }),
      );
    } else {
      result = await dispatch(createProduct(productData));
    }

    const success =
      createProduct.fulfilled.match(result) ||
      updateProduct.fulfilled.match(result);

    if (success) {
      handleCloseProductModal();
    }
  };

  const handleEdit = async (id) => {
    const result = await dispatch(getProductById(id));

    if (getProductById.fulfilled.match(result)) {
      const product = result.payload;

      setEditId(product._id);
      setName(product.name || "");
      setStock(product.stock || "");
      setUnityPrice(product.unityPrice || "");
      setCategory(product.category || "");

      openProductModal();
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteProduct?._id) return;

    await dispatch(deleteProduct(selectedDeleteProduct._id));
    closeDeleteModal();
  };

  const getCategoryLabel = (productCategory) => {
    const categories = {
      ASSET: "Bem da empresa",
      SELLABLE: "Vendável",
      OPERATIONAL: "Operacional",
    };

    return categories[productCategory] || "-";
  };

  const totalStock = productsList.reduce(
    (acc, product) => acc + Number(product.stock || 0),
    0,
  );

  const stockValue = productsList.reduce(
    (acc, product) => acc + Number(product.totalPrice || 0),
    0,
  );

  const latestProduct = [...productsList].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  )[0];

  const latestEntry = latestProduct
    ? (() => {
        const latestDate = new Date(latestProduct.createdAt);
        const today = new Date();

        const isToday =
          latestDate.getDate() === today.getDate() &&
          latestDate.getMonth() === today.getMonth() &&
          latestDate.getFullYear() === today.getFullYear();

        return isToday ? "Hoje" : latestDate.toLocaleDateString("pt-BR");
      })()
    : "Nenhum produto";

  return (
    <div className="product">
      <main className="product__main">
        <div className="product__header">
          <h2>
            <FaBoxOpen />
            Produtos
          </h2>

          <button
            type="button"
            className="product__btn"
            onClick={() => {
              resetForm();
              dispatch(resetMessage());
              openProductModal();
            }}
          >
            + Novo Produto
          </button>
        </div>

        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}

        <div className="product__cards">
          <div className="card green">{productsList.length} Produtos</div>
          <div className="card blue">Estoque total: {totalStock}</div>
          <div className="card orange">Última entrada: {latestEntry}</div>
          <div className="card red">
            R${" "}
            {stockValue.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            em estoque
          </div>
        </div>

        <div className="product__filters">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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

                  <td>{getCategoryLabel(product.category)}</td>
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                  <td>R$ {Number(product.unityPrice || 0).toFixed(2)}</td>
                  <td>R$ {Number(product.totalPrice || 0).toFixed(2)}</td>
                  <td>{product.company?.name || "-"}</td>

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
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString("pt-BR")
                      : "-"}
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
                        onClick={() => openDeleteModal(product)}
                      >
                        <FaTrash />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filteredProducts.length === 0 && (
            <p className="product__empty">Nenhum produto encontrado.</p>
          )}

          {loading && <p className="product__empty">Carregando produtos...</p>}
        </div>

        {showProductModal &&
          createPortal(
            <div
              className="product__modalOverlay"
              onClick={handleCloseProductModal}
            >
              <div
                className="product__modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="product__modalHeader">
                  <h3>{editId ? "Editar Produto" : "Novo Produto"}</h3>

                  <button
                    type="button"
                    className="product__closeBtn"
                    onClick={handleCloseProductModal}
                  >
                    <IoClose />
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
                      className={errors.category ? "input__error" : ""}
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="ASSET">Bem da Empresa</option>
                      <option value="SELLABLE">Produto vendável</option>
                      <option value="OPERATIONAL">Produto operacional</option>
                    </select>

                    {errors.category && (
                      <span className="field__error">{errors.category}</span>
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
                      className={errors.name ? "input__error" : ""}
                    />

                    {errors.name && (
                      <span className="field__error">{errors.name}</span>
                    )}
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
                      className={errors.stock ? "input__error" : ""}
                    />

                    {errors.stock && (
                      <span className="field__error">{errors.stock}</span>
                    )}
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
                      className={errors.unityPrice ? "input__error" : ""}
                    />

                    {errors.unityPrice && (
                      <span className="field__error">{errors.unityPrice}</span>
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
                </form>
              </div>
            </div>,
            document.body,
          )}

        {showDeleteModal &&
          selectedDeleteProduct &&
          createPortal(
            <div className="product__modalOverlay" onClick={closeDeleteModal}>
              <div
                className="product__deleteModal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="product__modalHeader">
                  <h3>Excluir Produto</h3>

                  <button
                    type="button"
                    className="product__closeBtn"
                    onClick={closeDeleteModal}
                  >
                    <IoClose />
                  </button>
                </div>

                <div className="product__deleteContent">
                  <p>Deseja realmente excluir o produto:</p>
                  <strong>{selectedDeleteProduct.name}</strong>
                  <span>Esta ação não poderá ser desfeita.</span>
                </div>

                <div className="product__deleteActions">
                  <button
                    type="button"
                    className="product__btn product__btnSecondary"
                    onClick={closeDeleteModal}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="product__btn product__btnDanger"
                    onClick={handleConfirmDelete}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}
      </main>
    </div>
  );
};

export default Product;
