import React from "react";
import CreatePg from "../components/CreatePg";

function CreatePost() {
  return (
    <div className="pt-18">
      <h2 className="text-2xl uppercase font-bold text-center bg-purple-600 bg-clip-text text-transparent">
        Create New Post
      </h2>
      <CreatePg />
    </div>
  );
}

export default CreatePost;
