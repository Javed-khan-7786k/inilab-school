/**
 * Footer — Dashboard footer with copyright and version.
 *
 * Why: Isolates the footer markup for single-responsibility. Static content.
 *
 * Props: none
 */

export function Footer() {
  return (
    <div className="flex justify-between border-t border-brdr bg-white px-[20px] py-[10px] text-[11px] text-muted">
      <div>
        Copyright &copy;{" "}
        <a href="#" className="text-calblue">
          EduKing
        </a>{" "}
        - School Management System
      </div>
      <div>v6.5</div>
    </div>
  );
}
