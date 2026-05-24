import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import salesService from "../services/salesService";

const initialState = {
  sales: [],
  sale: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Create sale
export const createSale = createAsyncThunk(
  "sale/create",
  async (sale, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await salesService.createSale(sale, token);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get all sales
export const getSales = createAsyncThunk("sale/getall", async (_, thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token;

  const data = await salesService.getSales(token);

  return data;
});

// Get sale by id
export const getSaleById = createAsyncThunk(
  "sale/get",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await salesService.getSaleById(id, token);

    return data;
  },
);

// Update sale
export const updateSale = createAsyncThunk(
  "sale/update",
  async ({ id, saleData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await salesService.updateSale(saleData, id, token);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Delete sale
export const deleteSale = createAsyncThunk(
  "sale/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await salesService.deleteSale(id, token);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

export const salesSlice = createSlice({
  name: "sale",
  initialState,

  reducers: {
    resetMessage: (state) => {
      state.message = null;
      state.error = null;
    },

    reset: (state) => {
      state.loading = false;
      state.error = false;
      state.success = false;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Create sale
      .addCase(createSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.sales.unshift(action.payload);

        state.message = "Venda cadastrada com sucesso!";
      })
      .addCase(createSale.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Get sales
      .addCase(getSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSales.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.sales = action.payload;
      })
      .addCase(getSales.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Get sale by id
      .addCase(getSaleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSaleById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.sale = action.payload;
      })
      .addCase(getSaleById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Update sale
      .addCase(updateSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.sales = state.sales.map((sale) => {
          if (sale._id === action.payload._id) {
            return action.payload;
          }

          return sale;
        });

        state.message = "Venda atualizada com sucesso!";
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Delete sale
      .addCase(deleteSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.sales = state.sales.filter(
          (sale) => sale._id !== action.payload.id,
        );

        state.message = "Venda excluída com sucesso!";
      })
      .addCase(deleteSale.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetMessage, reset } = salesSlice.actions;

export default salesSlice.reducer;
