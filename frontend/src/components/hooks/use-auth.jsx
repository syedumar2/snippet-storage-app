"use client"
import { useContext } from "react"
import { AuthContext } from "../auth-provider"
export function useAuth(){
    const context = useContext(AuthContext)
    if(context == undefined){
        throw new Error('useAuth must be user within an authprovider')
    }
    return context
}