import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArchiveCardProps {
  id: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  image?: string;
  onClick?: () => void;
}

export default function ArchiveCard({ 
  id, 
  title, 
  subtitle, 
  tags = [],
  image,
  onClick 
}: ArchiveCardProps) {
  return (
    <Card 
      className="overflow-hidden hover-elevate cursor-pointer transition-all"
      onClick={onClick}
      data-testid={`card-archive-${id}`}
    >
      {image && (
        <div className="aspect-video bg-accent flex items-center justify-center">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate" data-testid={`text-archive-title-${id}`}>
              {title}
            </h4>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate mt-1" data-testid={`text-archive-subtitle-${id}`}>
                {subtitle}
              </p>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              console.log('More options clicked');
            }}
            data-testid={`button-archive-more-${id}`}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs" data-testid={`badge-tag-${tag}`}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
