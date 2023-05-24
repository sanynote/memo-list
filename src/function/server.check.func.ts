export const serverCheck = () => {
  if (!navigator.onLine) {
    throw {
      code: 'auth/network-request-failed'
    };
  }
}
