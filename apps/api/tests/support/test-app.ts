import { Test } from "@nestjs/testing";
import { AppModule } from "../../src/app.module.js";

export async function createTestApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  return moduleRef.createNestApplication();
}
