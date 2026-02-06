import React, { useState } from 'react'
import { FaRegComments } from "react-icons/fa";
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
import { Button } from "@/components/ui/button";
import {z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getenv } from '../helper/getenv';
import { showToast } from '../helper/showToast';
import { Textarea } from "./ui/textarea";
import { useSelector } from 'react-redux';
import { RouteSignin } from '../helper/RouteName';
import { Link } from 'react-router-dom';
import CommentsList from './CommentsList';

const Comments = ({props}) => {
    const [newComment, setNewComment] = useState(null)
    const user = useSelector((state)=>state.user)
    console.log(user)
    const formSchema = z.object({
        comment: z.string().min(3, "comment must be at least 8 character long"),
      });
    
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          comment: "",
        },
      });
       async function onSubmit(values) {
          try {
            const newValues = {...values, blogid : props.blogid, user : user?.user?._id}
            const response = await fetch(`${getenv('BACKEND')}/comment/add`, {
              method : 'post',
              credentials : 'include',
              headers : {'Content-Type' : 'application/json'},
              body : JSON.stringify(newValues)
            })
            const data = await response.json();
            if(!response.ok){
              showToast("error", data.message)
              console.log(data.message)
            }
            setNewComment(data.newcomment)
            form.reset();
            showToast("success", data.message)
          } catch (error) {
            showToast("error", error.message)
             console.log(error.message)
          }
        }
  return (
    <div>
        <h4 className='flex items-center gap-2 text-2xl font-bold'><FaRegComments className='text-primary'/>Comments</h4>
        {user && user.isLoggedin
        ?
        <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div>
                        <FormField
                          control={form.control}
                          name="comment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="pt-3">Comment</FormLabel>
                              <FormControl>
                               <Textarea placeholder="Enter your comment" {...field}/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                     
        
                      <Button type="submit" className="cursor-pointer mt-5">
                        submit
                      </Button>
                    </form>
                  </Form>
                  :
                  <Button asChild>
                    <Link to = {RouteSignin}>Signin</Link>
                  </Button>
        }
        <div className='mt-5'>
            {<CommentsList props={{blogid : props.blogid, newComment}}/>}
        </div>
          
    </div>
  )
}

export default Comments