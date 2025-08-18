import { Octokit } from "octokit";

const token = process.env.GITHUB_TOKEN;
export const octokit = new Octokit({ auth: token });

export async function createOrUpdateFile(opts: {
  owner: string;
  repo: string;
  path: string;
  content: string;
  message: string;
  branch?: string;
}) {
  const { owner, repo, path, content, message, branch = process.env.GITHUB_BRANCH || "main" } = opts;

  // 기존 파일 sha 조회(있으면 업데이트, 없으면 생성)
  let sha: string | undefined;
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ref: branch });
    if (!Array.isArray(data) && "sha" in data) sha = (data as any).sha;
  } catch {
    // 404면 새로 생성
  }

  const base64 = Buffer.from(content, "utf8").toString("base64");
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: base64,
    sha,
    branch,
  });
}
