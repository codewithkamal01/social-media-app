import React from "react";
import CreateCommunity from "../components/CreateCommunity";
import CommunityList from "../components/CommunityList";

function CommunitiesPage() {
  return (
    <div className="pt-18">
      <h2 className="text-2xl uppercase font-bold text-center bg-purple-600 bg-clip-text text-transparent">
        Cummunities
      </h2>
      <CommunityList />
    </div>
  );
}

export default CommunitiesPage;
