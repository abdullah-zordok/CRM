const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:3001";
const webBaseUrl = process.env.WEB_BASE_URL ?? "http://localhost:3000";

async function check(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Foundation verification failed for ${url}: ${response.status}`);
  }
}

async function main() {
  await check(`${apiBaseUrl}/health/live`);
  await check(`${apiBaseUrl}/health/ready`);
  await check(webBaseUrl);
  console.log("Foundation verification passed");
}

await main();
