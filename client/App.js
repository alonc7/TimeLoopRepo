import React from 'react';
import MainContextProvider from "./Components/Context/MainContextProvider";
import Main from "./Components/Main";
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {

  return (
    <SafeAreaProvider>
      <MainContextProvider>
        <PaperProvider theme={DefaultTheme}>
          <Main />
        </PaperProvider>
      </MainContextProvider>
    </SafeAreaProvider >

  );
}