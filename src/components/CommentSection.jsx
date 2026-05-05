import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import CommentItem from "./CommentItem";

const createComment = async ({ content, parent_comment_id, post_id, user }) => {
  if (!user) {
    throw new Error("You must be logged in to comment");
  }

  const { error } = await supabase.from("comments").insert({
    content,
    parent_comment_id,
    post_id,
    user_id: user.id,
    author: user.user_metadata?.user_name || "Anonymous",
  });

  if (error) throw new Error(error.message);
};
const fetchComments = async (postId) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

function CommentSection({ postId }) {
  const [newCommentText, setNewCommentText] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setNewCommentText("");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newCommentText.trim()) return;

    mutate({
      content: newCommentText,
      parent_comment_id: null,
      post_id: postId,
      user,
    });
  };

  // Map of comments
  const buildCommentTree = (flatComments) => {
    const map = new Map();
    const roots = [];

    //create map
    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    //build tree
    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children.push(map.get(comment.id));
        }
      } else {
        roots.push(map.get(comment.id));
      }
    });

    return roots;
  };

  if (isLoading) {
    return <div className="text-gray-400">Loading votes...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error: {error.message}</div>;
  }

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>
      {/* Create Comment */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newCommentText}
            rows={3}
            placeholder="Write a comment..."
            onChange={(e) => setNewCommentText(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={isPending || !newCommentText.trim()}
            className="px-4 py-2 rounded-lg bg-purple-500 text-white cursor-pointer hover:bg-purple-400 transition"
          >
            {isPending ? "Posting..." : "Post Comment"}
          </button>

          {isError && (
            <p className="text-red-400 text-sm">Error posting comment</p>
          )}
        </form>
      ) : (
        <p className="text-gray-400">You must be logged in to post a comment</p>
      )}
      {/* display comments */}
      <div className="mt-4">
        {commentTree.length === 0 ? (
          <p className="text-gray-400">No comments yet</p>
        ) : (
          commentTree.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;
