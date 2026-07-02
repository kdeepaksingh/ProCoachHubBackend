export const sendEmail = async (to: string, subject: string, text: string) => {
  console.log("[EMAIL]", { to, subject, text });
  return true;
};
