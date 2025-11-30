import { respData, respErr } from "@/lib/resp";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

const TEXT_MIME_PREFIX = "text/";
const SUPPORTED_TEXT_TYPES = new Set([
  "text/plain",
  "text/markdown",
  "application/json",
  "application/x-subrip",
  "text/vtt",
]);

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const PDF_MIME = "application/pdf";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return respErr("file is required");
    }

    if (file.size > MAX_FILE_SIZE) {
      return respErr("file too large");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = (file.name || "").toLowerCase();
    const mime = (file.type || "").toLowerCase();

    let text = "";

    if (isPlainText(mime, filename)) {
      text = buffer.toString("utf-8");
    } else if (isDocx(mime, filename)) {
      const { value } = await mammoth.extractRawText({
        buffer,
      });

      text = value;
    } else if (isPdf(mime, filename)) {
      const parsed = await pdfParse(buffer);
      text = parsed.text;
    } else {
      return respErr("unsupported file type");
    }

    const normalized = normalizeText(text);

    if (!normalized) {
      return respErr("parsed content is empty");
    }

    return respData({
      text: normalized,
    });
  } catch (error) {
    console.error("parse transcript failed", error);
    return respErr("parse transcript failed");
  }
}

function isPlainText(mime: string, filename: string) {
  if (mime.startsWith(TEXT_MIME_PREFIX)) {
    return true;
  }

  if (SUPPORTED_TEXT_TYPES.has(mime)) {
    return true;
  }

  return (
    filename.endsWith(".txt") ||
    filename.endsWith(".md") ||
    filename.endsWith(".markdown") ||
    filename.endsWith(".srt") ||
    filename.endsWith(".vtt")
  );
}

function isDocx(mime: string, filename: string) {
  return mime === DOCX_MIME || filename.endsWith(".docx");
}

function isPdf(mime: string, filename: string) {
  return mime === PDF_MIME || filename.endsWith(".pdf");
}

function normalizeText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\u0000/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
