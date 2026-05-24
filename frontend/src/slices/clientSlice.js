import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import clientService from "../services/clientService";

const initialState = {
  clients: [],
  client: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Create client
export const createClient = createAsyncThunk(
  "client/create",
  async (client, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await clientService.createClient(
      client,
      token,
    );

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get all clients
export const getAllClients = createAsyncThunk(
  "client/getall",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await clientService.getAllClients(token);

    return data;
  },
);

// Get client by id
export const getClientById = createAsyncThunk(
  "client/getbyid",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await clientService.getClientById(
      id,
      token,
    );

    return data;
  },
);

// Update client
export const updateClient = createAsyncThunk(
  "client/update",
  async (clientData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await clientService.updateClient(
      clientData,
      token,
    );

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Delete client
export const deleteClient = createAsyncThunk(
  "client/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await clientService.deleteClient(
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

export const clientSlice = createSlice({
  name: "client",
  initialState,

  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },

    reset: (state) => {
      state.error = false;
      state.success = false;
      state.loading = false;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Create client
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = false;
      })

      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.clients.unshift(action.payload);

        state.message = "Cliente cadastrado com sucesso.";
      })

      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = true;

        state.message = action.payload;
      })

      // Get all clients
      .addCase(getAllClients.pending, (state) => {
        state.loading = true;
        state.error = false;
      })

      .addCase(getAllClients.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.clients = action.payload;
      })

      .addCase(getAllClients.rejected, (state, action) => {
        state.loading = false;
        state.error = true;

        state.message = action.payload;
      })

      // Get client by id
      .addCase(getClientById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })

      .addCase(getClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.client = action.payload;
      })

      .addCase(getClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = true;

        state.message = action.payload;
      })

      // Update client
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = false;
      })

      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.clients = state.clients.map((client) => {
          if (client._id === action.payload._id) {
            return action.payload;
          }

          return client;
        });

        state.message = "Cliente atualizado com sucesso.";
      })

      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = true;

        state.message = action.payload;
      })

      // Delete client
      .addCase(deleteClient.pending, (state) => {
        state.loading = true;
        state.error = false;
      })

      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.clients = state.clients.filter(
          (client) => client._id !== action.payload.id,
        );

        state.message = action.payload.message;
      })

      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false;
        state.error = true;

        state.message = action.payload;
      });
  },
});

export const { resetMessage, reset } =
  clientSlice.actions;

export default clientSlice.reducer;