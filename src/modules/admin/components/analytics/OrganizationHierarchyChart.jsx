import React, { useState, useCallback } from 'react';

function TreeNode({ node, expandedNodes, toggle }) {
  const isExpanded = expandedNodes.has(node.id);
  return (
    <div className="ml-4">
      <div
        className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
        onClick={() => toggle(node.id)}
      >
        {node.children && node.children.length > 0 && (
          <span className="mr-1">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        <span className="flex-1">{node.title} ({node.count})</span>
      </div>
      {isExpanded && node.children && (
        <div className="ml-4 border-l border-gray-300">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} expandedNodes={expandedNodes} toggle={toggle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrganizationHierarchyChart({ data }) {
  const [expandedNodes, setExpandedNodes] = useState(new Set([data?.id]));

  const toggle = useCallback((id) => {
    setExpandedNodes((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  }, []);

  if (!data) return null;

  return (
    <div className="p-4 bg-white rounded shadow overflow-auto max-h-96">
      <TreeNode node={data} expandedNodes={expandedNodes} toggle={toggle} />
    </div>
  );
}
