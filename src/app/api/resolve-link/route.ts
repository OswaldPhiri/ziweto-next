import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    // Pinterest and other sites often require a real-looking User-Agent
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`External site returned ${response.status}`);
    }

    const html = await response.text();

    // Regex to find OpenGraph image metadata
    // Handles both property="og:image" content="..." and vice versa
    const ogImageRegex = /<meta\s+[^>]*property=["']og:image["']\s+[^>]*content=["']([^"']+)["'][^>]*>|<meta\s+[^>]*content=["']([^"']+)["']\s+[^>]*property=["']og:image["'][^>]*>/i;
    const match = html.match(ogImageRegex);
    
    // The match could be in group 1 or group 2 depending on the order of attributes
    const imageUrl = match ? (match[1] || match[2]) : null;

    if (imageUrl) {
      // Some Pinterest URLs are protocol-relative (//i.pinimg.com/...)
      const absoluteUrl = imageUrl.startsWith("//") ? `https:${imageUrl}` : imageUrl;
      return NextResponse.json({ url: absoluteUrl });
    }

    // Twitter card fallback
    const twitterRegex = /<meta\s+[^>]*name=["']twitter:image["']\s+[^>]*content=["']([^"']+)["'][^>]*>/i;
    const tMatch = html.match(twitterRegex);
    if (tMatch && tMatch[1]) {
      return NextResponse.json({ url: tMatch[1] });
    }

    return NextResponse.json(
      { error: "Could not extract image from this link. Please use a direct image link." },
      { status: 404 }
    );
  } catch (err: any) {
    console.error("Link resolution error:", err);
    return NextResponse.json(
      { error: "Failed to resolve link. The site might be blocking automated access." },
      { status: 500 }
    );
  }
}
