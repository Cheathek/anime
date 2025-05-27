import { Home, CalendarClock, Upload } from "lucide-react";

export const menuItems = [
  { 
    path: "/", 
    name: "Home", 
    icon: <Home size={20} /> 
  },
  { 
    path: "/top-airing", 
    name: "Top Airing", 
    icon: <Upload size={20} /> 
  },
  { 
    path: "/seasonal", 
    name: "Current Season", 
    icon: <CalendarClock size={20} /> 
  },
];