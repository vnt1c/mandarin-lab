import { useEffect, useState } from "react";
import type { SentenceAnalysis, SavedAnalysis } from "@shared";
import { fetchSaved, deleteSaved } from "@/services/savedApi";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SavedListProps {
  onReanalyze: (item: SavedAnalysis) => void;
}

export const SavedList = ({ onReanalyze }: SavedListProps) => {
  const [saved, setSaved] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved()
      .then((items) => {
        console.log('Fetched saved items:', items);
        setSaved(items);
      })
      .catch(() =>
        toast({ title: "Failed to load saved sentences", variant: "destructive" })
      )
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteSaved(id);
      setSaved((prev) => prev.filter((x) => x.id !== id));
      toast({ title: "Sentence removed from saved list" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="glass-strong rounded-2xl p-12 text-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (saved.length === 0) {
    return (
      <div className="glass-strong rounded-2xl p-12 text-center">
        <p className="text-muted-foreground">No saved sentences yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Analyze sentences and save them for later review.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {saved.map((item) => (
        <div
          key={item.id}
          className="glass-strong rounded-2xl p-6 shadow-soft"
        >
          <div className="mb-4">
            <h3 className="text-xl font-serif font-semibold mb-2">
              {item.sentence}
            </h3>
            <p className="text-sm text-muted-foreground">{item.translation}</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReanalyze(item)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Re-analyze
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
