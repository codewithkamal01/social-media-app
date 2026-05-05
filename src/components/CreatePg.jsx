import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { fetchCommunities } from "./CommunityList";

// Create post function
const createPost = async (post, imageFile) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  // Upload image
  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  // Get public URL
  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  // Insert into database
  const { data, error } = await supabase.from("posts").insert({
    ...post,
    image_url: publicURLData.publicUrl,
  });

  if (error) throw new Error(error.message);

  return data;
};

function CreatePg() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [communityId, setCommunityId] = useState(null);

  const { user } = useAuth();

  const { data: communities } = useQuery({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data) => {
      return createPost(data.post, data.imageFile);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata?.avatar_url || null,
        community_id: communityId,
      },
      imageFile: selectedFile,
    });

    // optional reset
    setTitle("");
    setContent("");
    setSelectedFile(null);
  };

  const handleCommunityChange = (e) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mb-10 mt-4 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg space-y-5"
    >
      {/* Title */}
      <div>
        <label htmlFor="title" className="block mb-2 text-sm text-gray-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your post title..."
          className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block mb-2 text-sm text-gray-300">
          Content
        </label>
        <textarea
          id="content"
          required
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here..."
          className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
      </div>
      {/* community selection */}
      <div>
        <label className="block mb-2 text-sm text-gray-300">
          Select Community
        </label>

        <select
          id="community"
          onChange={handleCommunityChange}
          className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white 
               focus:outline-none focus:ring-2 focus:ring-purple-500 
               appearance-none cursor-pointer"
        >
          <option value="" className="bg-black text-gray-300">
            -- Choose a Community --
          </option>

          {communities?.map((community) => (
            <option
              key={community.id}
              value={community.id}
              className="bg-black text-white"
            >
              {community.name}
            </option>
          ))}
        </select>
      </div>
      {/* Image Upload */}
      <div>
        <label className="block mb-2 text-sm text-gray-300">Upload Image</label>

        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-purple-400 transition">
          <span className="text-gray-400 text-sm">
            Click to upload or drag & drop
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Preview */}
        {selectedFile && (
          <div className="mt-3">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="preview"
              className="h-32 rounded-lg object-cover border border-white/10"
            />
            <p className="text-xs text-gray-400 mt-1">{selectedFile.name}</p>
          </div>
        )}
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition active:scale-95"
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>

      {isError && <p className="text-red-500">Error creating post</p>}
    </form>
  );
}

export default CreatePg;
