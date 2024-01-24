import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import i18n from "./constants/i18n.config";
import { store } from "./state/store";
import Navigation from "./Navigation";
import { Provider } from 'react-redux'



function App() {

  async function  getLanguage(){

    let data = await  AsyncStorage.getItem("lang")
    data = JSON.parse(data)
    let language = data?.key
      language !== '' && language &&  i18n.changeLanguage(language)
  }

 useEffect(()=>{
   getLanguage()
 }, [])

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

export default App;
