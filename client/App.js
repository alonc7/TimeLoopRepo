import React, { useRef } from 'react';
import DropdownAlert from 'react-native-dropdownalert';
import MainContextProvider from "./Components/Context/MainContextProvider";
import Main from "./Components/Main";
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertContext } from './Components/DropDown/AlertContext';

export default function App() {
  const dropDownAlertRef = useRef();

  return (
    <SafeAreaProvider>
      <MainContextProvider>
        <PaperProvider theme={DefaultTheme}>
          <AlertContext.Provider value={dropDownAlertRef}>
            <Main />
            <DropdownAlert ref={dropDownAlertRef} />
          </AlertContext.Provider>
        </PaperProvider>
      </MainContextProvider>
    </SafeAreaProvider>

  );
}