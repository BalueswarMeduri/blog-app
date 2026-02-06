import React from 'react'
import { usefetch } from '../hooks/usefetch';
import { getenv } from '../helper/getenv';
import Loading from './Loading';
import { FaRegComment } from "react-icons/fa";

const CommentCount = ({props}) => {
     const {
        data,
        loading,
        error
      } = usefetch(`${getenv("BACKEND")}/comment/get-count/${props.blogid}`, {
        method: "GET",
        credentials: "include"
      });
      if(loading) return <Loading/>
  return (
    <button type='button' className='flex justify-between items-center gap-1'>
        <FaRegComment />
      {data?.commentCount} 
    </button>
  )
}

export default CommentCount