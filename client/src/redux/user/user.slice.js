import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedin : false,
  user : {}
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setuser : (state, action)=>{
        const payload = action.payload
        state.isLoggedin = true
        state.user = payload
    },
    removeuser : (state)=>{
        state.isLoggedin = false
        state.user = {}
    }
  },
})

export const {setuser, removeuser} = userSlice.actions
export default userSlice.reducer
