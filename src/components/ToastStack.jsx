export default function ToastStack({ toasts, onClose }) {
  return (
    <div className="fixed right-4 top-4 z-[60] space-y-2">
      {toasts.map((toast) => {
        const tone = toast.type === "error"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700";

        return (
          <div
            key={toast.id}
            className={"min-w-64 rounded-xl border px-3 py-2 text-sm shadow " + tone}
          >
            <div className="flex items-start justify-between gap-2">
              <p>{toast.message}</p>
              <button
                type="button"
                onClick={() => onClose(toast.id)}
                className="rounded px-1.5 py-0.5 text-xs hover:bg-black/5"
              >
                x
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}