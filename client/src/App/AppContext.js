import React from "react";


export const logOut = () => { };
export const login = () => { };

const AppContext = React.createContext({ logOut, login });

export default AppContext;
