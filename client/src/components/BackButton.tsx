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
      className="
        group
        inline-flex
        items-center
        gap-2
        rounded-xl
        border
        border-slate-200
        bg-white
        px-3
        py-2
        text-sm
        font-semibold
        text-slate-700
        shadow-sm
        transition-all
        duration-200
        hover:-translate-x-0.5
        hover:border-blue-200
        hover:bg-blue-50
        hover:text-blue-700
        hover:shadow-md
        active:scale-[0.98]
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:ring-offset-2
      "
    >
      <span
        className="
          flex
          h-7
          w-7
          items-center
          justify-center
          overflow-hidden
          rounded-full
          transition-transform
          duration-200
          group-hover:-translate-x-1
        "
      >
        <img
          src="/back-button.png"
          alt="Back"
          className="h-7 w-7 object-cover"
        />
      </span>

      <span>{label}</span>
    </button>
  );
}

export default BackButton;