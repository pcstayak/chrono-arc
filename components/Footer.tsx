/**
 * Footer Component
 * Contains the Chrono Arc timeline visualization
 */

export default function Footer() {
  return (
    <footer className="h-[20vh] bg-gray-900 text-white px-6 py-4">
      <div className="h-full flex flex-col">
        {/* Placeholder for Arc Timeline */}
        <div className="flex-1 relative bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-400 text-sm">
            Chrono Arc Timeline (To be implemented)
          </p>
          {/* This will be replaced with the actual timeline arc component */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 1000 150" preserveAspectRatio="xMidYMid meet">
              {/* Simple arc curve placeholder */}
              <path
                d="M 50 120 Q 250 20, 500 40 T 950 120"
                stroke="rgba(37, 99, 235, 0.5)"
                strokeWidth="3"
                fill="none"
              />
              {/* Era markers placeholder */}
              <circle cx="100" cy="110" r="4" fill="rgba(37, 99, 235, 0.7)" />
              <circle cx="300" cy="45" r="4" fill="rgba(37, 99, 235, 0.7)" />
              <circle cx="500" cy="40" r="4" fill="rgba(37, 99, 235, 0.7)" />
              <circle cx="700" cy="55" r="4" fill="rgba(37, 99, 235, 0.7)" />
              <circle cx="900" cy="110" r="4" fill="rgba(37, 99, 235, 0.7)" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
