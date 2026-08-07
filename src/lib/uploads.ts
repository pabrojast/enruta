import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "text/plain",
]);

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export type UploadResult =
  | {
      ok: true;
      filePath: string;
      mimeType: string;
      sizeBytes: number;
      scanStatus: "clean" | "rejected";
    }
  | { ok: false; error: string };

/**
 * Validación de archivos estilo "antivirus ligero":
 * - tipo MIME permitido
 * - tamaño máximo
 * - firma mágica básica
 * - rechazo de extensiones peligrosas
 */
export async function validateAndStoreUpload(
  file: File,
  folder = "materials",
): Promise<UploadResult> {
  if (!file || file.size === 0) return { ok: false, error: "Archivo vacío" };
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Archivo supera 5 MB" };
  }

  const mime = file.type || "application/octet-stream";
  if (!ALLOWED_MIME.has(mime)) {
    return { ok: false, error: `Tipo no permitido: ${mime}` };
  }

  const original = file.name || "file";
  const ext = path.extname(original).toLowerCase();
  const dangerous = [
    ".exe",
    ".sh",
    ".bat",
    ".cmd",
    ".js",
    ".msi",
    ".dll",
    ".php",
  ];
  if (dangerous.includes(ext)) {
    return { ok: false, error: "Extensión bloqueada por política de seguridad" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!looksSafe(buffer, mime)) {
    return {
      ok: false,
      error: "Firma del archivo no coincide con el tipo declarado (posible amenaza)",
    };
  }

  const dir = path.join(process.cwd(), "uploads", folder);
  await mkdir(dir, { recursive: true });
  const safeName = `${Date.now()}-${randomBytes(6).toString("hex")}${ext || ""}`;
  const full = path.join(dir, safeName);
  await writeFile(full, buffer);

  return {
    ok: true,
    filePath: path.join("uploads", folder, safeName),
    mimeType: mime,
    sizeBytes: buffer.length,
    scanStatus: "clean",
  };
}

function looksSafe(buf: Buffer, mime: string): boolean {
  if (buf.length < 4) return false;
  // PDF
  if (mime === "application/pdf") {
    return buf.subarray(0, 4).toString("utf8") === "%PDF";
  }
  // JPEG
  if (mime === "image/jpeg") {
    return buf[0] === 0xff && buf[1] === 0xd8;
  }
  // PNG
  if (mime === "image/png") {
    return (
      buf[0] === 0x89 &&
      buf[1] === 0x50 &&
      buf[2] === 0x4e &&
      buf[3] === 0x47
    );
  }
  // WEBP (RIFF....WEBP)
  if (mime === "image/webp") {
    return (
      buf.subarray(0, 4).toString("utf8") === "RIFF" &&
      buf.subarray(8, 12).toString("utf8") === "WEBP"
    );
  }
  // MP4 often starts with ....ftyp
  if (mime === "video/mp4") {
    return buf.subarray(4, 8).toString("utf8") === "ftyp";
  }
  if (mime === "text/plain") {
    // reject high ratio of null bytes
    const sample = buf.subarray(0, Math.min(buf.length, 512));
    const nulls = sample.filter((b) => b === 0).length;
    return nulls < sample.length * 0.05;
  }
  return false;
}
