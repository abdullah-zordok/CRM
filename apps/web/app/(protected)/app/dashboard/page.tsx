import { redirect } from "next/navigation";

export default function ProtectedAppDashboardPage() {
  redirect("/dashboard");
}
