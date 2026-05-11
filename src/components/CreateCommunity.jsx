import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";

const createCommunity = async (community) => {
  const { error, data } = await supabase
    .from("communities")
    .insert(community)
    .select();

  if (error) throw new Error(error.message);
  return data;
};

const CreateCommunity = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });

      // reset form
      setName("");
      setDescription("");

      navigate("/communities");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    mutate({
      name: name.trim(),
      description: description.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-10 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-3xl cursor-pointer font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Community
      </h2>

      {/* Name */}
      <div>
        <label className="block mb-2 text-sm text-gray-300">
          Community Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter community name..."
          className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-purple-500 outline-none"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 text-sm text-gray-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe your community..."
          className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-lg text-white font-medium hover:opacity-90 transition"
      >
        {isPending ? "Creating..." : "Create Community"}
      </button>

      {/* Error */}
      {isError && (
        <p className="text-red-400 text-center text-sm">
          {error?.message || "Error creating community"}
        </p>
      )}
    </form>
  );
};

export default CreateCommunity;
