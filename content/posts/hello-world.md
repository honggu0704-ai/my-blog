---
title: "첫 글: 블로그를 시작합니다"
date: "2025-08-17"
summary: "Next.js + Markdown 스타터로 만든 경제 블로그의 첫 포스트"
tags: ["공지", "운영"]
published: true
---

이 블로그는 **Next.js + Markdown** + Tailwind CSS로 만들어졌습니다.

- 글은 `/content/posts/` 폴더의 `.md` 파일로 관리합니다.
- 파일 맨 위의 *Frontmatter*(`title`, `date`, `summary`, `tags`)만 채우면 목록에 자동 반영됩니다.
- 표/리스트/코드블록 등 기본 마크다운을 지원합니다.

```ts
// 예시 코드 블록
const growth = (start: number, rate: number, years: number) =>
  start * Math.pow(1 + rate, years);
```
