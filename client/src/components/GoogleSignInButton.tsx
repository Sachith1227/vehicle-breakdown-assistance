import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import { googleLoginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/apiError";

// =====================================================
// GOOGLE SIGN-IN BUTTON
// =====================================================
// Renders nothing unless VITE_GOOGLE_CLIENT_ID is set.

export const googleEnabled = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

interface GoogleSignInButtonProps {
  text?: "signin_with" | "signup_with" | "continue_with";
  onError: (message: string) => void;
}

export default function GoogleSignInButton({
  text = "continue_with",
  onError,
}: GoogleSignInButtonProps) {
  const navigate = useNavigate();
  const { login } = useAuth();

  if (!googleEnabled) return null;

  return (
    <div>
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          or
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          text={text}
          shape="pill"
          size="large"
          width="320"
          onSuccess={async (response) => {
            try {
              const data = await googleLoginUser(response.credential!);

              login(data.token, data.user);

              navigate(
                data.user.role === "SERVICE_PROVIDER" ? "/mechanic" : "/dashboard"
              );
            } catch (error: any) {
              console.error("Google login error:", error);
              onError(getErrorMessage(error, "Google sign-in failed. Please try again."));
            }
          }}
          onError={() => onError("Google sign-in was cancelled or failed.")}
        />
      </div>
    </div>
  );
}
