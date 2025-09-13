import { Context } from "@actions/github/lib/context";

export function validateEventName(context: Context) {
  const eventName = context.eventName;
  const action = context.payload.action;

  if (eventName !== "pull_request" && action !== "opened") {
    throw new Error("This action only works on pull request opened events.");
  }
}

export function getBranchName(context: Context) {
  const branchName = context.payload.pull_request?.head?.ref;

  if (!branchName) {
    throw new Error("Could not determine branch name from PR payload");
  }

  return branchName + "";
}

export function getIssueNumberFromBranch(branchName: string) {
  const issueNumberMatch = branchName.match(/(?:(?<=\/)|^)(\d+)/);
  if (!issueNumberMatch) {
    throw new Error("Branch name does not contain a valid issue number.");
  }
  return parseInt(issueNumberMatch[1], 10);
}
