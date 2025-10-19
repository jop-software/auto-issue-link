import { Context } from "@actions/github/lib/context";
export declare function validateEventName(context: Context): void;
export declare function getBranchName(context: Context): string;
export declare function getIssueNumberFromBranch(branchName: string): number | null;
