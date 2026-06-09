import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SalesLeadDetail } from "../../../../features/sales/components/sales-lead-detail";
import { getLead } from "../../../../features/leads/api/leads-client";

export default async function SalesLeadDetailPage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  const cookieStore = await cookies();

  try {
    const lead = await getLead(leadId, {
      cache: "no-store",
      headers: {
        cookie: cookieStore.toString(),
      },
    });
    return <SalesLeadDetail lead={lead} />;
  } catch {
    redirect("/sales/leads");
  }
}
