import React from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../../components/Loading';
import { usefetch } from '../../hooks/usefetch';
import { getenv } from '../../helper/getenv';
import Blogcard from '../../components/Blogcard';
import { BiCategory } from 'react-icons/bi';

const BlogByCategory = () => {
    const {category} = useParams()
  const {
        data: blogData,
        loading,
        error,
      } = usefetch(`${getenv("BACKEND")}/blog/get-blog-by-category/${category}`, {
        method: "GET",
        credentials: "include",
      },[category]);

      if(loading) return <Loading/>
  return (
    <>
    <div className='flex items-center gap-3 text-2xl font-bold text-primary border-b pb-3 mb-5'>
        <BiCategory/>
       <h4>
        {blogData && blogData.categoryData.name}
        </h4> 
    </div>
    <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 '>
       {blogData && blogData.blog.length > 0 ? blogData.blog.map((blog)=>(
        <Blogcard key={blog._id}  props={blog}/>
       )) : <p>No blog found</p>}
    </div>
    </>
    
  )
}

export default BlogByCategory