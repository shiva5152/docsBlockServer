"use client";
import ClipboardJS from 'clipboard';
import React, { useState } from "react";
import { showAlert, useAuth } from "../context/AuthContext";
import CopyToClipboardButton from './ClickBoard';


export default function NavbarWithCTAButton({smartAccount,logout}:{smartAccount:any,logout:()=>void}) {
  const { showUpload,setShowUpload } = useAuth();
  


  const handleLogout=()=>{
    logout()
    showAlert("succ","You logged out successfully")
  }
  const handleVerify=()=>{
    setShowUpload((prev:boolean)=>!prev)
  }
  
  return (
    <nav className="w-full h-[5.4rem] shadow-lg p-1 py-2 flex items-center justify-between border-b-2">
      <div>
        <img className="w-[14rem]" src="/Logo.png" alt="" />
      </div>
      <div className="flex gap-[2rem] items-center mr-[4rem] ">
        <div  className="rounded-mg bg-slate-100  border-blue-800 border-2 py-2 px-4 rounded">
          
          <CopyToClipboardButton textToCopy={smartAccount?.address} />
        </div>
        <button onClick={handleVerify} className="bg-blue-800 hover:bg-blue-600  text-white font-semibold py-2 px-7 rounded focus:outline-none focus:shadow-outline">
          {showUpload ?"Dashboard":"Verify Document"}
        </button>
        <button onClick={handleLogout} className="bg-blue-800 hover:bg-blue-600  text-white font-semibold py-2 px-7 rounded focus:outline-none focus:shadow-outline">
          Logout
        </button>
      </div>
    </nav>
  );
}
