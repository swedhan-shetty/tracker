import ArchiveCard from "@/components/ArchiveCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function Books() {
  //todo: remove mock functionality
  const books = [
    {
      id: "1",
      title: "Atomic Habits",
      subtitle: "James Clear",
      tags: ["Self-Help", "Productivity"]
    },
    {
      id: "2",
      title: "Deep Work",
      subtitle: "Cal Newport",
      tags: ["Productivity", "Focus"]
    },
    {
      id: "3",
      title: "The Power of Now",
      subtitle: "Eckhart Tolle",
      tags: ["Mindfulness", "Spirituality"]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2" data-testid="text-books-title">Books</h1>
          <p className="text-muted-foreground">Track your reading journey</p>
        </div>
        <Button data-testid="button-add-book">
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search books..." 
          className="pl-10"
          data-testid="input-search-books"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <ArchiveCard
            key={book.id}
            {...book}
            onClick={() => console.log(`Clicked ${book.title}`)}
          />
        ))}
      </div>
    </div>
  );
}
