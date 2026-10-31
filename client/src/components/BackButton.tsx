import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  label?: string;
}

function BackButton({
  to,
  label = "Back",
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="group inline-flex items-center gap-2 rounded-full py-1 pr-3 text-sm font-semibold text-slate-500 transition hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 transition group-hover:-translate-x-0.5 group-hover:ring-blue-200">
        <ArrowLeft size={16} strokeWidth={2.5} />
      </span>
      {label}
    </button>
  );
}

export default BackButton;
