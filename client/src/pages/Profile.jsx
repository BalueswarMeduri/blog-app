import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../helper/showToast";
import { getenv } from "../helper/getenv.js";
import { Textarea } from "@/components/ui/textarea";
import { usefetch } from "../hooks/usefetch.js";
import Loading from "../components/Loading.jsx";
import { CiCamera } from "react-icons/ci";
import Dropzone from "react-dropzone";
import { setuser } from "../redux/user/user.slice.js";

const Profile = () => {
  const [filePreview, setFilePreview] = useState();
  const [file, setFile] = useState();

  const user = useSelector((state) => state.user);
  const {
    data: userData,
    loading,
    error,
  } = usefetch(`${getenv("BACKEND")}/user/get-user/${user.user._id}`, {
    method: "get",
    credentials: "include",
  });

  console.log(userData);

  const dispatch = useDispatch();

  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email(),
    bio: z.string().min(3, "Bio must be at least 3 characters long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      password: "",
    },
  });

  useEffect(() => {
    if (userData && userData.success) {
      form.reset({
        name: userData.user.name,
        email: userData.user.email,
        bio: userData.user?.bio,
      });
    }
  }, [userData]);

  async function onSubmit(values) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(values));

      const response = await fetch(
        `${getenv("BACKEND")}/user/update-user/${userData.user._id}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        })
      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }
      dispatch(setuser(data.user));
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
      console.log(error.message);
    }
  }

  const handlefileselection = (files) => {
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setFile(file);
    setFilePreview(preview);
  };

  if (loading) return <Loading />;
  return (
    <Card className="max-w-screen-md mx-auto">
      <CardContent>
        <div className="flex justify-center items-center">
          <Dropzone
            onDrop={(acceptedFiles) => handlefileselection(acceptedFiles)}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Avatar className="w-28 h-28 relative group">
                  <AvatarImage
                    src={filePreview ? filePreview : userData?.user?.avatar}
                    className="border-4 border-yellow-500 rounded-full"
                  />
                  <div className="absolute inset-0 z-10 flex justify-center items-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full cursor-pointer">
                    <CiCamera className="text-yellow-500 w-8 h-8" />
                  </div>
                </Avatar>
              </div>
            )}
          </Dropzone>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="pt-5">Name</FormLabel>
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
                      <FormLabel className="pt-5">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter you email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="pt-5">Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter bio.." {...field} />
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
                      <FormLabel className="pt-5">Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter you password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full cursor-pointer mt-7">
                Save
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
