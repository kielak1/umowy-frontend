'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { ICellRendererParams } from 'ag-grid-community';
import { MouseEvent } from 'react';

export default function DetailToggleRenderer(props: ICellRendererParams) {
  const expanded = props.node.expanded;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    props.node.setExpanded(!expanded);
  };

  return (
    <button
      onClick={handleClick}
      className="p-1 hover:bg-gray-100 rounded transition-all"
      aria-label="Toggle details"
    >
      {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
    </button>
  );
}
