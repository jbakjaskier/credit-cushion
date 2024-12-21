import { deleteSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {

  await deleteSession();

  redirect(
    `/`
  );
}
