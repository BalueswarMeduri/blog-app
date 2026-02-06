import React from "react";
import { usefetch } from "../hooks/usefetch";
import { getenv } from "../helper/getenv";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { decode } from "entities";
import Comments from "../components/Comments";
import CommentsList from "../components/CommentsList";
import moment from "moment";
import CommentCount from "../components/CommentCount";
import LikeCout from "../components/LikeCout";
import RelatedBlog from "../components/RelatedBlog";
import AISummarizer from "../components/AISummarizer";

const SingleBlogDetails = () => {
  const { blog, category } = useParams();

  const { data, loading, error } = usefetch(
    `${getenv("BACKEND")}/blog/get-blog/${blog}`,
    {
      method: "GET",
      credentials: "include",
    },
    [blog, category],
  );

  if (loading) return <Loading />;

  return (
    <div className="md:flex-nowrap flex-wrap flex justify-between gap-20">
      {data && data.blog && (
        <>
          <div className="border rounded md:w-[70%] w-full p-5">
            <h1 className="text-2xl font-bold mb-5">{data?.blog?.title}</h1>
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center gap-5">
                <Avatar>
                  <AvatarImage src={data?.blog?.author?.avatar} />
                </Avatar>
                <div>
                  <p>{data?.blog?.author?.name}</p>
                  <p>
                    Date : {moment(data?.blog?.createdAt).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center gap-5">
                <LikeCout props={{ blogid: data?.blog?._id }} />
                <CommentCount props={{ blogid: data?.blog?._id }} />
              </div>
            </div>
            <div className="my-5">
              <img src={data?.blog?.featuredImage} alt="" className="rounded" />
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: decode(data?.blog?.blogContent) || "",
              }}
            ></div>
            <div className="border-t mt-5 pt-5">
              <Comments props={{ blogid: data?.blog?._id }} />
            </div>
            {/* <div className='border-t mt-5 pt-5'>
                <CommentsList props={{blogid : data?.blog?._id}}/>
            </div> */}
          </div>
        </>
      )}
      <div className="md:w-[30%] flex flex-col gap-6">
  <RelatedBlog props={{ category: category, currentBlog: blog }} />

  <AISummarizer content={data?.blog?.blogContent} />
</div>
    </div>
  );
};

export default SingleBlogDetails;
