"use client";

import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SchedulerModal } from "./SchedulerModal";

interface SchedulerButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
  defaultMeetingType?: string;
  defaultMeetingMode?: string;
  fullWidth?: boolean;
}

export function SchedulerButton({ 
  variant = "primary", 
  size = "md",
  className = "",
  children,
  defaultMeetingType = "general",
  defaultMeetingMode = "video",
  fullWidth = false
}: SchedulerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${fullWidth ? 'w-full' : ''} ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Calendar className="mr-2 w-5 h-5" />
        {children || "Schedule Meeting"}
      </Button>
      <SchedulerModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        defaultMeetingType={defaultMeetingType}
        defaultMeetingMode={defaultMeetingMode}
      />
    </>
  );
}

