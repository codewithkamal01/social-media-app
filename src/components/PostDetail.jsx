import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

const fetchPostbyId = async (id) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

function PostDetail({ postId }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostbyId(postId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60 text-gray-400">
        Loading post...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 mt-10">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mb-5">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg overflow-hidden">
        {/* Image */}
        {data?.image_url && (
          <img
            src={data.image_url}
            alt={data.title}
            className="w-full h-60 object-cover"
          />
        )}
        <div className="p-4 text-white space-y-2">
          {/* Title */}
          <h2 className="text-2xl font-bold leading-tight">{data?.title}</h2>

          {/* Date */}
          <p className="text-sm text-gray-400">
            Posted on {new Date(data?.created_at).toLocaleDateString()}
          </p>

          {/* Divider */}
          <div className="border-t border-white/10"></div>

          {/* Actions */}
          <div className="flex flex-col gap-2 text-sm">
            <LikeButton postId={postId} />
            <CommentSection postId={postId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
