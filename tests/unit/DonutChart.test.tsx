import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DonutChart } from "@/components/charts/DonutChart";

describe("DonutChart", () => {
  it("renders the percentage label and legend", () => {
    render(<DonutChart percentage={84} color="#2FB872" label="Completed" />);
    expect(screen.getByText("84%")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("clamps out-of-range percentages", () => {
    render(<DonutChart percentage={150} color="#2FB872" label="Completed" />);
    const el = screen.getByTestId("donut-chart");
    expect(el.dataset.percentage).toBe("100");
  });
});
