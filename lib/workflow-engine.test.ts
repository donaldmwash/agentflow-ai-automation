import { describe, expect, it } from "vitest";
import { executeWorkflow } from "./workflow-engine";

describe("AgentFlow workflow engine", () => {
  it("executes a validated text workflow in order", async () => {
    const result = await executeWorkflow({
      id: "wf-1",
      name: "Welcome",
      steps: [
        { id: "s1", type: "text", label: "Greeting", value: "Hello" },
        { id: "s2", type: "text", label: "Sign off", value: "Goodbye" },
      ],
    });
    expect(result.status).toBe("completed");
    expect(result.outputs.map((item) => item.output)).toEqual(["Hello", "Goodbye"]);
    expect(result.events[0].type).toBe("workflow.started");
    expect(result.events.at(-1)?.type).toBe("workflow.completed");
  });

  it("rejects unknown or malformed step types", async () => {
    await expect(executeWorkflow({
      id: "wf-2",
      name: "Unsafe",
      steps: [{ id: "s1", type: "shell", label: "Run command" }],
    })).rejects.toThrow();
  });

  it("does not execute condition expressions as code", async () => {
    const result = await executeWorkflow({
      id: "wf-3",
      name: "Safe condition",
      steps: [{ id: "s1", type: "condition", label: "Check", expression: "process.exit(1)" }],
    });
    expect(result.outputs[0].output).toContain("Add an approved evaluator");
  });
});
