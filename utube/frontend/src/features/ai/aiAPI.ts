import api from "../../services/api";

// Generate title suggestions
export const generateTitleSuggestionsAPI = async (description: string) => {
  const res = await api.post(
    "/ai/generate-title",
    { description },
    {
      withCredentials: true,
    }
  );
  return res.data.data;
};
