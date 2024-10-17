import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(localStorage.getItem('userRole') || '');
    const [permissions, setPermissions] = useState(JSON.parse(localStorage.getItem('userActions')) || []);
    const [evalRequested, setEvalRequested] = useState(false); //only for tenant

    useEffect(() => {
        localStorage.setItem('userRole', role);
        localStorage.setItem('userActions', JSON.stringify(permissions));
        localStorage.setItem('evalRequested', evalRequested);
    }, [role, permissions]);

    const login = (role, actions = [], evalRequested) => {
        console.log("IN LOGIN ATH CONTEXT", evalRequested);
        setRole(role);
        setPermissions(actions);
        setEvalRequested(evalRequested);
    };

    const logout = () => {
        setRole(null);
        setPermissions([]);
        setEvalRequested(false);
        localStorage.removeItem('userRole');
        localStorage.removeItem('userActions');
        localStorage.removeItem('evalRequested');
    };

    return (
        <AuthContext.Provider value={{ role, permissions, evalRequested, setEvalRequested, login, logout }}>
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