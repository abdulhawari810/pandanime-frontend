import { NavLink } from "react-router-dom";

export default function Breadcrumb({ links }) {
  console.log(links[0]);
  return (
    <>
      <div className="flex items-center gap-1.5 text-[20px]">
        <NavLink to={"/"} className="hover:text-indigo-600">
          <i className="ri-home-4-line text-2xl"></i>
        </NavLink>
        {Array.isArray(links) &&
          links.map((a, i) => (
            <div key={i} className="gap-1.5">
              <span> / </span>
              {links[i] === links[0] ? (
                <NavLink to={`/${links[0]}`} className="hover:text-indigo-600">
                  <span>{a}</span>
                </NavLink>
              ) : (
                <span>{a}</span>
              )}
            </div>
          ))}
      </div>
    </>
  );
}
