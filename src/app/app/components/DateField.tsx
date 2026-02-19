"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DateField = ({
  label,
  value,
  onChange,
  placeholder = "Pick a date",
}: DateFieldProps) => {
  const [date, setDate] = React.useState<Date | undefined>(() => {
    return value ? new Date(value) : undefined;
  });

  // Update local state when value prop changes
  React.useEffect(() => {
    if (value) {
      const newDate = new Date(value);
      setDate(newDate);
    }
  }, [value]);

  const handleDateSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      if (selectedDate) {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        onChange(formattedDate);
        setDate(selectedDate);
      }
    },
    [onChange]
  );

  const minAgeDate = React.useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date;
  }, []);

  return (
    <div className="border border-ui-shade/10 rounded-xl p-2">
      <Label className="text-ui-shade/80">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-left font-normal mt-3",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date instanceof Date && !isNaN(date.getTime()) ? (
              format(date, "PPP")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full  p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={(date) => date > minAgeDate}
            defaultMonth={new Date()}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateField;
