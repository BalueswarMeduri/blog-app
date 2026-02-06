import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { usefetch } from '../hooks/usefetch'
import { getenv } from '../helper/getenv'
import Loading from '../components/Loading'
import Blogcard from '../components/Blogcard'

const SearchResult = () => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q')
     const {
            data: blogData,
            loading,
            error,
          } = usefetch(`${getenv("BACKEND")}/blog/search?q=${query}`, {
            method: "GET",
            credentials: "include",
          });
          if(loading) return <Loading/>
  return (
    <>
     <div className='flex items-center gap-3 text-2xl font-bold text-primary border-b pb-3 mb-5'>
           <h4>
               Search Result for : {query}
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

export default SearchResult