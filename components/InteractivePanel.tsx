/**
 * Interactive Panel Component (Right Column)
 * Displays dynamic content based on selected trigger
 */

interface InteractivePanelProps {
  content?: React.ReactNode;
}

export default function InteractivePanel({ content }: InteractivePanelProps) {
  return (
    <main className="w-[65%] bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
      {content ? (
        content
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-400 space-y-4">
            <svg
              className="w-24 h-24 mx-auto text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-lg">
              Select an event and choose an activity to begin
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
