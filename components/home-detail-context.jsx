import Link from "next/link";

export function ExpandableBlock({ detailId, className = "", children, ...props }) {
  return (
    <Link
      href={`/detail/${detailId}`}
      className={`expandable-block ${className}`.trim()}
      {...props}
    >
      {children}
    </Link>
  );
}
