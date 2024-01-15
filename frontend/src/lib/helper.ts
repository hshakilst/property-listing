export const sanitizeParams = (
  param: string | undefined | null
): string | null => {
  if (!param) return null;
  if (!(typeof param === "string")) return null;
  if (Array.isArray(param)) return param[0];
  //More Checks Should Be Done

  return param;
};

export const fetcher = (url:string) => fetch(url).then((res) => res.json());