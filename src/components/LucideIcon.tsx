import * as Icons from 'lucide-react';
import type { LucideIcon as LucideIconType } from 'lucide-react';

interface LucideIconProps {
  name: keyof typeof Icons;
  className?: string;
  size?: number;
}

export default function LucideIcon({ name, className = '', size = 24 }: LucideIconProps) {
  // Map string names to the corresponding component
  const IconComponent = Icons[name] as LucideIconType | undefined;

  if (!IconComponent) {
    // Fallback to HelpCircle if not found
    const Fallback = Icons.HelpCircle;
    return <Fallback className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
}
