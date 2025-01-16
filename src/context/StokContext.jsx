import React, { createContext, useState } from 'react';

const StokContext = createContext();

const StokProvider = ({ children }) => {
  const [stok, setStok] = useState([]);

  const addStok = (item) => {
    setStok([...stok, { ...item, id: Date.now() }]);
  };

  return (
    <StokContext.Provider value={{ stok, addStok }}>
      {children}
    </StokContext.Provider>
  );
};

export { StokContext, StokProvider };
