/**
 * Back Button Component
 * Epic 5: Story 5.1 - Hierarchical Drill-Down Navigation
 * Navigates back to parent segment level
 */

"use client";

interface BackButtonProps {
  parentName: string;
  onClick: () => void;
  show: boolean;
}

export default function BackButton({
  parentName,
  onClick,
  show,
}: BackButtonProps) {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="
        min-h-[44px] px-4 py-2
        bg-gray-700 hover:bg-gray-600
        text-white font-medium text-sm
        rounded-lg shadow-md
        transition-all duration-200
        flex items-center gap-2
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800
      "
      aria-label={`Back to ${parentName}`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span className="whitespace-nowrap">Back to {parentName}</span>
    </button>
  );
}
