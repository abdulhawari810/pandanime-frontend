export default function Card({ type, children }) {
  return (
    <>
      <div
        className={
          type === "wrap"
            ? "flex justify-between items-start flex-wrap"
            : "flex justify-between items-center flex-nowrap overflow-scroll"
        }
      >
        {children}
      </div>
    </>
  );
}
