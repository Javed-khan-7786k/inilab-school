/**
 * NavbarIconLink — A navbar icon button with optional badge and image.
 *
 * Why: The navbar has 3 icon links (globe, bell, flag) with similar structure.
 *      This component avoids repeating that pattern.
 *
 * Props:
 *  - icon          : Font Awesome icon class (e.g. "fa-globe") — used if no imageSrc
 *  - href          : link URL
 *  - badgeCount    : optional notification count
 *  - badgeColor    : Tailwind bg-color for the badge
 *  - imageSrc      : optional image instead of an icon (e.g. flag)
 *  - imageAlt      : alt text for the image
 *  - hiddenOnMobile: whether to hide on small screens
 */

import { Badge } from "./Badge";
import { Icon } from "./Icon";

interface NavbarIconLinkProps {
  icon?: string;
  href: string;
  badgeCount?: number;
  badgeColor?: string;
  imageSrc?: string;
  imageAlt?: string;
  hiddenOnMobile?: boolean;
}

export function NavbarIconLink({
  icon,
  href,
  badgeCount,
  badgeColor = "bg-badgered",
  imageSrc,
  imageAlt,
  hiddenOnMobile = false,
}: NavbarIconLinkProps) {
  return (
    <a
      href={href}
      className={`relative flex h-[50px] items-center px-[12px] text-[16px] text-muted${
        hiddenOnMobile ? " max-md:hidden" : ""
      }`}
    >
      {imageSrc ? (
        <img className="w-[22px] align-middle" src={imageSrc} alt={imageAlt} />
      ) : (
        icon && <Icon name={icon} />
      )}
      {badgeCount !== undefined && <Badge count={badgeCount} bgColor={badgeColor} />}
    </a>
  );
}
