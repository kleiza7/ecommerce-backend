export const getUrlWithBaseUrl = (url: string) => {
  if (!url) return url;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const base = process.env.BASE_URL || "";
  return `${base}${url}`;
};
