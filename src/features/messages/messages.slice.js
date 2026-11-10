import { createSlice } from '@reduxjs/toolkit'

const messagesSlice = createSlice({
  name: 'messages',
  initialState: { pending: null },
  reducers: {
    setPendingMessage: (state, action) => {
      state.pending = action.payload
    },
    clearPendingMessage: (state) => {
      state.pending = null
    }
  }
})

export const { setPendingMessage, clearPendingMessage } = messagesSlice.actions
export default messagesSlice.reducer
