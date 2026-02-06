import React from 'react'
import { getenv } from '../helper/getenv'
import { usefetch } from '../hooks/usefetch';
import Loading from './Loading';
import { Link } from 'react-router-dom';
import { RouteBlogDetails } from '../helper/RouteName';

const RelatedBlog = ({props}) => {
    const {data, loading, error} = usefetch(`${getenv('BACKEND')}/blog/get-related-blogs/${props.category}/${props.currentBlog}`, {
                  method : 'get',
                  credentials : 'include'
                })
            console.log(data);
            if(loading) return <Loading/>
  return (
    <div className="border rounded p-5 inline-block w-full">
        <h2 className='text-2xl font-bold mb-5'>Related Blogs</h2>
        <div>
            {data && data.relatedblog.length > 0
                ? 
                data.relatedblog.map((blog) => {
                    return (
                        <Link key={blog._id} to={RouteBlogDetails(props.category, blog.slug)}>
                        <div key={blog._id} className='flex items-center gap-2 mb-3'>
                            <img className='w-[100px] h-[70px] object-cover rounded-md' src={blog.featuredImage} />
                            <h4 className='line-clamp-2 text-lg font-semibold'>{blog.title}</h4>
                        </div>
                        </Link>
                    )
                })
                :
                <div>No related blogs found</div>
                }
        </div>
    </div>
  )
}

export default RelatedBlog