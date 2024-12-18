import { deleteSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const logoutUri = searchParams.get("logoutUri");

  await deleteSession();

  redirect(
    `${logoutUri === "home" ? "/" : "/unsupportedAccount"}`
  );
}
