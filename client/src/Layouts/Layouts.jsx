import React from 'react'
import {Outlet} from 'react-router-dom'
import { SidebarProvider } from '../components/ui/sidebar'
import AppSidebar from '../components/AppSidebar'
import Topbar from '../components/Topbar'
import Footer from '../components/Footer'

const Layouts = () => {
  return (
    //topbar
    //sidebar
    <SidebarProvider>
        <Topbar/>
        <AppSidebar/>
    <main className=' w-full'>
        <div className='w-full min-h-[calc(100vh-35px)] py-28 px-10'>
            <Outlet/>
        </div>
        <Footer/>
    </main>
    </SidebarProvider>
  )
}

export default Layouts