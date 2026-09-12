import { NextResponse } from "next/server";

export async function GET() {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-1556731799149585";
  const pubId = adsenseClient.replace("ca-pub-", "pub-");
  
  const content = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
