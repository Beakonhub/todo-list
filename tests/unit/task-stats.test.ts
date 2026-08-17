import { describe, expect, it } from "vitest";
import { computeStatusPercentages } from "@/lib/task-stats";

describe("computeStatusPercentages", () => {
  it("returns 0/0/0 when there are no tasks", () => {
    expect(computeStatusPercentages({ NOT_STARTED: 0, IN_PROGRESS: 0, COMPLETED: 0 })).toEqual({
      completed: 0,
      inProgress: 0,
      notStarted: 0,
    });
  });

  it("computes rounded percentages from live counts", () => {
    const result = computeStatusPercentages({ NOT_STARTED: 1, IN_PROGRESS: 4, COMPLETED: 5 });
    expect(result).toEqual({ completed: 50, inProgress: 40, notStarted: 10 });
  });

  it("handles a single task in one status", () => {
    const result = computeStatusPercentages({ NOT_STARTED: 0, IN_PROGRESS: 0, COMPLETED: 1 });
    expect(result).toEqual({ completed: 100, inProgress: 0, notStarted: 0 });
  });
});
