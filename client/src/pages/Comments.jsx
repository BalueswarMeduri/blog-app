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
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { showToast } from "../helper/showToast";
import { deleteData } from "../helper/handelDelete";
import { Card, CardContent } from "../components/ui/card";


const Comments = () => {
  const [refresh, setRefresh] = useState(false)

  const {
    data,
    loading,
    error,
  } = usefetch(`${getenv("BACKEND")}/comment/get-all-comments`, {
    method: "GET",
    credentials: "include",
  },[refresh]);

  const handleDelet = async(id)=>{
    const success = await deleteData(`${getenv("BACKEND")}/comment/delete/${id}`)
    if(success){
      setRefresh(!refresh)
      showToast("success", "Comment deleted successfully")
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
                <TableHead>Blog</TableHead>
                <TableHead>Comment By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
           <TableBody>
  {data  && data.comments.length > 0 ? (
    data.comments.map((comment) => (
      <TableRow key={comment._id}>
        <TableCell>{comment?.blogid?.title}</TableCell>
        <TableCell>{comment?.user?.name}</TableCell>
        <TableCell>{new Date(comment?.createdAt).toLocaleDateString()}</TableCell>
        <TableCell>{comment?.comment}</TableCell>
        
        <TableCell className="flex gap-3">
          <Button onClick={() => handleDelet(comment._id)} variant="outline" className="hover:bg-primary hover:text-white cursor-pointer" >
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

export default Comments;
