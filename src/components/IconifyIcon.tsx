// src/components/IconifyIcon.tsx
import React from "react";
import { Icon } from "@iconify/react";

interface IconifyIconProps {
  icon: string;
  className?: string;
}

export default function IconifyIcon({
  icon,
  className = "w-6 h-6",
}: IconifyIconProps) {
  return <Icon icon={icon} className={className} />;
}
