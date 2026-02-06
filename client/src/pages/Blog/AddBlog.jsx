import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "../../components/ui/card";
import slugify from "slugify";
import { showToast } from "../../helper/showToast";
import { getenv } from "../../helper/getenv";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usefetch } from "../../hooks/usefetch";
import Dropzone from "react-dropzone";
import Editor from "../../components/Editor";
import AIGenerator from "@/components/AIGenerator";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RouteBlog } from "../../helper/RouteName";
import Loading from "@/components/Loading";

const AddBlog = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const {
    data: categoryData,
    loading,
    error,
  } = usefetch(`${getenv("BACKEND")}/category/all-categories`, {
    method: "GET",
    credentials: "include",
  });

  const [filePreview, setFilePreview] = useState();
  const [file, setFile] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    category: z.string().min(3, "category must be at least 8 character long"),
    title: z.string().min(3, "Title must be at least 8 character long"),
    slug: z.string().min(3, "Slug must be at least 8 character long"),
    blogContent: z
      .string()
      .min(3, "blog content must be at least 8 character long"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });

  const handleEditorData = (event, editor) => {
    const data = editor.getData();
    form.setValue("blogContent", data, { shouldValidate: true });
  };

  const handleAIContent = (generatedText) => {
    const current = form.getValues("blogContent") || "";
    const newContent = current + generatedText;
    form.setValue("blogContent", newContent, { shouldValidate: true });
  };

  const blogTitle = form.watch("title");
  useEffect(() => {
    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true });
      form.setValue("slug", slug);
    }
  }, [blogTitle]);

  // *** FIX STARTS HERE ***
  async function onSubmit(values) {
    try {
      // 1. Safety Check: Ensure user is logged in
      if (!user?.user?._id) {
        return showToast("error", "You must be logged in to post.");
      }

      // 2. Safety Check: Ensure file is selected
      if (!file) {
        showToast("error", "Featured Image is required");
        return; // <--- THIS RETURN WAS MISSING, CAUSING THE CRASH
      }

      const newValues = { ...values, author: user.user._id };

      const formData = new FormData();
      formData.append("file", file);
      formData.append("data", JSON.stringify(newValues));

      setIsSubmitting(true);
      const response = await fetch(`${getenv("BACKEND")}/blog/add`, {
        method: "post",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return showToast("error", data.message || "Something went wrong");
      }

      form.reset();
      setFile(null);
      setFilePreview(null);

      navigate(RouteBlog);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
      console.log(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }
  // *** FIX ENDS HERE ***

  const handlefileselection = (files) => {
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setFile(file);
    setFilePreview(preview);
  };

  if (loading || isSubmitting) return <Loading />;

  return (
    <div>
      <Card className="pt-5">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Add Blog</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Category Field */}
              <div className="pb-3">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryData?.categories?.length > 0 &&
                              categoryData.categories.map((category) => (
                                <SelectItem
                                  key={category._id}
                                  value={category._id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Title Field */}
              <div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Blog title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Slug Field */}
              <div className="mb-3">
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

              {/* Image Dropzone */}
              <div className="mb-3 block">
                <span>Featured Image</span>
                <Dropzone
                  onDrop={(acceptedFiles) => handlefileselection(acceptedFiles)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className="flex justify-center items-center w-36 h-28 border-2 border-dashed cursor-pointer rounded">
                        {filePreview ? (
                          <img
                            src={filePreview}
                            alt="preview"
                            className="h-full object-contain"
                          />
                        ) : (
                          <span>Upload</span>
                        )}
                      </div>
                    </div>
                  )}
                </Dropzone>
              </div>

              {/* Blog Content Field with AI Button */}
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="blogContent"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center pt-5 pb-2">
                        <FormLabel>Blog Content</FormLabel>
                        <AIGenerator onGenerate={handleAIContent} />
                      </div>
                      <FormControl>
                        <Editor
                          props={{
                            initialData: "",
                            onChange: handleEditorData,
                            value: field.value,
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full cursor-pointer">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;