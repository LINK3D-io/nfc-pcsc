import request from "./request";

// type TagType = "FORWARD" | "PHONE_EMAIL_REGISTRATION" | "DEFAULT";

//This makes a tag with the sponsorId and tagId
//The logged in user IE JWT token needs to be assoicated as a sponsor admin
// export const addTag = async (
//   sponsorId: number,
//   eventId: number | null,
//   tagId: string,
//   tagType: TagType
// ) => {
//   return request.post("/tags/addTag", { sponsorId, eventId, tagId, tagType });
// };

export const addTag = async (
  sponsorId,
  eventId,
  tagId,
  tagType
) => {
  return request.post("/tags/addTag", { sponsorId, eventId, tagId, tagType });
};
