import request from "./request";

//This makes a tag with the sponsorId and tagId
//The logged in user IE JWT token needs to be assoicated as a sponsor admin
export const addTag = async (
  sponsorId,
  tagId,
) => {
  return request.post("/tags/addTag", { sponsorId, tagId });
};
