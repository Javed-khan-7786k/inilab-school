# Menu Bar Icons Change Karne Ki Guide

Ye project React frontend aur Node.js backend dono use karta hai. Sidebar/menu ka icon backend se aata hai, aur frontend us icon naam ko actual Lucide icon mein convert karke screen par dikhata hai.

Isliye agar menu ka icon change karna hai, aam taur par **2 files** edit karni hongi.

## 1. Menu item ka icon naam change karo

File: `backend/src/constants/navigation.js`

Is file mein roles ke hisaab se sidebar menu lists hain, jaise Admin, Receptionist, Librarian, Teacher, Student, Parent etc.

Kisi menu item ka structure aisa dikhega:

```js
{ type: "link", data: { icon: "fa-user", label: "Student", href: "/dashboard/student" } }
```

Yahan sirf `icon` ki value change karo.

Example: Student ke saamne normal user ki jagah multiple users wala icon lagana ho:

```js
{ type: "link", data: { icon: "fa-users", label: "Student", href: "/dashboard/student" } }
```

### Dropdown / submenu ke icons

Dropdown parent ka icon is tarah hoga:

```js
{
  type: "treeview",
  data: {
    icon: "fa-bullhorn",
    label: "Announcement",
    children: [
      { icon: "fa-calendar", label: "Notice", href: "/dashboard/announcement/notice" }
    ]
  }
}
```

- Parent dropdown icon: `data.icon` change karo.
- Andar wale submenu item ka icon: `children` ke item mein `icon` change karo.

## 2. Naye icon ki frontend mapping add karo

File: `src/components/ui/Icon.tsx`

Is file ke `iconMap` object mein saare allowed icon names aur unke Lucide icons defined hain.

Pehle se example:

```tsx
"fa-user": Lucide.User,
"fa-book": Lucide.BookOpen,
"fa-envelope": Lucide.Mail,
```

Agar backend mein aapne `fa-users` likha hai, to isi object mein ye line add karni zaroori hai:

```tsx
"fa-users": Lucide.Users,
```

Final example:

```tsx
const iconMap = {
  "fa-user": Lucide.User,
  "fa-users": Lucide.Users,
  "fa-book": Lucide.BookOpen,
};
```

> Important: Backend mein jo name likha hai aur `Icon.tsx` mein jo key likhi hai, dono bilkul same hone chahiye. Example: `fa-users` dono jagah same likho.

## Kaam ke useful icons

| Menu ka kaam | Backend icon name | `Icon.tsx` mapping |
| --- | --- | --- |
| Dashboard | `fa-laptop` | `Lucide.LayoutDashboard` |
| Student / group | `fa-users` | `Lucide.Users` |
| Teacher | `fa-graduation-cap` | `Lucide.GraduationCap` |
| Parents | `fa-heart-handshake` | `Lucide.HandHeart` |
| Attendance | `fa-clipboard-check` | `Lucide.ClipboardCheck` |
| Message | `fa-message-circle` | `Lucide.MessageCircle` |
| Media | `fa-image` | `Lucide.Image` |
| Notice | `fa-megaphone` | `Lucide.Megaphone` |
| Event | `fa-calendar-days` | `Lucide.CalendarDays` |
| Holiday | `fa-plane` | `Lucide.Plane` |
| Visitor | `fa-contact` | `Lucide.Contact` |
| Settings | `fa-settings` | `Lucide.Settings` |

Table ke naye icon use karne par `Icon.tsx` mein mapping add karna mat bhoolna.

## Example: "Parents" icon change karna

### Backend file mein

`backend/src/constants/navigation.js` mein Parents search karo:

```js
{ type: "link", data: { icon: "fa-user", label: "Parents", href: "/dashboard/parents" } }
```

Isse change karke:

```js
{ type: "link", data: { icon: "fa-heart-handshake", label: "Parents", href: "/dashboard/parents" } }
```

### Frontend file mein

`src/components/ui/Icon.tsx` ke `iconMap` mein add karo:

```tsx
"fa-heart-handshake": Lucide.HandHeart,
```

## Agar icon show nahi ho raha ho

Agar screen par question-mark / round help icon dikhe, iska matlab hota hai ki icon naam backend mein to diya gaya hai, lekin `src/components/ui/Icon.tsx` ke `iconMap` mein uski mapping missing hai.

Fix: `iconMap` mein correct mapping add karo aur dono servers restart karo.

## Change ke baad kya karna hai

1. Files save karo.
2. Frontend Vite server restart karo (`npm run dev`).
3. Backend server bhi restart karo, kyunki menu data backend se aa raha hai.
4. Browser refresh karo (`Ctrl + F5`), phir updated icon check karo.

## Extra note

Frontend folder mein `src/constants/navigation.ts`, `src/constants/librarianDashboardData.ts`, aur `src/constants/receptionistDashboardData.ts` bhi hain. Lekin running app menu data API endpoint `/navigation/:role` se load kar rahi hai, isliye primary change `backend/src/constants/navigation.js` mein karo.
