export default function FormModal({
  isOpen,
  title,
  fields,
  values,
  onChange,
  onClose,
  onSubmit,
  submitLabel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <label key={field.name} className="block text-sm">
                <span className="mb-1.5 block text-slate-600 dark:text-slate-300">{field.label}</span>
                {field.type === "select" ? (
                  <select
                    value={values[field.name] ?? ""}
                    onChange={(event) => onChange(field.name, event.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-700 outline-none ring-blue-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {(field.options || ["Active", "Inactive"]).map((option) => {
                      const optionValue =
                        typeof option === "string" ? option : option.value;
                      const optionLabel =
                        typeof option === "string" ? option : option.label;

                      return (
                        <option key={optionValue} value={optionValue}>
                          {optionLabel}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    required={field.required !== false}
                    value={values[field.name] ?? ""}
                    onChange={(event) => onChange(field.name, event.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-700 outline-none ring-blue-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    placeholder={field.placeholder || field.label}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}