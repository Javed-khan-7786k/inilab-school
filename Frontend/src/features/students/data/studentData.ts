export interface Student {
  id: number;
  photo: string;
  name: string;
  roll: string;
  email: string;
  className: string;
}

export const MOCK_STUDENTS: Student[] = [
  { id: 1, photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", name: "Alice Smith", roll: "101", email: "alice@example.com", className: "Class 1" },
  { id: 2, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", name: "Bob Johnson", roll: "102", email: "bob@example.com", className: "Class 1" },
  { id: 3, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", name: "Charlie Brown", roll: "103", email: "charlie@example.com", className: "Class 2" },
  { id: 4, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", name: "Diana Prince", roll: "104", email: "diana@example.com", className: "Class 2" },
  { id: 5, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop", name: "Ethan Hunt", roll: "105", email: "ethan@example.com", className: "Class 3" },
  { id: 6, photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop", name: "Fiona Gallagher", roll: "106", email: "fiona@example.com", className: "Class 3" },
];
