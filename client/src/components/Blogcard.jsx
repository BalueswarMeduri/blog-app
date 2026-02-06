import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Avatar, AvatarImage } from "./ui/avatar";
import { FaRegUserCircle } from "react-icons/fa";
import moment from "moment";
import { Link } from "react-router-dom";
import { RouteBlogDetails } from "../helper/RouteName";

const Blogcard = ({ props }) => {
  const user = useSelector((state) => state.user);
  console.log(props)
  return (
    <Link to = {RouteBlogDetails(props?.category?.slug, props?.slug)}>
         <Card className="pt-5">
      <CardContent>
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex justify-between items-center gap-2">
            <Avatar>
              <AvatarImage src={props?.author?.avatar || <FaRegUserCircle />} />
            </Avatar>
            <span>{props?.author?.name}</span>
          </div>
          {props.author.role === "admin" && (
            <Badge variant="outline" className="bg-primary">
              Admin
            </Badge>
          )}
        </div>
        <div className="my-2">
          <img src={props?.featuredImage} alt="" className="rounded" />
        </div>
        {/* <div className="my-2 w-full max-w-xl">
  <img
    src={props?.featuredImage}
    alt=""
    className="w-full min-h-[200px] max-h-[400px] object-cover rounded"
  />
</div> */}

        <div>
          <p className="flex items-center gap-2 mb-2">
            <FaRegCalendarAlt />
            <span>{moment(props?.createdAt).format("DD/MM/YYYY")}</span>
          </p>
          <h2 className="text-2xl font-bold line-clamp-2">{props?.title}</h2>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default Blogcard;
