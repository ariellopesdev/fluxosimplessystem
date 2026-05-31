import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dashboardService from "../services/dashboardService";

const initialState = {
  dashboard: null,
  latestDashboard: null,

  summary: null,
  charts: {
    financialEvolution: [],
    salesEvolution: [],
    appointmentStatus: [],
    topProducts: [],
    topClients: [],
  },
  alerts: [],
  recentActivities: [],

  loading: false,
  error: false,
  success: false,
  message: null,
};

// Get dashboard by filters
export const getDashboard = createAsyncThunk(
  "dashboard/get",
  async (filters, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await dashboardService.getDashboard(filters, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get latest dashboard
export const getLatestDashboard = createAsyncThunk(
  "dashboard/latest",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await dashboardService.getLatestDashboard(token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Delete dashboard
export const deleteDashboard = createAsyncThunk(
  "dashboard/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await dashboardService.deleteDashboard(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return {
      id,
      message: data.message,
    };
  },
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
      state.error = false;
      state.success = false;
    },

    resetDashboard: (state) => {
      state.dashboard = null;
      state.latestDashboard = null;
      state.summary = null;
      state.charts = {
        financialEvolution: [],
        salesEvolution: [],
        appointmentStatus: [],
        topProducts: [],
        topClients: [],
      };
      state.alerts = [];
      state.recentActivities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboard.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;

        state.dashboard = action.payload;
        state.summary = action.payload?.summary || null;
        state.charts = action.payload?.charts || {
          financialEvolution: [],
          salesEvolution: [],
          appointmentStatus: [],
          topProducts: [],
          topClients: [],
        };
        state.alerts = action.payload?.alerts || [];
        state.recentActivities = action.payload?.recentActivities || [];
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getLatestDashboard.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getLatestDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;

        state.latestDashboard = action.payload;
        state.dashboard = action.payload;
        state.summary = action.payload?.summary || null;
        state.charts = action.payload?.charts || {
          financialEvolution: [],
          salesEvolution: [],
          appointmentStatus: [],
          topProducts: [],
          topClients: [],
        };
        state.alerts = action.payload?.alerts || [];
        state.recentActivities = action.payload?.recentActivities || [];
      })
      .addCase(getLatestDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteDashboard.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.message = action.payload.message;

        if (state.dashboard?._id === action.payload.id) {
          state.dashboard = null;
          state.summary = null;
          state.charts = {
            financialEvolution: [],
            salesEvolution: [],
            appointmentStatus: [],
            topProducts: [],
            topClients: [],
          };
          state.alerts = [];
          state.recentActivities = [];
        }

        if (state.latestDashboard?._id === action.payload.id) {
          state.latestDashboard = null;
        }
      })
      .addCase(deleteDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetMessage, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;