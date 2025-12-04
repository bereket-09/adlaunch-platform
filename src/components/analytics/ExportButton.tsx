import { useState } from "react";
import { Download, FileSpreadsheet, FileText, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ExportButtonProps {
  data?: any[];
  filename?: string;
  variant?: "default" | "outline" | "ghost";
}

const ExportButton = ({ data = [], filename = "export", variant = "outline" }: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    setIsExporting(true);
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`${format.toUpperCase()} export started`, {
      description: `${filename}.${format} will be downloaded shortly.`
    });
    
    setIsExporting(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className="gap-2" disabled={isExporting}>
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2 cursor-pointer">
          <FileText className="h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('xlsx')} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2 cursor-pointer">
          <File className="h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
