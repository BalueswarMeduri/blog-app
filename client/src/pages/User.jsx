import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { RouteAddCategory, RouteEditCategory } from "../helper/RouteName";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getenv } from "../helper/getenv";
import { usefetch } from "../hooks/usefetch";
import Loading from "../components/Loading";
import { FaRegEdit, FaUserCircle } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { showToast } from "../helper/showToast";
import { deleteData } from "../helper/handelDelete";
import { Card, CardContent } from "../components/ui/card";
import moment from "moment";


const User = () => {
  const [refresh, setRefresh] = useState(false)

  const {
    data,
    loading,
    error,
  } = usefetch(`${getenv("BACKEND")}/user/get-all-user`, {
    method: "GET",
    credentials: "include",
  },[refresh]);
  console.log(data)
  const handleDelet = async(id)=>{
    const success = await deleteData(`${getenv("BACKEND")}/user/delete/${id}`)
    if(success){
      setRefresh(!refresh)
      showToast("success", "User deleted successfully")
    }else{
      showToast("error", "Comment not deleted")
    }
  }
  
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  return (
    <div>
      <Card>
        <CardContent>
          <Table>
            <TableCaption>A list of all comments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Avatar</TableHead>
                <TableHead>Dated</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
           <TableBody>
  {data  && data.user.length > 0 ? (
    data.user.map((user) => (
      <TableRow key={user._id}>
        <TableCell>{user?.role}</TableCell>
        <TableCell>{user?.name}</TableCell>
         <TableCell>{user?.email}</TableCell>
         <TableCell>
            <img className="w-10 rounded-full" src={user?.avatar || <FaUserCircle />} alt="" />
         </TableCell>
        <TableCell>{moment(user?.createdAt).format("DD-MM-YYYY")}</TableCell>
        
        <TableCell className="flex gap-3">
          <Button onClick={() => handleDelet(user._id)} variant="outline" className="hover:bg-primary hover:text-white cursor-pointer" >
            <MdOutlineDelete />
          </Button>
          
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={5} className="text-center">
        Data not found
      </TableCell>
    </TableRow>
  )}
</TableBody>

          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default User;
