import { GitBranch, FileCode2, Sparkles, Check } from "lucide-react";
import { content } from "@/data/content";
import type { ReactNode } from "react";
export function Editor({
  file,
  children,
  accepted = false,
  hero = false,
  lines = 5,
}: {
  file: string;
  children: ReactNode;
  accepted?: boolean;
  hero?: boolean;
  lines?: number;
}) {
  const c = content.hero;
  return (
    <div className="editor">
      <div className="editor-top">
        <div className="window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span className="editor-filename">
          <FileCode2 size={12} />
          {file}
        </span>
        <span className="editor-filename">{content.name}</span>
      </div>
      <div className="editor-body">
        <div className="line-numbers" aria-hidden="true">
          {Array.from({ length: lines }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="code-area">{children}</div>
        {hero && (
          <div className="ghost-pill">
            {accepted ? <Check size={11} /> : <Sparkles size={11} />}{" "}
            {accepted ? c.accepted : c.ghost}
          </div>
        )}
      </div>
      <div className="editor-status">
        <span>
          <GitBranch size={10} />
          {c.branch}
          <span className="local-status">
            <span className="live-dot" />
            {c.status}
          </span>
        </span>
        <span>
          UTF-8 <span>{file.split(".").at(-1)}</span>
        </span>
      </div>
    </div>
  );
}
