import React from "react";
import { PostList } from "../components/PostList";

function Home() {
  return (
    <div className="pt-20">
      <h2 className="text-2xl uppercase font-bold mb-6 text-center bg-purple-700 bg-clip-text text-transparent">
        Recent Posts
      </h2>
      
      <div>
        <PostList />
      </div>
    </div>
  );
}

export default Home;
