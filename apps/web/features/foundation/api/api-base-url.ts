export function getBrowserApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
}

export function getServerApiBaseUrl() {
  const configured = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (configured?.startsWith("/")) {
    return `${getServerOrigin()}${configured}`;
  }
  return configured ?? "http://localhost:3501";
}

function getServerOrigin() {
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
}
