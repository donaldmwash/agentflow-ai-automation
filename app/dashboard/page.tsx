import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AgentWorkspace from "@/components/agent-workspace";
export const dynamic="force-dynamic";
export default async function DashboardPage(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");return <AgentWorkspace email={user.email??"Workspace user"}/>;}
