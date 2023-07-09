import React from "react";
import MainContextProvider from "./Components/Context/MainContextProvider";
import Main from "./Components/Main";

export default function App() {

  return (
    <MainContextProvider>
      <Main />
    </MainContextProvider>
    
  );

}




