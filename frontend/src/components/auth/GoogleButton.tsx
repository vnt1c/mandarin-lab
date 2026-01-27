import { useAuthStore } from "@/stores/authStore";

export function GoogleButton() {
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const isLoading = useAuthStore((s) => s.isLoading);

  return (
    <button
      type="button"
      onClick={loginWithGoogle}
      disabled={isLoading}
      className="
        w-full flex items-center justify-center gap-3
        rounded-md border border-border bg-white
        px-4 py-3 font-medium text-gray-800
        shadow-sm hover:bg-gray-50
        disabled:opacity-60
      "
    >
      {/* Official Google G (inline SVG) */}
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.61l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 3.02-2.26 5.58-4.8 7.29l7.73 5.99C44.42 37.88 46.98 31.65 46.98 24.55z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.81l-7.73-5.99c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>

      Continue with Google
    </button>
  );
}
