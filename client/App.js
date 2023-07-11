import React from "react";
import MainContextProvider from "./Components/Context/MainContextProvider";
import Main from "./Components/Main";
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

export default function App() {

  return (
    <MainContextProvider>
      <Main />
    </MainContextProvider>
    
  );

}




