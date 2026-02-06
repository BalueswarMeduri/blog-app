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


const AddCategory = () => {
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

  const categoryName = form.watch('name')
    useEffect(()=>{
      if(categoryName){
        const slug = slugify(categoryName, {lower: true})
        form.setValue('slug', slug) 
      }
    },[categoryName])

  async function onSubmit(values) {
    try {
      const response = await fetch(`${getenv('BACKEND')}/category/add`, {
        method : 'post',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(values)
      })
      const data = await response.json();
      if(!response.ok){
        showToast("error", data.message)
        console.log(data.message)
      }
      form.reset();
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

export default AddCategory;
