import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { RouteAddCategory, RouteEditCategory } from "../../helper/RouteName";
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
import { getenv } from "../../helper/getenv";
import { usefetch } from "../../hooks/usefetch";
import Loading from "../../components/Loading";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { showToast } from "../../helper/showToast";
import { deleteData } from "../../helper/handelDelete";


const CategoryDetails = () => {
  const [refresh, setRefresh] = useState(false)

  const {
    data: categoryData,
    loading,
    error,
  } = usefetch(`${getenv("BACKEND")}/category/all-categories`, {
    method: "GET",
    credentials: "include",
  },[refresh]);

  const handleDelet = async(id)=>{
    const success = await deleteData(`${getenv("BACKEND")}/category/delete/${id}`)
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
              <Link to={RouteAddCategory}>Add Category</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
           <TableBody>
  {categoryData?.categories && categoryData.categories.length > 0 ? (
    categoryData.categories.map((category) => (
      <TableRow key={category._id}>
        <TableCell>{category.name}</TableCell>
        <TableCell>{category.slug}</TableCell>
        <TableCell className="flex gap-3">
          <Button variant="outline" className="hover:bg-primary hover:text-white cursor-pointer" asChild>
            <Link to={RouteEditCategory(category._id)}>

            <FaRegEdit />
            </Link>
          </Button>
          <Button onClick={() => handleDelet(category._id)} variant="outline" className="hover:bg-primary hover:text-white cursor-pointer" >
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
  );
};

export default CategoryDetails;
