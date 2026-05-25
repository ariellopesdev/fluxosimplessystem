import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import financialService from "../services/financialService";

const initialState = {
  financials: [],
  financial: {},
  summary: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Create financial
export const createFinancial = createAsyncThunk(
  "financial/create",
  async (financial, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await financialService.createFinancial(financial, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get all financials
export const getAllFinancials = createAsyncThunk(
  "financial/getall",
  async (filters, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await financialService.getAllFinancials(filters, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get financial by id
export const getFinancialById = createAsyncThunk(
  "financial/get",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await financialService.getFinancialById(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Update financial
export const updateFinancial = createAsyncThunk(
  "financial/update",
  async ({ id, financialData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await financialService.updateFinancial(
      financialData,
      id,
      token,
    );

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Delete financial
export const deleteFinancial = createAsyncThunk(
  "financial/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await financialService.deleteFinancial(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get financial summary
export const getFinancialSummary = createAsyncThunk(
  "financial/summary",
  async (filters, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await financialService.getFinancialSummary(filters, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

export const financialSlice = createSlice({
  name: "financial",
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

      // Create financial
      .addCase(createFinancial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFinancial.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.financials.unshift(action.payload);

        state.message = "Registro financeiro cadastrado com sucesso!";
      })
      .addCase(createFinancial.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Get all financials
      .addCase(getAllFinancials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFinancials.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.financials = action.payload;
      })
      .addCase(getAllFinancials.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Get financial by id
      .addCase(getFinancialById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFinancialById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.financial = action.payload;
      })
      .addCase(getFinancialById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Update financial
      .addCase(updateFinancial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFinancial.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.financials = state.financials.map((financial) => {
          if (financial._id === action.payload._id) {
            return action.payload;
          }

          return financial;
        });

        state.message = "Registro financeiro atualizado com sucesso!";
      })
      .addCase(updateFinancial.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Delete financial
      .addCase(deleteFinancial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFinancial.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.financials = state.financials.filter(
          (financial) => financial._id !== action.payload.id,
        );

        state.message = action.payload.message;
      })
      .addCase(deleteFinancial.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Get financial summary
      .addCase(getFinancialSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFinancialSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.summary = action.payload;
      })
      .addCase(getFinancialSummary.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetMessage, reset } = financialSlice.actions;

export default financialSlice.reducer;
