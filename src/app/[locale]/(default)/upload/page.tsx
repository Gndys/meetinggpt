import TranscriptWorkbench from "@/components/meeting/transcript-workbench";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  await params;
  const t = await getTranslations();

  return {
    title: t("transcript_lab.metadata.title"),
    description: t("transcript_lab.metadata.description"),
  };
}

export default async function UploadPage() {
  return <TranscriptWorkbench />;
}
