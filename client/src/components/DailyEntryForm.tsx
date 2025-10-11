import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

export default function DailyEntryForm() {
  const [mood, setMood] = useState([5]);
  const [energy, setEnergy] = useState([5]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto" data-testid="form-daily-entry">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">General</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="mood">Mood ({mood[0]}/10)</Label>
            <Slider 
              id="mood"
              value={mood} 
              onValueChange={setMood} 
              max={10} 
              step={1} 
              className="mt-2"
              data-testid="slider-mood"
            />
          </div>
          <div>
            <Label htmlFor="energy">Energy Level ({energy[0]}/10)</Label>
            <Slider 
              id="energy"
              value={energy} 
              onValueChange={setEnergy} 
              max={10} 
              step={1} 
              className="mt-2"
              data-testid="slider-energy"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notes</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="highlights">Highlights</Label>
            <Textarea 
              id="highlights"
              placeholder="What were the highlights of your day?"
              className="mt-2 min-h-24"
              data-testid="input-highlights"
            />
          </div>
          <div>
            <Label htmlFor="challenges">Challenges</Label>
            <Textarea 
              id="challenges"
              placeholder="What challenges did you face?"
              className="mt-2 min-h-24"
              data-testid="input-challenges"
            />
          </div>
          <div>
            <Label htmlFor="gratitude">Gratitude</Label>
            <Input 
              id="gratitude"
              placeholder="What are you grateful for today?"
              className="mt-2"
              data-testid="input-gratitude"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" data-testid="button-cancel">
          Cancel
        </Button>
        <Button type="submit" data-testid="button-save">
          Save Entry
        </Button>
      </div>
    </form>
  );
}
