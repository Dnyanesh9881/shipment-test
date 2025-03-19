import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useQuery } from 'react-query';

export function TopBar() {
    const [storeData, setStoreData]=useState("");
    const {data, refetch } = useQuery({
        queryKey: ["shop"],
        queryFn: async () => {
          const response = await fetch("/api/store/info");
          const data =await response.json()
          setStoreData(data);
          console.log("response.taa", data);
    
          return data;
        },
        refetchOnWindowFocus: false,
      });

    return (
        <div className='topbar-section'>
            <div className="logo-block">
                <img className='logo' src="../assets/logo.png" alt="logo image" />
                <h1 className='text-bold h4'>{storeData.name}</h1>
                <NavLink to="/"> Sales </NavLink>
                <NavLink to="/menu"> Orders </NavLink>
            </div>
        </div>
    )
}