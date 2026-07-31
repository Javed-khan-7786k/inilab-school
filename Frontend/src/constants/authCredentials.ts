/**
 * authCredentials.ts — Valid login credentials for authentication.
 *
 * Why: Centralises all valid username/password pairs in one place.
 *      In a real app this would be a backend API call, but for this
 *      demo we validate against this list.
 */

export interface Credential {
  id: string;
  username: string;
  password: string;
  role: string;
}

export const validCredentials: Credential[] = [
  { id: "admin", username: "admin", password: "123456", role: "Admin" },
  { id: "teacher1", username: "teacher1", password: "123456", role: "Teacher" },
  { id: "student1", username: "student1", password: "123456", role: "Student" },
  { id: "parent1", username: "parent1", password: "123456", role: "Parent" },
  { id: "accountant", username: "accountant", password: "123456", role: "Accountant" },
  { id: "librarian", username: "librarian", password: "123456", role: "Librarian" },
  { id: "receptionist", username: "receptionist", password: "123456", role: "Receptionist" },
];

/**
 * Validates credentials against the known list.
 * Returns the matched credential on success, or null on failure.
 */
export function validateCredentials(
  username: string,
  password: string
): Credential | null {
  return (
    validCredentials.find(
      (c) => c.username === username && c.password === password
    ) ?? null
  );
}
