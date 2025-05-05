'use client'
import { login } from "@/redux/slices/auth";
import { AppDispatch } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
export default function (){
    const session = useSession()
    const dispatch = useDispatch<AppDispatch>()
   useEffect(() => {
     if(session.data?.user){
       dispatch(login(session.data.user))
     }
     
   }, [session,dispatch])
   
   return null
}