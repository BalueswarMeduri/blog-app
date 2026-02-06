import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "../../components/ui/card";
import slugify from "slugify";
import { showToast } from "../../helper/showToast";
import { getenv } from "../../helper/getenv";
import { useParams } from "react-router-dom";
import { usefetch } from "../../hooks/usefetch";


const EditCategory = () => {
  const {category_id} = useParams();
  
  const {data:categoryData, loading, error} = usefetch(`${getenv('BACKEND')}/category/show/${category_id}`, {
    method : 'get',
    credentials : 'include'
  }, [category_id])

  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 8 character long"),
    slug: z.string().min(3, "Slug must be at least 8 character long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  useEffect(()=>{
    const categoryname = form.watch('name')
        if(categoryname){
            const slug = slugify(categoryname, {lower: true})
            form.setValue('slug', slug) 
        }
  },[]) 

   const categoryName = form.watch('name')
  useEffect(()=>{
    if(categoryName){
      const slug = slugify(categoryName, {lower: true})
      form.setValue('slug', slug) 
    }
  },[categoryName])

  useEffect(()=>{
    if(categoryData){
      form.setValue('name', categoryData.category.name)
      form.setValue('slug', categoryData.category.slug)
    }
  },[categoryData])

  async function onSubmit(values) {
    try {
      const response = await fetch(`${getenv('BACKEND')}/category/update/${category_id}`, {
        method : 'put',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(values)
      })
      const data = await response.json();
      if(!response.ok){
        showToast("error", data.message)
        console.log(data.message)
      }

      showToast("success", data.message)
    } catch (error) {
      showToast("error", error.message)
       console.log(error.message)
    }
  }

  return (
    <div>
      <Card className="pt-5 max-w-screen-md mx-auto">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter you name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="pt-5">Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="slug..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full cursor-pointer">
                submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;
