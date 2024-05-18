import { withAuth } from "next-auth/middleware";
import { env } from "./env.js";
// import { NextResponse } from "next/server";

export default withAuth({
  pages: {
    signIn: "/signin",
  },
  secret: env.NEXTAUTH_SECRET,
});
