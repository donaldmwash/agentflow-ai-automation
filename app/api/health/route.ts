export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    status: "ok",
    service: "agentflow",
    timestamp: new Date().toISOString(),
    configuration: {
      supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      aiGateway: Boolean(process.env.AI_GATEWAY_API_KEY && process.env.AI_GATEWAY_MODEL),
    },
  });
}
