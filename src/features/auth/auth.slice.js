import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: localStorage.getItem('token'),
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload
      state.user = null
      localStorage.setItem('token', action.payload)
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
    }
  }
})

export const { loginSuccess, setUser, logout } = authSlice.actions
export default authSlice.reducer
