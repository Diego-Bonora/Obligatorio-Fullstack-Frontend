import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth.slice'
import categoriesReducer from '../features/categories/categories.slice'
import messagesReducer from '../features/messages/messages.slice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    messages: messagesReducer
  }
})

export default store
