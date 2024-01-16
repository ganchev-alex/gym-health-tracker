export const setToken = function (token: string) {
  localStorage.setItem("token", token);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem("expiration", expiration.toISOString());
};

export const getExpiryRate = function () {
  const localExpirationDate = localStorage.getItem("expiration");
  if (localExpirationDate) {
    const expirationDate = new Date(localExpirationDate);
    const current = new Date();
    return expirationDate.getTime() - current.getTime();
  }

  return 0;
};

export const getToken = function () {
  const localToken = localStorage.getItem("token");

  const expiryRate = getExpiryRate();
  if (expiryRate < 0) {
    return "TOKEN_EXPIRED";
  }
  return localToken;
};

export const deleteToken = function () {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
};
