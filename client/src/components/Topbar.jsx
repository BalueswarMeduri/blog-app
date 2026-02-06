import React, { useState } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { IoIosLogIn } from "react-icons/io";
import SearchBox from "./SearchBox";
import { RouteAddBlog, RouteIndex, RouteProfile, RouteSignin } from "../helper/RouteName";
import { useSelector, useDispatch } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineNoteAdd } from "react-icons/md";
import { removeuser } from "../redux/user/user.slice";
import { showToast } from "../helper/showToast";
import { getenv } from "../helper/getenv";
import { IoMdSearch } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { useSidebar } from "./ui/sidebar";

const Topbar = () => {
  const {toggleSidebar} = useSidebar();
  const [searchBoxOpen, setSearchBoxOpen] = useState(false);  
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${getenv("BACKEND")}/auth/logout`, {
        method: "get", 
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.message);
        return;
      }

      dispatch(removeuser());
      navigate(RouteIndex);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
      console.log(error.message);
    }
  };

  const toggleSearch = () => {
   setSearchBoxOpen(!searchBoxOpen);
  };

  return (
    <div className="flex justify-between items-center h-16 fixed w-full z-20 bg-[#fcfbf8] px-5 border-b">
      <div className="flex justify-center items-center gap-2 ">
        <button onClick={toggleSidebar} type="button" className="cursor-pointer md:hidden">
          <IoMenu size={25}/>
        </button>
        <Link to={RouteIndex}>
        <h1 className="text-4xl font-bold">
          <span className="text-yellow-400">B</span>logify
        </h1>
        </Link>
        
      </div>

      <div className="w-[500px]">
        <div className={`md:relative md:block  absolute bg-white left-0 w-full md:top-0 top-16 md:p-0 p-5 ${searchBoxOpen ? "block" : "hidden"}`}>
          <SearchBox />
        </div>
        
      </div>

      <div className="flex items-center gap-5">
        <button onClick={toggleSearch} type="button" className="md:hidden block">
          <IoMdSearch size={25} className="md:w-auto w-10"/>
        </button>
        {!user.isLoggedin ? (
          <Button asChild>
            <Link to={RouteSignin}>
              <IoIosLogIn />
              Sign In
            </Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user.user.avatar} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>
                <p>{user.user.name}</p>
                <p className="text-sm">{user.user.email}</p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to = {RouteProfile}>
                  <FaRegUserCircle />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to={RouteAddBlog}>
                  <MdOutlineNoteAdd />
                  Add Blog
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Button onClick={handleLogout} variant="ghost" className="cursor-pointer">
                  <IoIosLogIn color="red" />
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Topbar;
