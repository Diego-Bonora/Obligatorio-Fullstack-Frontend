import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth.slice'
import categoriesReducer from '../features/categories/categories.slice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer
  }
})

export default store
