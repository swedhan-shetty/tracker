import ArchiveCard from "@/components/ArchiveCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function Workouts() {
  //todo: remove mock functionality
  const workouts = [
    {
      id: "1",
      title: "Push Day",
      subtitle: "Chest, Shoulders, Triceps - 45 min",
      tags: ["Strength", "Upper Body"]
    },
    {
      id: "2",
      title: "Pull Day",
      subtitle: "Back, Biceps - 50 min",
      tags: ["Strength", "Upper Body"]
    },
    {
      id: "3",
      title: "Leg Day",
      subtitle: "Quads, Hamstrings, Calves - 60 min",
      tags: ["Strength", "Lower Body"]
    },
    {
      id: "4",
      title: "Cardio Session",
      subtitle: "Running - 30 min",
      tags: ["Cardio", "Endurance"]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2" data-testid="text-workouts-title">Workouts</h1>
          <p className="text-muted-foreground">Track your exercise routines</p>
        </div>
        <Button data-testid="button-add-workout">
          <Plus className="w-4 h-4 mr-2" />
          Add Workout
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search workouts..." 
          className="pl-10"
          data-testid="input-search-workouts"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workouts.map((workout) => (
          <ArchiveCard
            key={workout.id}
            {...workout}
            onClick={() => console.log(`Clicked ${workout.title}`)}
          />
        ))}
      </div>
    </div>
  );
}
