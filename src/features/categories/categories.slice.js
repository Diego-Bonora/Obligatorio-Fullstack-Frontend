import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: []
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.list = action.payload
    }
  }
})

export const { setCategories } = categoriesSlice.actions
export default categoriesSlice.reducer
