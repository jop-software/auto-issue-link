import * as core from "@actions/core";
import * as github from "@actions/github";
import {
  validateEventName,
  getBranchName,
  getIssueNumberFromBranch,
} from "./utils";
import { Context } from "@actions/github/lib/context";

async function findIssueByNumber(
  context: Context,
  token: string,
  issueNumber: number
) {
  const octokit = github.getOctokit(token);
  const { owner, repo } = context.repo;

  const { data: issue, status } = await octokit.rest.issues.get({
    owner,
    repo,
    issue_number: issueNumber,
  });

  if (status !== 200) {
    return null;
  }

  return issue;
}

async function appendFixesToPrBody(
  context: Context,
  token: string,
  prNumber: number,
  issueNumber: number
) {
  const octokit = github.getOctokit(token);
  const { owner, repo } = context.repo;
  // Get the current PR body
  const { data: pr } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });
  let body = pr.body || "";
  // Remove any existing 'Fixes #<issueNumber>' at the end
  body = body.replace(new RegExp(`\n*Fixes #${issueNumber}$`), "");
  // Append the new line
  if (body.length > 0 && !body.endsWith("\n")) {
    body += "\n";
  }
  body += `Fixes #${issueNumber}`;
  // Update the PR body
  const res = await octokit.rest.pulls.update({
    owner,
    repo,
    pull_number: prNumber,
    body,
  });
  return res.data;
}

async function run(): Promise<void> {
  const context = github.context;
  const token = core.getInput("token", { required: true });
  validateEventName(context);
  const branchName = getBranchName(context);
  const issueNumber = getIssueNumberFromBranch(branchName);
  core.info(
    `Detected issue number ${issueNumber} from branch name ${branchName}`
  );
  const issue = await findIssueByNumber(context, token, issueNumber);
  if (!issue) {
    core.info(
      `Could not find issue with number ${issueNumber} in this repository.`
    );
    return;
  }
  core.info(`Found issue: ${issue.title} (${issue.html_url})`);
  // Connect issue in the "development" section of the PR
  const pullRequest = context.payload.pull_request;
  if (!pullRequest) {
    core.setFailed("No pull request found in the context.");
    return;
  }
  const updatedPr = await appendFixesToPrBody(
    context,
    token,
    pullRequest.number,
    issueNumber
  );
  core.info(
    `Updated PR #${pullRequest.number} body with 'Fixes #${issueNumber}'`
  );
}

async function main() {
  try {
    run();
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

main();
