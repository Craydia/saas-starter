import { auth } from "@/auth";
import User from "@/types/user";

export async function getCurrentUser() {
  const session = await auth();

  return session?.user as User;
}