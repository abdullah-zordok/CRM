import { Injectable } from "@nestjs/common";
import { inflateRawSync } from "node:zlib";

export type SpreadsheetFormat = "csv" | "xlsx";
export type SpreadsheetRow = Record<string, string>;

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

@Injectable()
export class LeadSpreadsheetService {
  parse(input: { fileName: string; contentBase64: string }): SpreadsheetRow[] {
    const buffer = Buffer.from(input.contentBase64, "base64");
    const lower = input.fileName.toLowerCase();
    if (lower.endsWith(".xlsx")) return this.parseXlsx(buffer);
    if (lower.endsWith(".csv")) return this.parseCsv(textDecoder.decode(buffer));
    throw new Error("Unsupported file format. Upload a .csv or .xlsx file.");
  }

  serialize(format: SpreadsheetFormat, rows: string[][]): Buffer {
    if (format === "xlsx") return this.writeXlsx(rows);
    return Buffer.from(this.writeCsv(rows), "utf8");
  }

  private parseCsv(input: string): SpreadsheetRow[] {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = "";
    let quoted = false;
    for (let index = 0; index < input.length; index += 1) {
      const char = input[index];
      const next = input[index + 1];
      if (quoted) {
        if (char === '"' && next === '"') {
          cell += '"';
          index += 1;
        } else if (char === '"') {
          quoted = false;
        } else {
          cell += char;
        }
        continue;
      }
      if (char === '"') {
        quoted = true;
      } else if (char === ",") {
        row.push(cell);
        cell = "";
      } else if (char === "\n") {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else if (char !== "\r") {
        cell += char;
      }
    }
    row.push(cell);
    rows.push(row);
    return this.toObjects(rows);
  }

  private writeCsv(rows: string[][]) {
    return rows
      .map((row) =>
        row
          .map((cell) => {
            const value = cell ?? "";
            return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
          })
          .join(","),
      )
      .join("\r\n");
  }

  private parseXlsx(input: Buffer): SpreadsheetRow[] {
    const files = unzip(input);
    const workbook = xml(files.get("xl/workbook.xml") ?? "");
    const rels = xml(files.get("xl/_rels/workbook.xml.rels") ?? "");
    const sheetMatch = workbook.match(/<sheet\b[^>]*r:id="([^"]+)"/);
    const relId = sheetMatch?.[1];
    const relMatch = relId
      ? rels.match(
          new RegExp(`<Relationship\\b[^>]*Id="${escapeRegExp(relId)}"[^>]*Target="([^"]+)"`),
        )
      : null;
    const target = relMatch?.[1] ?? "worksheets/sheet1.xml";
    const sheetPath = target.startsWith("xl/") ? target : `xl/${target}`;
    const sheet = xml(files.get(sheetPath) ?? files.get("xl/worksheets/sheet1.xml") ?? "");
    const sharedStrings = this.sharedStrings(xml(files.get("xl/sharedStrings.xml") ?? ""));
    const table: string[][] = [];
    for (const rowMatch of sheet.matchAll(/<row\b[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
      const rowIndex = Number(rowMatch[1] ?? "1") - 1;
      const values: string[] = [];
      for (const cellMatch of (rowMatch[2] ?? "").matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
        const attrs = cellMatch[1] ?? "";
        const body = cellMatch[2] ?? "";
        const ref = attrs.match(/\br="([A-Z]+)(\d+)"/)?.[1] ?? "A";
        const columnIndex = columnNumber(ref) - 1;
        const type = attrs.match(/\bt="([^"]+)"/)?.[1];
        const raw =
          body.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? body.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1] ?? "";
        values[columnIndex] = type === "s" ? (sharedStrings[Number(raw)] ?? "") : decodeXml(raw);
      }
      table[rowIndex] = values;
    }
    return this.toObjects(table.filter(Boolean));
  }

  private sharedStrings(input: string): string[] {
    return [...input.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((match) =>
      [...(match[1] ?? "").matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)]
        .map((text) => decodeXml(text[1] ?? ""))
        .join(""),
    );
  }

  private writeXlsx(rows: string[][]) {
    const sheetRows = rows
      .map(
        (row, rowIndex) =>
          `<row r="${rowIndex + 1}">${row
            .map(
              (value, columnIndex) =>
                `<c r="${columnName(columnIndex + 1)}${rowIndex + 1}" t="inlineStr"><is><t>${escapeXml(
                  value ?? "",
                )}</t></is></c>`,
            )
            .join("")}</row>`,
      )
      .join("");
    return zip([
      {
        path: "[Content_Types].xml",
        content: `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`,
      },
      {
        path: "_rels/.rels",
        content: `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
      },
      {
        path: "xl/workbook.xml",
        content: `<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Leads" sheetId="1" r:id="rId1"/></sheets></workbook>`,
      },
      {
        path: "xl/_rels/workbook.xml.rels",
        content: `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`,
      },
      {
        path: "xl/worksheets/sheet1.xml",
        content: `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`,
      },
    ]);
  }

  private toObjects(rows: string[][]): SpreadsheetRow[] {
    const [headers = [], ...records] = rows;
    const normalized = headers.map((header) => String(header ?? "").trim());
    return records
      .filter((row) => row.some((cell) => String(cell ?? "").trim()))
      .map((row) =>
        Object.fromEntries(
          normalized.map((header, index) => [header, String(row[index] ?? "").trim()]),
        ),
      );
  }
}

function unzip(input: Buffer): Map<string, Buffer> {
  const files = new Map<string, Buffer>();
  for (let offset = 0; offset < input.length - 30; ) {
    if (input.readUInt32LE(offset) !== 0x04034b50) {
      offset += 1;
      continue;
    }
    const method = input.readUInt16LE(offset + 8);
    const compressedSize = input.readUInt32LE(offset + 18);
    const fileNameLength = input.readUInt16LE(offset + 26);
    const extraLength = input.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const dataStart = nameStart + fileNameLength + extraLength;
    const name = input.subarray(nameStart, nameStart + fileNameLength).toString("utf8");
    const compressed = input.subarray(dataStart, dataStart + compressedSize);
    const data = method === 8 ? inflateRawSync(compressed) : compressed;
    files.set(name, data);
    offset = dataStart + compressedSize;
  }
  return files;
}

function zip(files: Array<{ path: string; content: string }>): Buffer {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;
  for (const file of files) {
    const name = Buffer.from(file.path, "utf8");
    const data = Buffer.from(textEncoder.encode(file.content));
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    localParts.push(local, name, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);
    offset += local.length + name.length + data.length;
  }
  const centralOffset = offset;
  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(centralOffset, 16);
  return Buffer.concat([...localParts, centralDirectory, end]);
}

function crc32(input: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of input) {
    crc ^= byte;
    for (let index = 0; index < 8; index += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function xml(input: Buffer | string) {
  return typeof input === "string" ? input : input.toString("utf8");
}

function columnNumber(name: string) {
  return [...name].reduce((total, char) => total * 26 + char.charCodeAt(0) - 64, 0);
}

function columnName(index: number) {
  let name = "";
  for (let value = index; value > 0; value = Math.floor((value - 1) / 26)) {
    name = String.fromCharCode(((value - 1) % 26) + 65) + name;
  }
  return name;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function decodeXml(value: string) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&gt;", ">")
    .replaceAll("&lt;", "<")
    .replaceAll("&amp;", "&");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
