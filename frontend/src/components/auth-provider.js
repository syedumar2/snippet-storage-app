"use client"
import { createContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
export const AuthContext = createContext(
    {
        token: null,
        login: () => { },
        logout: () => { },
        isAuthenticated: false,
    }
);
export function AuthProvider({children}){
    const [token,setToken] = useState(null);
    const [ isLoaded, setIsLoaded ] = useState()
    const router = useRouter();
 

    useEffect(()=>{
        const storedToken = localStorage.getItem("auth_token");
        if(storedToken){
            setToken(storedToken);
        }
        setIsLoaded(true);

    },[])

    const login = newToken => {
        localStorage.setItem('auth_token',newToken);
        setToken(newToken)
        router.refresh();

    };
    const logout = () => {
        localStorage.removeItem('auth_token')
        
        router.refresh();
    }
    if (!isLoaded) {
        return null;
    }
    return (
        <AuthContext.Provider value={{
            token,
            login,
            logout,
            isAuthenticated: token ? true:false,
        }}>
            {children}
        </AuthContext.Provider>
        // AuthContext is a context object created earlier in your code using createContext()
        //.Provider is a special property of that context object. Every context in 
        // React comes with a Provider component, which is used to "provide" the context’s values to all the components nested inside it.
        //Together, they form a component block that wraps {children} (the nested components you want to have access to the context).
        //The value prop passes the data (token, login, logout, isAuthenticated) to any component inside this block that subscribes to AuthContext.
    )

}