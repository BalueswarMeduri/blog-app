import React from 'react'
import Loading from '../components/Loading'
import { usefetch } from '../hooks/usefetch';
import { getenv } from '../helper/getenv';
import Blogcard from '../components/Blogcard';

const index = () => {
  const {
        data: blogData,
        loading,
        error,
      } = usefetch(`${getenv("BACKEND")}/blog/blogs`, {
        method: "GET",
        credentials: "include",
      });
      if(loading) return <Loading/>
  return (
    <div className='grid md:grid-cols-3 sm:grid-cols-1 gap-10'>
       {blogData && blogData.blog.length > 0 ? blogData.blog.map((blog)=>(
        <Blogcard key={blog._id}  props={blog}/>
       )) : <p>No blog found</p>}
    </div>
  )
}

export default index