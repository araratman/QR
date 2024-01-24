import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getMode = createAsyncThunk(
    'mode',
    async ()=>{
        let data = await AsyncStorage.getItem("mode")
        if(data){
          return JSON.parse(data)
        }else{
          return false
        }
    }
)