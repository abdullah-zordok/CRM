import { redirect } from "next/navigation";

export default function ProtectedAppIndexPage() {
  redirect("/dashboard");
}
