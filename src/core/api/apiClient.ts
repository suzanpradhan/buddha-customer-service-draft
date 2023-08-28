export const getHeaders = (token?: string, multipart: boolean = false) => {
  return {
    headers: {
      ...(token && { authorization: `Bearer ${token}` }),
      'Access-Control-Allow-Origin': '*',
      'content-type': multipart ? 'multipart/form-data' : 'application/json',
    },
  };
};
