"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { FILE_TREE, type FileTreeNode } from "@/types";

function TreeNode({ node, depth = 0 }: { node: FileTreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const setHoveredBodyPart = useAppStore((s) => s.setHoveredBodyPart);
  const setActiveNodeId = useAppStore((s) => s.setActiveNodeId);
  const activeNodeId = useAppStore((s) => s.activeNodeId);

  const hasChildren = node.children && node.children.length > 0;
  const isActive = activeNodeId === node.id;

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer text-xs transition-all duration-150 select-none ${
          depth === 0
            ? "text-[#5ab3cc] font-bold tracking-widest mt-2"
            : isActive
            ? "text-[#e8e8e8] bg-[rgba(90,179,204,0.08)] border-l border-[#5ab3cc]"
            : "text-[#848484] hover:text-[#c0c0c0] hover:bg-[rgba(255,255,255,0.02)] border-l border-transparent"
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => {
          if (hasChildren) setOpen(!open);
          else setActiveNodeId(node.id);
        }}
        onMouseEnter={() => node.meshName && setHoveredBodyPart(node.meshName)}
        onMouseLeave={() => setHoveredBodyPart(null)}
      >
        {hasChildren ? (
          <span className={`text-[8px] transition-transform duration-200 ${open ? "rotate-90" : ""} ${depth === 0 ? "text-[#5ab3cc]" : "text-[#848484]"}`}>
            ▶
          </span>
        ) : (
          <span className="text-[8px] text-[#2a2a2e] w-2">·</span>
        )}
        {depth === 0 && node.icon && (
          <span className="text-[#5ab3cc] text-[10px]">{node.icon}</span>
        )}
        <span className={depth === 0 ? "tracking-widest text-[10px]" : "text-[11px]"}>
          {node.label}
        </span>
        {isActive && <span className="ml-auto text-[#52b788] text-[8px]">●</span>}
      </div>

      {hasChildren && open && (
        <div>
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree() {
  return (
    <div className="h-full overflow-y-auto py-2">
      <div className="px-3 pb-2 border-b border-[rgba(90,179,204,0.06)]">
        <p className="text-[9px] tracking-[3px] text-[#2a2a2e] uppercase">CONCERN MATRIX</p>
      </div>

      {FILE_TREE.map((node) => (
        <TreeNode key={node.id} node={node} depth={0} />
      ))}

      <div className="mt-4 mx-3 p-2 border border-[rgba(90,179,204,0.05)]">
        <p className="text-[9px] text-[#2a2a2e] tracking-wider mb-1">HOVER EFFECT</p>
        <p className="text-[9px] text-[#848484]">
          Hover a node to highlight the corresponding mesh on the 3D model.
        </p>
      </div>
    </div>
  );
}
