import { sanitizeParams } from "@/lib/helper";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response | undefined> {
  const { searchParams } = new URL(request.url);
  const type: string | null = sanitizeParams(searchParams.get("type"));
  const source: string | null = sanitizeParams(searchParams.get("source"));
  const formData = await request.formData();

  if (!type) return Response.json({});
  if (!source) return Response.json({});
  if (!formData.has("file")) return Response.json({});

  const response = await fetch(
    process.env.API_URL + `/upload/${params?.id}?type=${type}&source=${source}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response?.ok) return Response.json({ message: "File upload failed." });

  const data = await response.json();

  if (!data?.url)
    return Response.json({ message: "Server did not send a URL." });

  return Response.json({ message: `File URL: ${data?.url}` });
}
