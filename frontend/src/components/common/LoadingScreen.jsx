const LoadingScreen = () => (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white">
    <div className="animate-spin" style={{ animationDuration: '1.1s', animationTimingFunction: 'linear' }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" stroke="#f1f0e8" strokeWidth="3" />
        <path d="M24 4 A20 20 0 0 1 44 24" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

export default LoadingScreen;