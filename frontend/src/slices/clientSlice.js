import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import clientService from "../services/clientService";

const initialState = {
  clients: [],
  client: {},
  error: null,
  success: false,
  loading: false,
  message: null,
};

// Create client
export const createClient = createAsyncThunk(
  "client/create",
  async (client, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await clientService.createClient(client, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Get all clients
export const getAllClients = createAsyncThunk(
  "client/getall",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await clientService.getAllClients(token);

    return data;
  }
);

// Get client by id
export const getClientById = createAsyncThunk(
  "client/get",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await clientService.getClientById(id, token);

    return data;
  }
);

// Update client
export const updateClient = createAsyncThunk(
  "client/update",
  async ({ id, clientData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await clientService.updateClient(
      clientData,
      id,
      token
    );

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Delete client
export const deleteClient = createAsyncThunk(
  "client/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await clientService.deleteClient(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const clientSlice = createSlice({
  name: "client",
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

      // CREATE
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.clients.unshift(action.payload);

        state.message = "Cliente cadastrado com sucesso.";
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL
      .addCase(getAllClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.clients = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.clients || [];
      })
      .addCase(getAllClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(getClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.client = action.payload;
      })

      // UPDATE
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.clients = state.clients.map((client) =>
          client._id === action.payload._id
            ? action.payload
            : client
        );

        state.message = "Cliente atualizado com sucesso.";
      })

      // DELETE
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.clients = state.clients.filter(
          (client) => client._id !== action.payload.id
        );

        state.message = action.payload.message;
      });
  },
});

export const { resetMessage, reset } = clientSlice.actions;

export default clientSlice.reducer;