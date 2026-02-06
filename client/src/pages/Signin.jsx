import React from "react";
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
import { RouteIndex, RouteSignup } from "../helper/RouteName";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { showToast } from '../helper/showToast';
import { getenv } from '../helper/getenv.js';
import { useDispatch } from "react-redux";
import { setuser } from "../redux/user/user.slice.js";
import GoogleLogin from "../components/GoogleLogin.jsx";

const Signin = () => {

  const dispatch = useDispatch()

  const navigate = useNavigate();
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 character long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
     try {
              const response = await fetch(`${getenv("BACKEND")}/auth/login`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(values),
              });
              const data = await response.json();
              if (!response.ok) {
                return showToast("error", data.message);
              }
              dispatch(setuser(data.user))
              navigate(RouteIndex)
              showToast("success", data.message)
            } catch (error) {
              showToast("error", error.message)
               console.log(error.message)
            }
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen ">
      <Card className="w-[400px] p-5">
        <Link to={RouteIndex}>
                <h1 className="flex items-center justify-center text-2xl font-bold">
                  <span className="text-yellow-400">B</span>logify
                </h1>
                </Link>
        <h1 className="text-2xl font-bold text-center mb-2">
          Login Into Account
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter you email address" {...field} />
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
                      <Input placeholder="Enter you password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-5">
              <Button type="submit" className="w-full cursor-pointer">
                Sign In
              </Button>
              <div className="mt-5 text-sm flex justify-center items-center gap-2">
                <p>Don&apos;t have account?</p>
                <Link className="text-yellow-400 hover:underline" to = {RouteSignup}>Sign Up</Link>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Signin;
