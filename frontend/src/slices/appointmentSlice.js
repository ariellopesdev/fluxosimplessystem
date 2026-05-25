import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import appointmentService from "../services/appointmentService";

const initialState = {
  appointments: [],
  appointment: {},
  summary: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Create appointment
export const createAppointment = createAsyncThunk(
  "appointment/create",
  async (appointment, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await appointmentService.createAppointment(
      appointment,
      token,
    );

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get all appointments
export const getAllAppointments = createAsyncThunk(
  "appointment/getall",
  async (filters, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await appointmentService.getAllAppointments(filters, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get appointment by id
export const getAppointmentById = createAsyncThunk(
  "appointment/get",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await appointmentService.getAppointmentById(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Update appointment
export const updateAppointment = createAsyncThunk(
  "appointment/update",
  async ({ id, appointmentData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await appointmentService.updateAppointment(
      appointmentData,
      id,
      token,
    );

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Delete appointment
export const deleteAppointment = createAsyncThunk(
  "appointment/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await appointmentService.deleteAppointment(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get appointment summary
export const getAppointmentSummary = createAsyncThunk(
  "appointment/summary",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await appointmentService.getAppointmentSummary(token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

export const appointmentSlice = createSlice({
  name: "appointment",
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

      // Create appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.appointments.unshift(action.payload);

        state.message = "Agendamento cadastrado com sucesso!";
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Get all appointments
      .addCase(getAllAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.appointments = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Get appointment by id
      .addCase(getAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.appointment = action.payload;
      })
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Update appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.appointments = state.appointments.map((appointment) => {
          if (appointment._id === action.payload._id) {
            return action.payload;
          }

          return appointment;
        });

        state.message = "Agendamento atualizado com sucesso!";
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Delete appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.appointments = state.appointments.filter(
          (appointment) => appointment._id !== action.payload.id,
        );

        state.message = action.payload.message;
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Get appointment summary
      .addCase(getAppointmentSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointmentSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.summary = action.payload;
      })
      .addCase(getAppointmentSummary.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetMessage, reset } = appointmentSlice.actions;

export default appointmentSlice.reducer;