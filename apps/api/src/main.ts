import "reflect-metadata";
import { createApiApp } from "./app.factory.js";

async function bootstrap() {
  const app = await createApiApp();
  const port = parseInt(process.env.PORT || "3501", 10);
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`Application is running on: http://localhost:${port}`);
}

void bootstrap();
