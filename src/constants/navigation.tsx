import { Home, TrendingUp, Calendar } from "lucide-react";

export const menuItems = [
  { 
    path: "/", 
    name: "Home", 
    icon: <Home size={20} /> 
  },
  { 
    path: "/top-airing", 
    name: "Top Airing", 
    icon: <TrendingUp size={20} /> 
  },
  { 
    path: "/seasonal", 
    name: "Current Season", 
    icon: <Calendar size={20} /> 
  },
];