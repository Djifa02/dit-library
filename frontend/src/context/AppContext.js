import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <AppContext.Provider value={{ notification, notify }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
