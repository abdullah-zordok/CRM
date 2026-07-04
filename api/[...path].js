module.exports = async function handler(req, res) {
  const { handleVercelRequest } = await import("../apps/api/dist/src/vercel.js");
  return handleVercelRequest(req, res);
};
