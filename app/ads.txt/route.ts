import { NextResponse } from "next/server";

export async function GET() {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  
  if (adsenseClient) {
    const pubId = adsenseClient.replace("ca-pub-", "pub-");
    const content = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  const defaultContent = `# Google AdSense ads.txt architecture for Creator Intel
# Automatically dynamically populated when NEXT_PUBLIC_ADSENSE_CLIENT is configured.
`;
  return new NextResponse(defaultContent, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
