import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import serviceService from "../services/serviceService";

const initialState = {
  services: [],
  service: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Create service
export const createService = createAsyncThunk(
  "service/create",
  async (service, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await serviceService.createService(service, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get all services
export const getServices = createAsyncThunk(
  "service/getall",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await serviceService.getServices(token);

    return data;
  },
);

// Get service by id
export const getServiceById = createAsyncThunk(
  "service/get",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await serviceService.getServiceById(id, token);

    return data;
  },
);

// Update service
export const updateService = createAsyncThunk(
  "service/update",
  async ({ id, serviceData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await serviceService.updateService(serviceData, id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Delete service
export const deleteService = createAsyncThunk(
  "service/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await serviceService.deleteService(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

export const serviceSlice = createSlice({
  name: "service",
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

      // Create service
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.services.unshift(action.payload);

        state.message = "Serviço cadastrado com sucesso!";
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Get services
      .addCase(getServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.services = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getServices.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Get service by id
      .addCase(getServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.service = action.payload;
      })
      .addCase(getServiceById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Update service
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.services = state.services.map((service) => {
          if (service._id === action.payload._id) {
            return action.payload;
          }

          return service;
        });

        state.message = "Serviço atualizado com sucesso!";
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.services = state.services.filter(
          (service) => service._id !== action.payload.id,
        );

        state.message = "Serviço excluído com sucesso!";
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetMessage, reset } = serviceSlice.actions;

export default serviceSlice.reducer;