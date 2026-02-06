import React from 'react'
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "../components/ui/card";
import { RouteSignin, RouteSignup } from "../helper/RouteName";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { showToast } from '../helper/showToast';
import { getenv } from '../helper/getenv.js';
import GoogleLogin from '../components/GoogleLogin.jsx';

const Signup = () => {
    const navigate = useNavigate();
    
    const formSchema = z.object({
        name : z.string().min(3, "Name must be at least 8 character long"),
        email: z.string().email(),
        password: z.string().min(8, "Password must be at least 8 character long"),
        confirmPassword : z.string().refine(data => data.password === data.confirmPassword,  'Password not match')
      });
    
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name : "",
          email: "",
          password: "",
          confirmPassword : "",
        },
      });
    
      async function onSubmit(values) {
        try {
          const response = await fetch(`${getenv('BACKEND')}/auth/register`, {
            method : 'post',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(values)
          })
          const data = await response.json();
          if(!response.ok){
            showToast("error", data.message)
            console.log(data.message)
          }
          navigate(RouteSignin)
          showToast("success", data.message)
        } catch (error) {
          showToast("error", error.message)
           console.log(error.message)
        }
      }
  return (
    <div className="flex justify-center items-center h-screen w-screen ">
      <Card className="w-[400px] p-5">
        <h1 className="text-2xl font-bold text-center mb-5">
          Create Your Account
        </h1>
        <div className=''>
          <GoogleLogin/>
            <div className='border-1 my-5 flex justify-center items-center'>
              <span className='absolute bg-white text-sm'>or</span>
            </div>
        </div>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className = "pt-5">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter you email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className = "pt-5">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter you password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div>
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className = "pt-5">Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-5">
              <Button type="submit" className="w-full cursor-pointer">
                Sign Up
              </Button>
              <div className="mt-5 text-sm flex justify-center items-center gap-2">
                <p>Already have account?</p>
                <Link className="text-yellow-400 hover:underline" to = {RouteSignin}>Sign In</Link>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default Signup