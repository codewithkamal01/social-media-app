import React from "react";
import PostDetail from "../components/PostDetail";
import { useParams } from "react-router";

function PostPage() {
  const { id } = useParams();

  return (
    <div className="pt-20">
      <PostDetail postId={id} />
    </div>
  );
}

export default PostPage;
