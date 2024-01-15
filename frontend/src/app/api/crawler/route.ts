export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const command: string | null = searchParams.get("command");

  if (!command || !['start','stop'].includes(command)) return Response.json({});

  const response = await fetch(process.env.API_URL + `/crawler/${command}`);

  if (!response.ok) return Response.json({});

  const result: { message: string } = await response.json();

  if (!result?.message) return Response.json({});

  return Response.json(result);
}
