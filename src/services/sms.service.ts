export const sendSms = async (to: string, message: string) => {
  console.log("[SMS]", { to, message });
  return true;
};
