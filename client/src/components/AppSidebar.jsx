import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { Link } from 'react-router-dom'
import { IoHomeOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { RiBloggerLine } from "react-icons/ri";
import { FaRegComments } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { GoDot } from "react-icons/go";
import { RouteBlog, RouteBlogByCategory, RouteCategoryDetails, RouteCommentsDetails, RouteIndex, RouteUser } from '../helper/RouteName';
import { usefetch } from '../hooks/usefetch';
import { getenv } from '../helper/getenv';
import { useSelector } from 'react-redux';


const AppSidebar = () => {
const user = useSelector((state) => state.user);
  const {
    data: categoryData
  } = usefetch(`${getenv("BACKEND")}/category/all-categories`, {
    method: "GET",
    credentials: "include",
  });

  return (
    <Sidebar>
      <SidebarHeader className="bg-[#fefdf8]" >
        <h1 className='text-4xl font-bold'>  <span className='text-yellow-400'>B</span>logify</h1>
      </SidebarHeader>
      <SidebarContent className="bg-[#fefdf8]">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem className="mt-5">
              <SidebarMenuButton>
                <IoHomeOutline />
                <Link to={RouteIndex}>Home</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {user && user.isLoggedin ? 
            <>
           
             <SidebarMenuItem>
              <SidebarMenuButton>
                <RiBloggerLine />
                <Link to={RouteBlog}>Blog</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FaRegComments />
                <Link to={RouteCommentsDetails}>Comments</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             </>
            :
            <></>
            }
            {user && user.isLoggedin && user.user.role == 'admin'
            ?
            <>
             <SidebarMenuItem>
              <SidebarMenuButton>
                <BiCategoryAlt />
                <Link to={RouteCategoryDetails}>Categories</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
           
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FiUsers />
                <Link to={RouteUser}>Users</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            </>
            :
            <></>
            }
           

          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            Categories
          </SidebarGroupLabel>
          <SidebarMenu>
            {categoryData && categoryData.categories && categoryData.categories.length > 0 &&
              categoryData.categories.map(category => (
                <SidebarMenuItem key={category._id}>
                  <SidebarMenuButton>
                    <GoDot />
                    <Link to={RouteBlogByCategory(category.slug)}>{category.name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent >
    </Sidebar >
  )
}

export default AppSidebar