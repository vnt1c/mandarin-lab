import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { useAuthStore } from "@/stores/authStore";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const error = useAuthStore((s) => s.error);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-strong">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            Welcome to Mandarin Lab
          </DialogTitle>
          <DialogDescription>
            Sign in with Google to get started.
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <GoogleButton />
      </DialogContent>
    </Dialog>
  );
};
