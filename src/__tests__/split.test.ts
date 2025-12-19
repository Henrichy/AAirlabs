/**
 * @jest-environment node
 */
import { splitIntoTasks } from "../voice/split";

describe("splitIntoTasks", () => {
  it("returns empty array for empty input", () => {
    const result = splitIntoTasks("");
    expect(result).toEqual([]);
  });

  it("splits simple task", () => {
    const result = splitIntoTasks("Buy milk");
    expect(result).toEqual(["Buy milk"]);
  });

  it("removes garbage tasks (single characters)", () => {
    const result = splitIntoTasks("Buy milk .");
    expect(result).toEqual(["Buy milk"]);
  });

  it("splits multiple tasks by 'and'", () => {
    const result = splitIntoTasks("Buy milk and walk the dog");
    expect(result).toEqual(["Buy milk", "walk the dog"]);
  });

  it("splits multiple tasks by 'also'", () => {
    const result = splitIntoTasks("Wash dishes also clean room");
    expect(result).toEqual(["Wash dishes", "clean room"]);
  });

  it("splits multiple tasks by 'then'", () => {
    const result = splitIntoTasks("Task one then task two");
    expect(result).toEqual(["Task one", "task two"]);
  });

  it("filters out short garbage words", () => {
    const result = splitIntoTasks("Do this . a .");
    expect(result).toEqual(["Do this"]);
  });
});
