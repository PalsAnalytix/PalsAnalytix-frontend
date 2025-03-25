import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Async thunks
export const createPaymentOrder = createAsyncThunk(
  'payment/createOrder',
  async (planDetails, { rejectWithValue }) => {
    try {
      // Calculate amount in paise (₹1 = 100 paise)
      // const amountInPaise = planDetails.price * 100;
      const amountInPaise = 1 * 100;
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/payments/create-order`,
        {
          amount: amountInPaise,
          currency: 'INR',
          notes: {
            planName: planDetails.name,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'authorization' : `Bearer ${token}`,
          }
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/payments/verify`,
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
            'authorization' : `Bearer ${token}`,
          }
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

export const upgradeUserSubscription = createAsyncThunk(
  'payment/upgradeSubscription',
  async (subscriptionData, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/users/upgrade-subscription`,
        subscriptionData,
        {
          headers: {
            'Content-Type': 'application/json',
            'authorization' : `Bearer ${token}`,            
          }
        }
      );
      
      // Update the user in the auth slice with the upgraded subscription data
      if (response.data && response.data.user) {
        dispatch({
          type: 'auth/updateUserAfterSubscription',
          payload: {
            currentSubscriptionPlan: subscriptionData.planName,
            subscriptionDetails: response.data.user.subscriptionDetails || {
              planName: subscriptionData.planName,
              startDate: new Date().toISOString(),
              paymentId: subscriptionData.paymentId,
              orderId: subscriptionData.orderId
            }
          }
        });
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);

const initialState = {
  currentOrder: null,
  paymentStatus: null,
  loading: false,
  error: null,
  successMessage: null
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.currentOrder = null;
      state.paymentStatus = null;
      state.error = null;
      state.successMessage = null;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create order cases
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to create payment order';
      })
      
      // Verify payment cases
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = 'success';
        state.successMessage = 'Payment verified successfully';
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.paymentStatus = 'failed';
        state.error = action.payload?.error || 'Payment verification failed';
      })
      
      // Upgrade subscription cases
      .addCase(upgradeUserSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upgradeUserSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Subscription upgraded successfully';
      })
      .addCase(upgradeUserSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to upgrade subscription';
      })
      
  }
});

export const { resetPaymentState, setPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;