import React from "react";
import {
  LayoutDashboard,
  Shapes,
  Box,
  Component,
  Users,
  BadgeIndianRupee,
  Crown,
  Settings,
  ChevronDown,
  Building2,
  CalendarDays,
  Wrench,
  UserCog,
  HandCoins,
  Clock,
  MonitorPlay,
  MessageSquareQuote,
  Contact,
  HelpCircle,
  Building,
  MapPin,
  Landmark,
  FileText,
  Star,
  type LucideProps,
  ListOrdered,
  X,
  NotebookTabs,
  LogOut,
  LockKeyholeOpen,
  KeyRound,
  CircleUserRound,
  Activity,
  LandPlot, 
  User,
  Warehouse
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  Shapes,
  Box,
  Component,
  Users,
  BadgeIndianRupee,
  Crown,
  Settings,
  ChevronDown,
  Building2,
  CalendarDays,
  Wrench,
  UserCog,
  HandCoins,
  Clock,
  MonitorPlay,
  MessageSquareQuote,
  Contact,
  HelpCircle,
  Building,
  MapPin,
  Landmark,
  FileText,
  Star,
  X,
  ListOrdered,
  NotebookTabs,
  LogOut,
  LockKeyholeOpen,
  KeyRound,
  CircleUserRound,
  Activity,
  User,
  LandPlot,
  Warehouse 
};

interface IconProps extends LucideProps {
  name: keyof typeof iconMap;
}

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = iconMap[name];
  return LucideIcon ? <LucideIcon {...props} /> : null;
};

export default Icon;
