import ArchiveCard from "@/components/ArchiveCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function Supplements() {
  //todo: remove mock functionality
  const supplements = [
    {
      id: "1",
      title: "Vitamin D3",
      subtitle: "5000 IU - Daily",
      tags: ["Morning", "Health"]
    },
    {
      id: "2",
      title: "Omega-3 Fish Oil",
      subtitle: "1000mg - Daily",
      tags: ["Morning", "Heart Health"]
    },
    {
      id: "3",
      title: "Magnesium",
      subtitle: "400mg - Evening",
      tags: ["Evening", "Sleep"]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2" data-testid="text-supplements-title">Supplement Archive</h1>
          <p className="text-muted-foreground">Track your supplements and vitamins</p>
        </div>
        <Button data-testid="button-add-supplement">
          <Plus className="w-4 h-4 mr-2" />
          Add Supplement
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search supplements..." 
          className="pl-10"
          data-testid="input-search-supplements"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {supplements.map((supplement) => (
          <ArchiveCard
            key={supplement.id}
            {...supplement}
            onClick={() => console.log(`Clicked ${supplement.title}`)}
          />
        ))}
      </div>
    </div>
  );
}
