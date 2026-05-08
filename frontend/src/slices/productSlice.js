import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../services/productService";

const initialState = {
  products: [],
  product: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Create product
export const createProduct = createAsyncThunk(
  "product/create",
  async (product, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await productService.createProduct(product, token);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get user products
export const getProducts = createAsyncThunk(
  "product/getall",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await productService.getProducts(token);

    return data;
  },
);

// Get product by id
export const getProductById = createAsyncThunk(
  "product/get",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await productService.getProductById(id, token);

    return data;
  },
);

// Update product
export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ id, productData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await productService.updateProduct(
      productData,
      id,
      token,
    );

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await productService.deleteProduct(id, token);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },

    reset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.products.unshift(action.payload);
        state.message = "Produto cadastrado com sucesso!";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.products = action.payload;
      })

      // Get product by id
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.product = action.payload;
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.products = state.products.map((product) => {
          if (product._id === action.payload._id) {
            return action.payload;
          }

          return product;
        });

        state.message = "Produto atualizado com sucesso!";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.products = state.products.filter(
          (product) => product._id !== action.payload.id,
        );

        state.message = "Produto excluído com sucesso!";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMessage, reset } = productSlice.actions;

export default productSlice.reducer;