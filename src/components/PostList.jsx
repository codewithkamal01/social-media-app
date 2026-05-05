import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem";

// Fetch posts
const fetchPosts = async () => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");

  if (error) throw new Error(error.message);
  return data;
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading posts...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-400">Error: {error.message}</div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {data?.map((post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </div>
  );
};
