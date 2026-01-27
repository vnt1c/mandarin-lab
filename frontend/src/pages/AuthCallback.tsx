import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().finally(() => {
      navigate("/breakdown", { replace: true });
    });
  }, [navigate]);

  return (
    <div className="p-6">
      Signing you in…
    </div>
  );
}
