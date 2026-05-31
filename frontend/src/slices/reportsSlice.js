import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportsService from "../services/reportsService";

const initialState = {
  reports: [],
  report: null,
  loading: false,
  error: false,
  message: null,
};

// Get all reports
export const getReports = createAsyncThunk(
  "reports/getall",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await reportsService.getReports(token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get report by id
export const getReportById = createAsyncThunk(
  "reports/getbyid",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await reportsService.getReportById(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Generate report
export const generateReport = createAsyncThunk(
  "reports/generate",
  async (reportData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await reportsService.generateReport(reportData, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Delete report
export const deleteReport = createAsyncThunk(
  "reports/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await reportsService.deleteReport(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return {
      id,
      message: data.message,
    };
  },
);

export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
      state.error = false;
    },
    resetReport: (state) => {
      state.report = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReports.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.reports = action.payload;
      })
      .addCase(getReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getReportById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.report = action.payload;
      })
      .addCase(getReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(generateReport.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.report = action.payload;
        state.reports.unshift(action.payload);
        state.message = "Relatório gerado com sucesso.";
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteReport.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.reports = state.reports.filter(
          (report) => report._id !== action.payload.id,
        );
        state.message = action.payload.message;
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMessage, resetReport } = reportsSlice.actions;
export default reportsSlice.reducer;