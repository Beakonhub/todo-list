export type StatusCounts = { NOT_STARTED: number; IN_PROGRESS: number; COMPLETED: number };

export function computeStatusPercentages(counts: StatusCounts) {
  const total = counts.NOT_STARTED + counts.IN_PROGRESS + counts.COMPLETED;
  return {
    completed: total === 0 ? 0 : Math.round((counts.COMPLETED / total) * 100),
    inProgress: total === 0 ? 0 : Math.round((counts.IN_PROGRESS / total) * 100),
    notStarted: total === 0 ? 0 : Math.round((counts.NOT_STARTED / total) * 100),
  };
}
