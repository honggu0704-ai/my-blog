// lib/github.ts
import { Octokit } from "octokit";

const token = process.env.GITHUB_TOKEN;
export const octokit = new Octokit({ auth: token });

type RepoCtx = {
  owner: string;
  repo: string;
  branch?: string; // default "main"
};

// ✅ owner/repo/branch를 선택(Optional)로 받아도 환경변수로 보완
function ensure(ctx?: Partial<RepoCtx>) {
  const owner = ctx?.owner ?? process.env.GITHUB_OWNER!;
  const repo  = ctx?.repo  ?? process.env.GITHUB_REPO!;
  const branch = ctx?.branch ?? process.env.GITHUB_BRANCH ?? "main";
  if (!token || !owner || !repo) throw new Error("Server not configured");
  return { owner, repo, branch };
}

export async function getContentSha(path: string, ctx?: Partial<RepoCtx>) {
  const { owner, repo, branch } = ensure(ctx);
  const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ref: branch });
  if (Array.isArray(data)) throw new Error("Path is a directory");
  // @ts-ignore
  return data.sha as string;
}

export async function listDirectory(path: string, ctx?: Partial<RepoCtx>) {
  const { owner, repo, branch } = ensure(ctx);
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ref: branch });
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({ path: item.path as string, sha: (item as any).sha as string }));
  } catch (e: any) {
    if (e.status === 404) return [];
    throw e;
  }
}

export async function createOrUpdateFileContents(args: {
  path: string;
  contentBase64: string;
  message: string;
} & Partial<RepoCtx>) {
  const { owner, repo, branch } = ensure(args);
  let sha: string | undefined;
  try {
    sha = await getContentSha(args.path, { owner, repo, branch });
  } catch {}
  await octokit.rest.repos.createOrUpdateFileContents({
    owner, repo, branch,
    path: args.path,
    message: args.message,
    content: args.contentBase64,
    sha,
  });
}

export async function deleteFile(args: {
  path: string;
  message: string;
} & Partial<RepoCtx>) {
  const { owner, repo, branch } = ensure(args);
  const sha = await getContentSha(args.path, { owner, repo, branch });
  await octokit.rest.repos.deleteFile({
    owner, repo, branch,
    path: args.path,
    message: args.message,
    sha,
  });
}
