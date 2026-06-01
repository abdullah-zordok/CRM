import { readFile } from "node:fs/promises";
import YAML from "yaml";
export async function loadOpenApiContract(path) {
  const content = await readFile(path, "utf8");
  return YAML.parse(content);
}
