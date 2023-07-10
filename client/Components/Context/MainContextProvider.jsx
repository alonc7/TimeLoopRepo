import React, { createContext, useState } from 'react'
export const MainContext = createContext()

function MainContextProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState('');


  console.log('userName:', userName);

  const MainContextValues = {
    setAuthenticated,
    authenticated,
    setUserName,
    userName,
  }
  return (
    <MainContext.Provider value={MainContextValues}>
      {children}
    </MainContext.Provider>
  )
}
export default MainContextProvider;


