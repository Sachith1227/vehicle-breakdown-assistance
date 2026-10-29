// =====================================================
// FORM ALERT (error / success banner)
// =====================================================

interface FormAlertProps {
  type: "error" | "success";
  message: string;
  onClose?: () => void;
}

export default function FormAlert({ type, message, onClose }: FormAlertProps) {
  const isError = type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`mt-6 flex items-start gap-3 rounded-xl border p-4 ${
        isError
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-green-200 bg-green-50 text-green-800"
      }`}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
          isError ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {isError ? "!" : "✓"}
      </span>

      <div className="flex-1">
        <p className="text-sm font-bold">
          {isError ? "Something's not right" : "Success"}
        </p>
        <p className="mt-0.5 text-sm">{message}</p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="rounded-md px-1.5 text-lg leading-none opacity-60 transition hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
}
