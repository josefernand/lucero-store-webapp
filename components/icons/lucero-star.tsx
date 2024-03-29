export default function LuceroStarIcon({
  size = 24,
  className
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2L10.3174 8.90074C10.2087 9.2313 10.0238 9.53171 9.77778 9.77778C9.53171 10.0238 9.2313 10.2087 8.90074 10.3174L2 12L8.90074 13.6826C9.2313 13.7913 9.53171 13.9762 9.77778 14.2222C10.0238 14.4683 10.2087 14.7687 10.3174 15.0993L12 22L13.6826 15.0993C13.7913 14.7687 13.9762 14.4683 14.2222 14.2222C14.4683 13.9762 14.7687 13.7913 15.0993 13.6826L22 12L15.0993 10.3174C14.7687 10.2087 14.4683 10.0238 14.2222 9.77778C13.9762 9.53171 13.7913 9.2313 13.6826 8.90074L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.77783 14.2222L6.4445 17.5556"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5557 6.44444L14.2223 9.77778"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.2222 14.2222L17.5555 17.5556"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.44434 6.44444L9.77767 9.77778"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
