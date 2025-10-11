import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";

export default function Export() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-export-title">Export Data</h1>
        <p className="text-muted-foreground">Download your tracking data in various formats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 hover-elevate cursor-pointer" data-testid="card-export-json">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <FileJson className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">JSON Format</h3>
              <p className="text-sm text-muted-foreground mt-1">Raw data export</p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </Card>

        <Card className="p-6 hover-elevate cursor-pointer" data-testid="card-export-csv">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-chart-2" />
            </div>
            <div>
              <h3 className="font-semibold">CSV Format</h3>
              <p className="text-sm text-muted-foreground mt-1">Spreadsheet compatible</p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </Card>

        <Card className="p-6 hover-elevate cursor-pointer" data-testid="card-export-pdf">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <FileText className="w-6 h-6 text-chart-3" />
            </div>
            <div>
              <h3 className="font-semibold">PDF Report</h3>
              <p className="text-sm text-muted-foreground mt-1">Formatted summary</p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Export Options</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <Select defaultValue="all">
              <SelectTrigger data-testid="select-date-range">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Data Type</label>
            <Select defaultValue="all">
              <SelectTrigger data-testid="select-data-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All data</SelectItem>
                <SelectItem value="entries">Daily entries</SelectItem>
                <SelectItem value="tasks">Tasks</SelectItem>
                <SelectItem value="workouts">Workouts</SelectItem>
                <SelectItem value="macros">Macros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
}
