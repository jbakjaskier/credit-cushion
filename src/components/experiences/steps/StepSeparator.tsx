export function StepSeparator() {
  return (
    <div
      className="absolute inset-0 left-0 top-0 hidden w-3 lg:block"
      aria-hidden="true"
    >
      <svg
        className="h-full w-full text-gray-300"
        viewBox="0 0 12 82"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0.5 0V31L10.5 41L0.5 51V82"
          stroke="currentcolor"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
