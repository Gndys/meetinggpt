"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Markdown from "@/components/markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  BookOpenCheck,
  ClipboardCopy,
  Download,
  FileText,
  Info,
  Loader2,
  RefreshCw,
  Sparkles,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / (1024 * 1024);
const MAX_CHAR_COUNT = 80000;
const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const PDF_MIME = "application/pdf";
const TEXT_EXTENSIONS = [".txt", ".md", ".markdown", ".srt", ".vtt"];
const TEXT_MIME_TYPES = [
  "application/json",
  "application/x-subrip",
  "text/vtt",
  "text/plain",
  "text/markdown",
];
const ACCEPTED_FILE_TYPES =
  ".txt,.md,.markdown,.srt,.vtt,.docx,.pdf";

const sanitizeFilename = (value: string) =>
  value.replace(/[\\/:*?"<>|]/g, "_");

const isPlainTextFile = (file: File) => {
  const mime = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();

  if (mime.startsWith("text/") || TEXT_MIME_TYPES.includes(mime)) {
    return true;
  }

  return TEXT_EXTENSIONS.some((ext) => name.endsWith(ext));
};

const isDocxFile = (file: File) => {
  const mime = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();

  return mime === DOCX_MIME || name.endsWith(".docx");
};

const isPdfFile = (file: File) => {
  const mime = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();

  return mime === PDF_MIME || name.endsWith(".pdf");
};

type MeetingInfo = {
  title: string;
  type: string;
  focus: string;
  participants: string;
};

const meetingTypeKeys = [
  "strategy",
  "product",
  "sales",
  "supply",
  "review",
  "other",
] as const;

export default function TranscriptWorkbench() {
  const t = useTranslations("transcript_lab");

  const [meetingInfo, setMeetingInfo] = useState<MeetingInfo>({
    title: "",
    type: "",
    focus: "",
    participants: "",
  });
  const [tabValue, setTabValue] = useState<"upload" | "paste">("upload");
  const [transcript, setTranscript] = useState("");
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number }>();
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [summary, setSummary] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isBusy = isGenerating || isParsing;

  const characters = transcript.length;
  const words = transcript
    ? transcript
        .trim()
        .replace(/\s+/g, " ")
        .split(" ").filter(Boolean).length
    : 0;
  const estimatedTokens = characters > 0 ? Math.max(1, Math.round(characters / 4)) : 0;

  const timeline = useMemo(
    () => [
      {
        key: "collect",
        title: t("timeline.collect.title"),
        description: t("timeline.collect.description"),
      },
      {
        key: "analyze",
        title: t("timeline.analyze.title"),
        description: t("timeline.analyze.description"),
      },
      {
        key: "deliver",
        title: t("timeline.deliver.title"),
        description: t("timeline.deliver.description"),
      },
    ],
    [t]
  );

  const guideBullets = useMemo(
    () => [
      t("guide.bullet_1"),
      t("guide.bullet_2"),
      t("guide.bullet_3"),
      t("guide.bullet_4"),
      t("guide.bullet_5"),
    ],
    [t]
  );

  const progressIndex = useMemo(() => {
    if (isGenerating) {
      return 1;
    }

    if (summary) {
      return 2;
    }

    if (transcript) {
      return 1;
    }

    if (isParsing) {
      return 0;
    }

    return 0;
  }, [isGenerating, summary, transcript, isParsing]);

  const handleFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        t("toast.file_too_large", {
          max_mb: MAX_FILE_SIZE_MB,
        })
      );
      return;
    }

    if (isPlainTextFile(file)) {
      const text = await file.text();
      if (!text.trim()) {
        toast.error(t("toast.file_not_supported"));
        return;
      }

      if (text.length > MAX_CHAR_COUNT) {
        toast.error(
          t("toast.content_too_long", { max: MAX_CHAR_COUNT.toLocaleString() })
        );
        return;
      }

      setTranscript(text);
      setFileMeta({ name: file.name, size: file.size });
      setTabValue("paste");
      setSummary("");
      setLastUpdated(null);
      toast.success(t("toast.parse_success"));
      return;
    }

    if (isDocxFile(file) || isPdfFile(file)) {
      await parseDocumentFile(file);
      return;
    }

    toast.error(t("toast.parse_unsupported"));
  };

  const parseDocumentFile = async (file: File) => {
    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const resp = await fetch("/api/transcript/parse", {
        method: "POST",
        body: formData,
      });
      const result = await resp.json();

      if (result.code !== 0) {
        throw new Error(result.message || "parse failed");
      }

      const parsedText = result.data?.text as string;

      if (!parsedText || !parsedText.trim()) {
        throw new Error(t("toast.parse_failed"));
      }

      if (parsedText.length > MAX_CHAR_COUNT) {
        toast.error(
          t("toast.content_too_long", {
            max: MAX_CHAR_COUNT.toLocaleString(),
          })
        );
        return;
      }

      setTranscript(parsedText);
      setFileMeta({ name: file.name, size: file.size });
      setTabValue("paste");
      setSummary("");
      setLastUpdated(null);
      toast.success(t("toast.parse_success"));
    } catch (err: any) {
      console.error("parse document failed", err);
      toast.error(err.message || t("toast.parse_failed"));
    } finally {
      setIsParsing(false);
    }
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleFile(file);
    event.target.value = "";
  };

  const onDrop = async (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  const onDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleGenerate = async () => {
    if (!transcript.trim()) {
      toast.error(t("toast.need_transcript"));
      return;
    }

    setIsGenerating(true);
    try {
      const resp = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript,
          meetingInfo,
        }),
      });

      const result = await resp.json();
      if (result.code !== 0) {
        throw new Error(result.message || "summarize failed");
      }

      setSummary(result.data?.summary || "");
      setLastUpdated(new Date());
      toast.success(t("toast.generate_success"));
    } catch (err: any) {
      console.error("summarize failed", err);
      toast.error(err.message || t("toast.generate_failed"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      toast.success(t("actions.copied"));
    } catch (err) {
      toast.error(t("actions.copy_failed"));
    }
  };

  const handleExportPdf = async () => {
    if (!summary) return;

    setIsExporting(true);
    try {
      const resp = await fetch("/api/summarize/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary,
          meetingInfo,
        }),
      });

      const contentType = resp.headers.get("Content-Type") || "";
      if (!contentType.includes("application/pdf")) {
        let message = t("toast.export_failed");
        try {
          const payload = await resp.json();
          if (payload?.message) {
            message = payload.message;
          }
        } catch (err) {
          console.error("export parse error", err);
        }
        throw new Error(message);
      }

      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filenameBase =
        meetingInfo.title?.trim() || "meeting-summary";
      link.href = url;
      link.download = `${sanitizeFilename(filenameBase).slice(0, 60) || "meeting-summary"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(t("toast.export_success"));
    } catch (err: any) {
      console.error("export summary failed", err);
      toast.error(err.message || t("toast.export_failed"));
    } finally {
      setIsExporting(false);
    }
  };

  const handleLoadSample = () => {
    setTranscript(t("sample_transcript"));
    toast.success(t("toast.load_demo"));
  };

  const handleClear = () => {
    setMeetingInfo({
      title: "",
      type: "",
      focus: "",
      participants: "",
    });
    setTranscript("");
    setSummary("");
    setFileMeta(undefined);
    setLastUpdated(null);
  };

  return (
    <section className="py-12">
      <div className="container">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="uppercase tracking-wider">
                {t("model_badge")}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {t("model_description")}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("hero.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleLoadSample}
              disabled={isBusy}
            >
              <Sparkles className="mr-2 size-4" />
              {t("actions.load_demo")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              disabled={isBusy}
            >
              <RefreshCw className="mr-2 size-4" />
              {t("actions.clear")}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,55%)_minmax(0,45%)]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("form.title")}</CardTitle>
                <CardDescription>{t("form.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t("form.meeting_title")}
                    </label>
                    <Input
                      value={meetingInfo.title}
                      onChange={(e) =>
                        setMeetingInfo((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder={t("form.meeting_title_placeholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t("form.meeting_type")}
                    </label>
                    <Select
                      value={meetingInfo.type}
                      onValueChange={(value) =>
                        setMeetingInfo((prev) => ({
                          ...prev,
                          type: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.meeting_type_placeholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {meetingTypeKeys.map((key) => (
                          <SelectItem key={key} value={key}>
                            {t(`form.meeting_type_options.${key}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("form.meeting_participants")}
                  </label>
                  <Input
                    value={meetingInfo.participants}
                    onChange={(e) =>
                      setMeetingInfo((prev) => ({
                        ...prev,
                        participants: e.target.value,
                      }))
                    }
                    placeholder={t("form.meeting_participants_placeholder")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("form.meeting_focus")}
                  </label>
                  <Textarea
                    value={meetingInfo.focus}
                    onChange={(e) =>
                      setMeetingInfo((prev) => ({
                        ...prev,
                        focus: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder={t("form.meeting_focus_placeholder")}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("transcript.title")}</CardTitle>
                <CardDescription>{t("transcript.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs
                  value={tabValue}
                  onValueChange={(value) => setTabValue(value as "upload" | "paste")}
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="upload">
                      <Upload className="mr-2 size-4" />
                      {t("tabs.upload")}
                    </TabsTrigger>
                    <TabsTrigger value="paste">
                      <FileText className="mr-2 size-4" />
                      {t("tabs.paste")}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload">
                    <label
                      htmlFor="transcript-file"
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      className={cn(
                        "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
                        isDragging
                          ? "border-primary bg-primary/5"
                          : "border-muted bg-muted/30"
                      )}
                    >
                      <Upload className="mb-3 size-10 text-muted-foreground" />
                      <p className="text-base font-semibold">
                        {t("upload.drop")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("upload.helper")}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isBusy}
                        >
                          {t("upload.choose_file")}
                        </Button>
                        {fileMeta && (
                          <Badge variant="outline" className="font-mono">
                            {fileMeta.name} · {Math.round(fileMeta.size / 1024)}KB
                          </Badge>
                        )}
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">
                        {t("upload.file_tip")}
                      </p>
                      <input
                        id="transcript-file"
                        type="file"
                        accept={ACCEPTED_FILE_TYPES}
                        ref={fileInputRef}
                        className="hidden"
                        onChange={onFileChange}
                      />
                    </label>
                  </TabsContent>
                  <TabsContent value="paste">
                    <Textarea
                      value={transcript}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value.length > MAX_CHAR_COUNT) {
                          toast.error(
                            t("toast.content_too_long", {
                              max: MAX_CHAR_COUNT.toLocaleString(),
                            })
                          );
                          return;
                        }
                        setTranscript(value);
                      }}
                      rows={14}
                      placeholder={t("transcript.placeholder")}
                    />
                  </TabsContent>
                </Tabs>

                {isParsing && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    {t("transcript.parsing_label")}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-lg bg-muted/60 px-2 py-2">
                    <p className="text-xs text-muted-foreground">
                      {t("stats.characters")}
                    </p>
                    <p className="text-base font-semibold">{characters}</p>
                  </div>
                  <div className="rounded-lg bg-muted/60 px-2 py-2">
                    <p className="text-xs text-muted-foreground">
                      {t("stats.words")}
                    </p>
                    <p className="text-base font-semibold">{words}</p>
                  </div>
                  <div className="rounded-lg bg-muted/60 px-2 py-2">
                    <p className="text-xs text-muted-foreground">
                      {t("stats.tokens")}
                    </p>
                    <p className="text-base font-semibold">{estimatedTokens}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="size-4" />
                  {t("transcript.limit_hint", {
                    max: MAX_CHAR_COUNT.toLocaleString(),
                  })}
                </div>
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isBusy || !transcript.trim()}
                  className="flex items-center"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {t("actions.loading")}
                    </>
                  ) : (
                    <>
                      <BookOpenCheck className="mr-2 size-4" />
                      {t("actions.submit")}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("timeline.title")}</CardTitle>
                <CardDescription>{t("timeline.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {timeline.map((item, index) => (
                  <div
                    key={item.key}
                    className={cn(
                      "rounded-xl border px-4 py-3 transition-colors",
                      index <= progressIndex
                        ? "border-primary/40 bg-primary/5"
                        : "border-muted bg-muted/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={index <= progressIndex ? "default" : "outline"}
                      >
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("guide.title")}</CardTitle>
                <CardDescription>{t("guide.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
                  {guideBullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="min-h-[480px]">
              <CardHeader className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle>{t("summary.title")}</CardTitle>
                    <CardDescription>{t("summary.description")}</CardDescription>
                  </div>
                  <Badge variant="outline" className="uppercase tracking-wide">
                    {t("summary.model_label")}
                  </Badge>
                </div>
                {lastUpdated && (
                  <p className="text-xs text-muted-foreground">
                    {t("summary.last_updated", {
                      time: lastUpdated.toLocaleString(),
                    })}
                  </p>
                )}
                {summary && (
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="size-4" />
                    {t("summary.structured_hint")}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {isGenerating && (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} className="h-4 w-full" />
                    ))}
                  </div>
                )}
                {!isGenerating && summary && (
                  <>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={handleCopy}
                        disabled={isExporting}
                      >
                        <ClipboardCopy className="mr-2 size-4" />
                        {t("actions.copy")}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleExportPdf}
                        disabled={isExporting}
                      >
                        {isExporting ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            {t("actions.exporting")}
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 size-4" />
                            {t("actions.export_pdf")}
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="rounded-lg border bg-background px-4 py-4">
                      <Markdown content={summary} />
                    </div>
                  </>
                )}
                {!isGenerating && !summary && (
                  <div className="flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-16 text-center">
                    <Info className="size-10 text-muted-foreground" />
                    <p className="text-lg font-semibold">
                      {t("summary.empty_title")}
                    </p>
                    <p className="max-w-md text-sm text-muted-foreground">
                      {t("summary.empty_description")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
