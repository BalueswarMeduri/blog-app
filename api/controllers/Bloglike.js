import { Handelerror } from "../helpers/Handelerror.js";
import Bloglike from "../models/bloglike.model.js";
import client from "../redis/redisClient.js";

export const dolike = async (req, res, next) => {
  try {
    const { user, blogid } = req.body;
    let like;
    like = await Bloglike.findOne({ userid: user, blogid });
    if (!like) {
      const savelike = new Bloglike({
        userid: user,
        blogid,
      });
      like = await savelike.save();
    } else {
      await Bloglike.findByIdAndDelete(like._id);
    }
    const likecount = await Bloglike.countDocuments({ blogid });
    res.status(200).json({
      success: true,
      message: "Like toggled",
      likecount,
    });
  } catch (error) {
    next(Handelerror(500, error.message));
  }
};
export const likecount = async (req, res, next) => {
  try {
    const { blogid, userid } = req.params;
    const cachedLikeData = await client.get(`likecount:${blogid}:${userid || "guest"}`);

    if (cachedLikeData) {
      return res.status(200).json(JSON.parse(cachedLikeData));
    }

    const likecount = await Bloglike.countDocuments({ blogid });

    let isUserliked = false;

    if (userid && userid !== "guest") {
      const getuserlike = await Bloglike.countDocuments({ blogid, userid });
      if (getuserlike > 0) {
        isUserliked = true;
      }
    }

    const responseData = {
      likecount,
      isUserliked,
    };

    await client.set(
      `likecount:${blogid}:${userid || "guest"}`,
      JSON.stringify(responseData),
      { EX: 24 * 60 * 60 }
    );

    return res.status(200).json(responseData);

  } catch (error) {
    next(Handelerror(500, error.message));
  }
};
