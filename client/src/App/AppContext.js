import React from "react";


export const user = {
    username: '',
    role: '',
    user_id: 0,
    isLoggedIn: false
}

export const logOut = () => { };

const AppContext = React.createContext({ user, logOut });

export default AppContext;
