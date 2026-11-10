import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const createAgentSchema = z.object({
  name: z.string().trim().min(1).max(80),
  instructions: z.string().trim().max(4000).default(""),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("agents")
    .select("id,name,instructions,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: "Unable to load your agents." }, { status: 500 });
  return Response.json({ agents: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  const parsed = createAgentSchema.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: "Provide a name of up to 80 characters and valid instructions." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("agents")
    .insert({ user_id: user.id, name: parsed.data.name, instructions: parsed.data.instructions })
    .select("id,name,instructions,created_at")
    .single();

  if (error) return Response.json({ error: "Unable to create this agent." }, { status: 500 });
  return Response.json({ agent: data }, { status: 201 });
}
