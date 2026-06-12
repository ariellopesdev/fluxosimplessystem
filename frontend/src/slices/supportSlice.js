import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supportService from "../services/supportService";

const initialState = {
  tickets: [],
  myTickets: [],
  selectedTicket: null,

  loading: false,
  error: false,
  success: false,
  message: null,
};

// Create support ticket
export const createSupportTicket = createAsyncThunk(
  "support/create",
  async (ticketData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await supportService.createSupportTicket(ticketData, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get my support tickets
export const getMySupportTickets = createAsyncThunk(
  "support/my",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await supportService.getMySupportTickets(token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get all support tickets
export const getAllSupportTickets = createAsyncThunk(
  "support/all",
  async (filters, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await supportService.getAllSupportTickets(filters, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get support ticket by id
export const getSupportTicketById = createAsyncThunk(
  "support/getById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await supportService.getSupportTicketById(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Add support message
export const addSupportMessage = createAsyncThunk(
  "support/addMessage",
  async ({ id, messageData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await supportService.addSupportMessage(id, messageData, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Update support status
export const updateSupportStatus = createAsyncThunk(
  "support/updateStatus",
  async ({ id, statusData }, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await supportService.updateSupportStatus(
      id,
      statusData,
      token,
    );

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

export const markSupportTicketAsRead = createAsyncThunk(
  "support/markAsRead",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    const data = await supportService.markSupportTicketAsRead(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

export const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
      state.error = false;
      state.success = false;
    },

    resetSelectedTicket: (state) => {
      state.selectedTicket = null;
    },

    resetSupport: (state) => {
      state.tickets = [];
      state.myTickets = [];
      state.selectedTicket = null;
      state.loading = false;
      state.error = false;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSupportTicket.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(createSupportTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.message = action.payload.message;

        if (action.payload.support) {
          state.myTickets.unshift(action.payload.support);
          state.selectedTicket = action.payload.support;
        }
      })
      .addCase(createSupportTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getMySupportTickets.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getMySupportTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.myTickets = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getMySupportTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllSupportTickets.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getAllSupportTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.tickets = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllSupportTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSupportTicketById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getSupportTicketById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.selectedTicket = action.payload;
      })
      .addCase(getSupportTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addSupportMessage.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(addSupportMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.message = action.payload.message;

        if (action.payload.support) {
          state.selectedTicket = action.payload.support;

          state.myTickets = state.myTickets.map((ticket) =>
            ticket._id === action.payload.support._id
              ? action.payload.support
              : ticket,
          );

          state.tickets = state.tickets.map((ticket) =>
            ticket._id === action.payload.support._id
              ? action.payload.support
              : ticket,
          );
        }
      })
      .addCase(addSupportMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(updateSupportStatus.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(updateSupportStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.message = action.payload.message;

        if (action.payload.support) {
          state.selectedTicket = action.payload.support;

          state.tickets = state.tickets.map((ticket) =>
            ticket._id === action.payload.support._id
              ? action.payload.support
              : ticket,
          );

          state.myTickets = state.myTickets.map((ticket) =>
            ticket._id === action.payload.support._id
              ? action.payload.support
              : ticket,
          );
        }
      })
      .addCase(updateSupportStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(markSupportTicketAsRead.fulfilled, (state, action) => {
        if (action.payload.support) {
          state.selectedTicket = action.payload.support;

          state.myTickets = state.myTickets.map((ticket) =>
            ticket._id === action.payload.support._id
              ? action.payload.support
              : ticket,
          );

          state.tickets = state.tickets.map((ticket) =>
            ticket._id === action.payload.support._id
              ? action.payload.support
              : ticket,
          );
        }
      });
  },
});

export const { resetMessage, resetSelectedTicket, resetSupport } =
  supportSlice.actions;

export default supportSlice.reducer;
