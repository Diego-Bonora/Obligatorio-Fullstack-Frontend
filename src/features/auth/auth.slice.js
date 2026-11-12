import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: localStorage.getItem('token'),
  user: null,
  // True right after signing up: PublicOnlyRoute sends the user to the welcome step instead of the feed.
  isNewUser: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload
      state.user = null
      state.isNewUser = false
      localStorage.setItem('token', action.payload)
    },
    registerSuccess: (state, action) => {
      state.token = action.payload
      state.user = null
      state.isNewUser = true
      localStorage.setItem('token', action.payload)
    },
    clearNewUser: (state) => {
      state.isNewUser = false
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.token = null
      state.user = null
      state.isNewUser = false
      localStorage.removeItem('token')
    }
  }
})

export const { loginSuccess, registerSuccess, clearNewUser, setUser, logout } = authSlice.actions
export default authSlice.reducer
