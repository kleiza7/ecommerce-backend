export const getUrlWithBaseUrl = (url: string) => {
  const base = process.env.BASE_URL || "";

  return `${base}${url}`;
};
