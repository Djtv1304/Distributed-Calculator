export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const a = searchParams.get("a");
  const b = searchParams.get("b");

  if (isNaN(a) || isNaN(b)) {
    return new Response(
      JSON.stringify({ error: "Both parameters must be numbers." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const result = parseFloat(a) - parseFloat(b);
  return new Response(JSON.stringify({ result }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
