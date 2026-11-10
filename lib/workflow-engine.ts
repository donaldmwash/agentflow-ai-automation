import { z } from "zod";

const textStep = z.object({
  id: z.string().min(1).max(80),
  type: z.literal("text"),
  label: z.string().min(1).max(120),
  value: z.string().max(4000),
});
const conditionStep = z.object({
  id: z.string().min(1).max(80),
  type: z.literal("condition"),
  label: z.string().min(1).max(120),
  expression: z.string().max(500),
});
const workflowSchema = z.object({
  id: z.string().min(1).max(80),
  name: z.string().min(1).max(120),
  steps: z.array(z.discriminatedUnion("type", [textStep, conditionStep])).max(50),
});

export type WorkflowDefinition = z.infer<typeof workflowSchema>;
export type WorkflowEvent =
  | { type: "workflow.started"; workflowId: string; at: string }
  | { type: "step.completed"; workflowId: string; stepId: string; output: string; at: string }
  | { type: "workflow.completed"; workflowId: string; at: string };

export type WorkflowResult = {
  workflowId: string;
  status: "completed";
  outputs: Array<{ stepId: string; output: string }>;
  events: WorkflowEvent[];
};

/**
 * AgentFlow's own deterministic workflow runner.
 * It has no network access and cannot perform external side effects.
 * External integrations must be added later as separately permissioned adapters.
 */
export async function executeWorkflow(input: unknown): Promise<WorkflowResult> {
  const workflow = workflowSchema.parse(input);
  const timestamp = () => new Date().toISOString();
  const events: WorkflowEvent[] = [
    { type: "workflow.started", workflowId: workflow.id, at: timestamp() },
  ];
  const outputs: WorkflowResult["outputs"] = [];

  for (const step of workflow.steps) {
    const output = step.type === "text"
      ? step.value
      : step.expression.trim()
        ? "Condition captured. Add an approved evaluator before using this condition."
        : "Condition is empty.";

    outputs.push({ stepId: step.id, output });
    events.push({
      type: "step.completed",
      workflowId: workflow.id,
      stepId: step.id,
      output,
      at: timestamp(),
    });
  }

  events.push({ type: "workflow.completed", workflowId: workflow.id, at: timestamp() });
  return { workflowId: workflow.id, status: "completed", outputs, events };
}
