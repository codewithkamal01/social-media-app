import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import PostItem from "./PostItem";

// Fetch posts by community
export const fetchCommunityPost = async (communityId) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const CommunityDisplay = ({ communityId }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
    enabled: !!communityId, // ✅ important
  });

  if (isLoading) {
    return (
      <div className="text-center py-4 text-gray-400">
        Loading community posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );
  }

  const communityName = data?.[0]?.communities?.name || "Community";

  return (
    <div>
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {communityName} Posts
      </h2>

      {data && data.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No posts in this community yet.
        </p>
      )}
    </div>
  );
};
export default CommunityDisplay;
