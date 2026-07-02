export const apiResponse = <T>(
  success: boolean,
  message: string,
  data?: T,
) => ({
  success,
  message,
  data,
});
