/**
 * Badge — Small notification count badge.
 *
 * Why: Reusable badge for any navbar icon or element that needs a count indicator.
 *
 * Props:
 *  - count  : number to display
 *  - bgColor: Tailwind bg-color class (e.g. "bg-badgered")
 */

interface BadgeProps {
  count: number;
  bgColor: string;
}

export function Badge({ count, bgColor }: BadgeProps) {
  return (
    <span
      className={`absolute right-[2px] top-[8px] rounded-[10px] ${bgColor} px-[5px] py-[2px] text-[10px] font-bold text-white`}
    >
      {count}
    </span>
  );
}
