import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RouteAddBlog, RouteEditBlog } from '../../helper/RouteName';
import Loading from '../../components/Loading';
import { usefetch } from '../../hooks/usefetch';
import { getenv } from '../../helper/getenv';
import { deleteData } from '../../helper/handelDelete';
import { showToast } from '../../helper/showToast';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import moment from 'moment';

const BlogDetails = () => {
  const [refresh, setRefresh] = useState(false)
  
    const {
      data: blogData,
      loading,
      error,
    } = usefetch(`${getenv("BACKEND")}/blog/get-all`, {
      method: "GET",
      credentials: "include",
    },[refresh]);
  
    const handleDelet = async(id)=>{
      const success = await deleteData(`${getenv("BACKEND")}/blog/delete/${id}`)
      if(success){
        setRefresh(!refresh)
        showToast("success", "Category deleted successfully")
      }else{
        showToast("error", "Category not deleted")
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
        <CardHeader>
          <div>
            <Button asChild>
              <Link to={RouteAddBlog}>Add Blog</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Dated</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
           <TableBody>
  {blogData && blogData.blog.length > 0 ? (
    blogData.blog.map((blog) => (
      <TableRow key={blog._id}>
        <TableCell>{blog?.author?.name}</TableCell>
        <TableCell>{blog?.category?.name}</TableCell>
        <TableCell>{blog?.title}</TableCell>
        <TableCell>{blog?.slug}</TableCell>
        <TableCell>{moment(blog?.createdAt).format("DD/MM/YYYY")}</TableCell>
       
        <TableCell className="flex gap-3">
          <Button variant="outline" className="hover:bg-primary hover:text-white cursor-pointer" asChild>
            <Link to={RouteEditBlog(blog._id)}>

            <FaRegEdit />
            </Link>
          </Button>
          <Button onClick={() => handleDelet(blog._id)} variant="outline" className="hover:bg-primary hover:text-white cursor-pointer" >
            <MdOutlineDelete />
          </Button>
          
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={3} className="text-center">
        Data not found
      </TableCell>
    </TableRow>
  )}
</TableBody>

          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogDetails