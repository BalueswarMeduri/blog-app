import React from 'react'
import { usefetch } from '../hooks/usefetch';
import { getenv } from '../helper/getenv';
import Loading from './Loading';
import { Avatar, AvatarImage } from './ui/avatar';
import moment from 'moment';
import { useSelector } from 'react-redux';

const CommentsList = ({ props }) => {
  const user = useSelector((state) => state.user)
  const {
    data,
    loading,
    error
  } = usefetch(`${getenv("BACKEND")}/comment/get/${props.blogid}`, {
    method: "GET",
    credentials: "include"
  });
  if (loading) return <Loading />

  return (
    <div>
      <h4 className='text-2xl font-bold'>
        {props.newComment ?
          <span className='me-2'>  {data ? data.comments.length + 1 : 1} </span>
          :
          <span className='me-2'>{data ? data.comments.length : 0}</span>
        }
        Comments</h4>
      <div className='mt-5'>
        {props.newComment &&
          <div className='flex gap-2 items-center mb-4'>
            <Avatar>
              <AvatarImage src={user?.user?.avatar} />
            </Avatar>
            <div>
              <p className='font-bold'>{user?.user?.name}</p>
              <p>{moment(props.newComment?.createdAt).format("DD/MM/YYYY")}</p>
              <div className='pt-3'>
                <p>{props?.newComment.comment}</p>
              </div>
            </div>
          </div>
        }
        {data && data?.comments?.length > 0 &&
          data.comments.map(comment => (
            <div key={comment._id} className='flex gap-2 items-center mb-4'>
              <Avatar>
                <AvatarImage src={comment?.user?.avatar} />
              </Avatar>
              <div>
                <p className='font-bold'>{comment?.user?.name}</p>
                <p>{moment(comment?.createdAt).format("DD/MM/YYYY")}</p>
                <div className='pt-3'>
                  <p>{comment?.comment}</p>
                </div>
              </div>
            </div>
          ))
        }

      </div>
    </div>
  )
}

export default CommentsList