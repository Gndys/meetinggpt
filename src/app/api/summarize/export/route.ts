import PDFDocument from "pdfkit";
import type PDFKit from "pdfkit";
import { respErr } from "@/lib/resp";

export const runtime = "nodejs";

type MeetingInfo = {
  title?: string;
  type?: string;
  focus?: string;
  participants?: string;
};

export async function POST(req: Request) {
  try {
    const { summary, meetingInfo }: { summary?: string; meetingInfo?: MeetingInfo } =
      await req.json();

    if (!summary || typeof summary !== "string" || !summary.trim()) {
      return respErr("summary is required");
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      info: {
        Title: meetingInfo?.title || "会议摘要",
        Author: "慧会纪要 · Gemini 3 Pro",
        Creator: "慧会纪要",
      },
    });

    const pdfBuffer = await renderSummary(doc, summary, meetingInfo);
    const filename = buildFilename(meetingInfo?.title);

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("export summary failed", error);
    return respErr("export summary failed");
  }
}

async function renderSummary(
  doc: PDFKit.PDFDocument,
  summary: string,
  meetingInfo?: MeetingInfo
) {
  const chunks: Buffer[] = [];

  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const title = meetingInfo?.title?.trim() || "会议纪要";
  doc.font("Helvetica-Bold").fontSize(18).text(title, {
    align: "left",
  });

  doc.moveDown(0.3);
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#555555")
    .text(`导出时间：${new Date().toLocaleString()}`);

  if (meetingInfo?.participants) {
    doc.text(`主要发言人：${meetingInfo.participants}`);
  }
  if (meetingInfo?.focus) {
    doc.text(`重点议题：${meetingInfo.focus}`);
  }
  if (meetingInfo?.type) {
    doc.text(`会议类型：${meetingInfo.type}`);
  }

  doc.moveDown();
  doc.fillColor("#000000");

  const paragraphs = markdownToPlainParagraphs(summary);
  paragraphs.forEach((paragraph) => {
    doc.text(paragraph, {
      align: "left",
    });
    doc.moveDown(0.35);
  });

  doc.end();

  return await new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    doc.on("error", (err) => reject(err));
  });
}

function markdownToPlainParagraphs(markdown: string) {
  return markdown
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`+/g, "")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/^#+\s+/gm, "")
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

function buildFilename(title?: string) {
  const safeTitle = title
    ? title.replace(/[\\/:*?"<>|]/g, "_").slice(0, 60)
    : "meeting-summary";

  return `${safeTitle || "meeting-summary"}.pdf`;
}
