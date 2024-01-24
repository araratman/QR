import { createSlice } from "@reduxjs/toolkit"
import { getMode } from "./modeApi"

const initialState = {
    mode: false
}

const modeSlice = createSlice({
    name: 'mode',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
            builder.addCase(getMode.pending, ()=>{

            })
            builder.addCase(getMode.fulfilled, (state, action)=>{
                    state.mode = action.payload
            })
    }
})

export default modeSlice.reducer