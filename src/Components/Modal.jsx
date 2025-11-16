export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed top-[100px] right-5 bg-white w-auto h-auto rounded-lg z-50">
        {children}
      </div>
    </>
  );
}
