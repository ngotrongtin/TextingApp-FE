import React, { createContext, useState } from "react";

export const ActiveChatContext = createContext();

export const ActiveChatProvider = ({ children }) => {
  const [active, setActive] = useState(null);

  return (
    <ActiveChatContext.Provider value={{ active, setActive }}>
      {children}
    </ActiveChatContext.Provider>
  );
};
