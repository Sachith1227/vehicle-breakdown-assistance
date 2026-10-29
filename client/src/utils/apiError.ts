// =====================================================
// FRIENDLY API ERROR MESSAGES
// =====================================================

export const getErrorMessage = (
  error: any,
  fallback: string
): string => {

  // Request never reached the server (offline, CORS, server down)
  if (error?.code === "ERR_NETWORK" || (error?.request && !error?.response)) {
    return "Can't reach the server. Check your internet connection and try again.";
  }

  const status = error?.response?.status;
  const serverMessage = error?.response?.data?.message;

  if (status >= 500) {
    return "Something went wrong on our side. Please try again in a moment.";
  }

  if (status === 409) {
    return "An account with this email already exists. Try logging in instead.";
  }

  return serverMessage || fallback;
};


export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
