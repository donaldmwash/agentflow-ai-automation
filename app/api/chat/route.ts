import { createGateway } from "@ai-sdk/gateway";
import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { z } from "zod";
export const runtime="nodejs";
const schema=z.object({messages:z.array(z.object({role:z.enum(["user","assistant"]),content:z.string().max(12000)})).max(30),instructions:z.string().max(4000).optional(),agentName:z.string().max(80).optional()});
export async function POST(request:Request){
 if(!process.env.AI_GATEWAY_API_KEY||!process.env.AI_GATEWAY_MODEL)return Response.json({error:"AI is not configured yet. Add AI_GATEWAY_API_KEY and AI_GATEWAY_MODEL in the Vercel environment settings."},{status:503});
 try{const parsed=schema.safeParse(await request.json());if(!parsed.success)return Response.json({error:"Invalid chat request."},{status:400});const gateway=createGateway({apiKey:process.env.AI_GATEWAY_API_KEY});const messages:UIMessage[]=parsed.data.messages.map((m,i)=>({id:`message-${i}`,role:m.role,parts:[{type:"text",text:m.content}]}));const result=streamText({model:gateway(process.env.AI_GATEWAY_MODEL),system:`You are ${parsed.data.agentName||"an AgentFlow AI agent"}. Follow these instructions: ${parsed.data.instructions||"Be helpful, accurate, and clear."}. Be transparent about uncertainty. Never claim to have performed external actions unless a connected tool actually did so.`,messages:await convertToModelMessages(messages)});return result.toTextStreamResponse();}catch{return Response.json({error:"The AI service could not complete this request."},{status:500});}
}
