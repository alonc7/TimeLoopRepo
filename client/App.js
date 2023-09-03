import React from 'react';
import MainContextProvider from "./Components/Context/MainContextProvider";
import Main from "./Components/Main";
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainContextProvider>
          <PaperProvider theme={DefaultTheme}>
            <Main />
          </PaperProvider>
        </MainContextProvider>
      </NavigationContainer>
    </SafeAreaProvider >

  );
}