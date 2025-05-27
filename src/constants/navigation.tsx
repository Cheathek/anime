import { Home, CalendarClock, Upload, Heart } from "lucide-react";

export const menuItems = [
  { 
    path: "/", 
    name: "Home", 
    icon: <Home size={20} className="text-blue-500" />,
    activeColor: "text-blue-500"
  },
  { 
    path: "/top-airing", 
    name: "Top Airing", 
    icon: <Upload size={20} className="text-green-500" />,
    activeColor: "text-green-500"
  },
  { 
    path: "/seasonal", 
    name: "Current Season", 
    icon: <CalendarClock size={20} className="text-orange-500" />,
    activeColor: "text-orange-500"
  },
  {
    path: "/favorites",
    name: "Favorites",
    icon: <Heart size={20} className="text-red-500" />,
    activeColor: "text-red-500"
  }
];