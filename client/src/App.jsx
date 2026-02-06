import React from "react";
import { Button } from "./components/ui/button";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layouts from "./Layouts/Layouts";
import {
  RouteAddBlog,
  RouteAddCategory,
  RouteBlog,
  RouteBlogByCategory,
  RouteBlogDetails,
  RouteCategoryDetails,
  RouteCommentsDetails,
  RouteEditBlog,
  RouteEditCategory,
  RouteIndex,
  RouteProfile,
  RouteSearch,
  RouteSignin,
  RouteSignup,
  RouteUser,
} from "./helper/RouteName";
import Index from "./pages/index";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AddCategory from "./pages/Category/AddCategory";
import CategoryDetails from "./pages/Category/CategoryDetails";
import EditCategory from "./pages/Category/EditCategory";
import AddBlog from "./pages/Blog/AddBlog";
import EditBlog from "./pages/Blog/EditBlog";
import BlogDetails from "./pages/Blog/BlogDetails";
import SingleBlogDetails from "./pages/SingleBlogDetails";
import BlogByCategory from "./pages/Blog/BlogByCategory";
import SearchResult from "./pages/SearchResult";
import Comments from "./pages/Comments";
import User from "./pages/User";
import AuthRoutePortection from "./components/AuthRoutePortection";
import OnlyAdminAllowed from "./components/OnlyAdminAllowed";
const App = () => {
  return (
    <div className="bg-[#fcfbf8]">
      <BrowserRouter>
        <Routes>
          <Route path={RouteIndex} element={<Layouts />}>
            <Route index element={<Index />} />
            
            {/* blog Category */}
          

            {/* blog */}

            <Route path={RouteBlogDetails()} element={<SingleBlogDetails />} />
            <Route path={RouteBlogByCategory()} element={<BlogByCategory />} />
            <Route path={RouteSearch()} element={<SearchResult />} />
           
           

            <Route element={<AuthRoutePortection />}>
            <Route path={RouteProfile} element={<Profile />} />
              <Route path={RouteAddBlog} element={<AddBlog />} />
              <Route path={RouteBlog} element={<BlogDetails />} />
              <Route path={RouteEditBlog()} element={<EditBlog />} />
               <Route path={RouteCommentsDetails} element={<Comments />} />
            </Route>
             <Route element={<OnlyAdminAllowed />}>
                <Route path={RouteAddCategory} element={<AddCategory />} />
            <Route path={RouteCategoryDetails} element={<CategoryDetails />} />
            <Route path={RouteEditCategory()} element={<EditCategory />} />
             <Route path={RouteUser} element={<User />} />
            </Route>
          </Route>

          <Route path={RouteSignin} element={<Signin />} />
          <Route path={RouteSignup} element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
