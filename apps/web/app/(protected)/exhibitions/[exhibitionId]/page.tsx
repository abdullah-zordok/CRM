import { ExhibitionDetailShell } from "../../../../features/exhibitions/components/exhibition-detail-shell";

export default async function ExhibitionDetailPage({
  params,
}: {
  params: Promise<{ exhibitionId: string }>;
}) {
  const { exhibitionId } = await params;
  return <ExhibitionDetailShell exhibitionId={exhibitionId} />;
}
