import React from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import CommunitiesPage from "./pages/CommunitiesPage";
import CommunityPage from "./pages/CommunityPage";

function App() {
  return (
    <div>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/community/create" element={<CreateCommunityPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/community/:id" element={<CommunityPage />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
