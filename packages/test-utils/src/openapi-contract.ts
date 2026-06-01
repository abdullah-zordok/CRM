import { readFile } from "node:fs/promises";
import YAML from "yaml";

export type OpenApiContract = {
  paths: Record<string, Record<string, unknown>>;
};

export async function loadOpenApiContract(path: string): Promise<OpenApiContract> {
  const content = await readFile(path, "utf8");
  return YAML.parse(content) as OpenApiContract;
}
