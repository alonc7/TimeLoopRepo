import React, { createContext, useState } from 'react'
export const MainContext = createContext()

function MainContextProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [taskList, setTaskList] = useState([]); // array of tasks 

  //HomeScreen method
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  const MainContextValues = {
    isLoading,
    setIsLoading,
    setAuthenticated,
    authenticated,
    setUserName,
    userName,
    userId,
    setUserId,
    userEmail,
    setUserEmail,
    capitalizeFirstLetter
  }
  return (
    <MainContext.Provider value={MainContextValues}>
      {children}
    </MainContext.Provider>
  )
}
export default MainContextProvider;



