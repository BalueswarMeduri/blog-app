import React, { useEffect, useState } from 'react'
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { usefetch } from '../hooks/usefetch';
import { getenv } from '../helper/getenv';
import { useSelector } from 'react-redux';
import { showToast } from '../helper/showToast';

const LikeCout = ({props}) => {
  const [LikeCout, setLikeCout] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const user = useSelector(state => state.user)

   const {
          data : blogLikeCount,
          loading,
          error
        } = usefetch(`${getenv("BACKEND")}/blog-like/get-like/${props.blogid}/${user && user.isLoggedin ? user.user._id : 'guest'}`, {
          method: "GET",
          credentials: "include"
        });
        useEffect(()=>{
          if(blogLikeCount){
            setLikeCout(blogLikeCount.likecount);
            setHasLiked(blogLikeCount.isUserliked);
          }
        }, [blogLikeCount])
        const handleLike = async()=>{
          try {
            if(!user.isLoggedin){
              return showToast('error', 'Please login, to like a blog');
            }
            const response = await fetch(`${getenv("BACKEND")}/blog-like/like`, {
              method: "POST",
              credentials: "include",
              body: JSON.stringify({user : user.user._id, blogid : props.blogid}),
              headers: {
                'Content-Type': 'application/json'
              }
            });
            if(!response.ok){
              showToast('error', response.statusText);
              return;
            }
            const responsedta = await response.json();
            setLikeCout(responsedta.likecount);
            setHasLiked(!hasLiked)
          } catch (error) {
              showToast('error', error.message);
          }
        }
  return (
     <button onClick={handleLike} type='button' className='flex justify-between items-center gap-1 cursor-pointer'>
        {!hasLiked ? 
         <FaRegHeart className='text-gray-600' />
         :
         <FaHeart className='text-primary' />
        }
          
           {LikeCout}
    </button>
  )
}

export default LikeCout