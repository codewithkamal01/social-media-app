import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

// Vote function
const vote = async (voteValue, postId, userId) => {
  const { data: existingVote, error: fetchError } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);

  if (existingVote) {
    if (existingVote.vote === voteValue) {
      // remove vote
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    } else {
      // update vote
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);

      if (error) throw new Error(error.message);
    }
  } else {
    // insert new vote
    const { error } = await supabase.from("votes").insert({
      post_id: postId,
      user_id: userId,
      vote: voteValue,
    });

    if (error) throw new Error(error.message);
  }
};

// Fetch votes
const fetchVotes = async (postId) => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);

  if (error) throw new Error(error.message);
  return data;
};

const LikeButton = ({ postId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: votes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
    enabled: !!postId, // prevents undefined calls
  });

  const {
    mutate,
    isPending,
    isError,
    error: mutationError,
  } = useMutation({
    mutationFn: (voteValue) => {
      if (!user) {
        alert("Please login first");
        return;
      }
      return vote(voteValue, postId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", postId] });
    },
  });

  if (isLoading) {
    return <div className="text-gray-400">Loading votes...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error: {error.message}</div>;
  }

  const likes = votes?.filter((v) => v.vote === 1).length || 0;
  const dislikes = votes?.filter((v) => v.vote === -1).length || 0;
  const userVote = votes?.find((v) => v.user_id === user?.id)?.vote;

  return (
    <div className="flex items-center gap-2 ">
      <button
        onClick={() => mutate(1)}
        disabled={isPending}
        className={`px-4 py-1 rounded-lg transition ${
          userVote === 1
            ? "bg-green-500 text-white"
            : "bg-white/10 text-gray-300 hover:bg-green-500/20"
        }`}
      >
        👍 {likes}
      </button>

      <button
        onClick={() => mutate(-1)}
        disabled={isPending}
        className={`px-4 py-1 rounded-lg transition ${
          userVote === -1
            ? "bg-red-500 text-white"
            : "bg-white/10 text-gray-300 hover:bg-red-500/20"
        }`}
      >
        👎 {dislikes}
      </button>

      {mutationError && (
        <p className="text-red-400 text-sm">{mutationError.message}</p>
      )}
    </div>
  );
};

export default LikeButton;
