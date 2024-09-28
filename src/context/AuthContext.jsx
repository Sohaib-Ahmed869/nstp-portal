import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(localStorage.getItem('userRole') || '');
    const [actions, setActions] = useState(JSON.parse(localStorage.getItem('userActions')) || []);

    useEffect(() => {
        localStorage.setItem('userRole', role);
        localStorage.setItem('userActions', JSON.stringify(actions));
    }, [role, actions]);

    const login = (role, actions = []) => {
        setRole(role);
        setActions(actions);
    };

    const logout = () => {
        setRole('');
        setActions([]);
        localStorage.removeItem('userRole');
        localStorage.removeItem('userActions');
    };

    return (
        <AuthContext.Provider value={{ role, actions, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };


/**
|--------------------------------------------------
how to use

//import statmenet:
import { AuthContext } from '../context/AuthContext';
import React, { useContext } from 'react'; //REMMEBER TO IMPORT USECONTEXT


//add this inside component:
    const { login } = useContext(AuthContext);

//add this in the function when login happens
     if (role === 'admin') {
            setActions(['create', 'read', 'update', 'delete']); //example array
        }
        login(role, actions);


//for logout:
            const { logout } = useContext(AuthContext);
<button onClick={logout}>
            Logout
        </button>



//to access role or actions (conditional rendering)
import { AuthContext } from '../context/AuthContext';
const { role, actions } = useContext(AuthContext);

//then use `role`  variable wherever u like.



|--------------------------------------------------
*/