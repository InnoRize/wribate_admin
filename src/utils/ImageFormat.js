const removeBaseURL = (url) => {
  const BASE_URL = "http://194.164.149.238:8000";
  return url.startsWith(BASE_URL) ? url.replace(BASE_URL, "") : url;
};
export default removeBaseURL;
