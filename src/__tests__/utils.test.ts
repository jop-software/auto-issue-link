import { describe, it, expect } from "vitest";
import {
  validateEventName,
  getBranchName,
  getIssueNumberFromBranch,
} from "../utils";

const baseContext: any = {
  payload: {
    pull_request: {
      head: { ref: "feature/123-add-thing" },
    },
    action: "opened",
  },
  eventName: "pull_request",
};

describe("utils", () => {
  it("validateEventName does not throw for pull_request opened", () => {
    expect(() => validateEventName(baseContext)).not.toThrow();
  });

  it("getBranchName returns branch name", () => {
    expect(getBranchName(baseContext)).toBe("feature/123-add-thing");
  });

  it.each([
    ["feature/123-add-thing", 123],
    ["bugfix/456-fix-crash", 456],
    ["hotfix/789-critical-fix", 789],
    ["chore/42-update-deps", 42],
    ["release/20230913", 20230913],
    ["task/321-refactor-module", 321],
    ["123-root-branch", 123], // number at start
    ["feature/00-leading-zero", 0], // leading zero handling
  ])("extracts issue number from %s", (branch, expected) => {
    expect(getIssueNumberFromBranch(branch)).toBe(expected);
  });

  it.each([
    "no-number-here",
    "feature/abc-not-a-number",
    "just-a-branch",
    "feature//missing-number",
    "feature/--",
    "release/x123", // number not at start of token
  ])("returns null for invalid branch '%s'", (branch) => {
    expect(getIssueNumberFromBranch(branch)).toBeNull();
  });
});
