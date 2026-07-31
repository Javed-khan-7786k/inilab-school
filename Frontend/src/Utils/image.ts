export const DEFAULT_AVATAR = "https://demo.eduking.xyz/uploads/images/default.png";

const DUMMY_FILENAMES = [
  "photo.jpg",
  "photo.png",
  "photo.jpeg",
  "alice.png",
  "alice.jpg",
  "bob.png",
  "bob.jpg",
  "charlie.png",
  "charlie.jpg",
  "image.jpg",
  "image.png",
  "student.jpg",
  "student.png",
  "teacher.jpg",
  "teacher.png",
  "user.jpg",
  "user.png",
  "avatar.jpg",
  "avatar.png",
  "test.jpg",
  "test.png"
];

/**
 * handleImageError — Fallback event handler for <img> tags.
 * Replaces broken/404 image URLs with the default avatar.
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = DEFAULT_AVATAR;
};

/**
 * getPhotoUrl — Resolves relative and absolute image paths to complete URLs.
 * 
 * Handles:
 * - Absolute URLs (http://, https://) and base64 strings (data:image/) -> returned.
 * - Valid backend upload paths (/uploads/... or uploads/...) -> prepends backend URL.
 * - Dummy filenames ("photo.jpg", "alice.png", etc.) -> falls back to default avatar.
 */
export const getPhotoUrl = (path?: string): string => {
  if (!path || typeof path !== "string" || path.trim() === "") {
    return DEFAULT_AVATAR;
  }

  const cleanPath = path.trim();
  const lowerPath = cleanPath.toLowerCase();

  // Check if path ends with any dummy filename
  const isDummy = DUMMY_FILENAMES.some(
    (dummy) => lowerPath.endsWith(`/${dummy}`) || lowerPath === dummy
  );
  if (isDummy) {
    return DEFAULT_AVATAR;
  }

  // Return unchanged if already an absolute URL or base64 image data
  if (
    cleanPath.startsWith("http://") ||
    cleanPath.startsWith("https://") ||
    cleanPath.startsWith("data:image/")
  ) {
    return cleanPath;
  }

  // Check if it's a valid local upload path
  if (cleanPath.startsWith("/uploads/") || cleanPath.startsWith("uploads/")) {
    const relativePath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    return `${backendUrl}${relativePath}`;
  }

  return DEFAULT_AVATAR;
};
