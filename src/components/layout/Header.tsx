import { useLocation } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useMetricsStore } from "@/hooks/useMetricsStore"
import { Platform } from "@shared/types"
import { AlertsPopover } from './AlertsPopover';
const pageTitles: Record<string, string> = {
  '/': 'Dashboard Overview',
  '/compare': 'Comparative Analysis',
  '/regional': 'Regional Insights',
  '/alerts': 'Alerts Configuration',
};
export function Header() {
  const location = useLocation();
  const platform = useMetricsStore((state) => state.platform);
  const setPlatform = useMetricsStore((state) => state.setPlatform);
  const metrics = useMetricsStore((state) => state.metrics);
  const getTitle = () => {
    const baseTitle = pageTitles[location.pathname] || 'Dashboard';
    if (location.pathname === '/' && metrics) {
      return `${metrics.platform} Overview`;
    }
    return baseTitle;
  };
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-6 md:px-8">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold cal-sans">
          {getTitle()}
        </h1>
      </div>
      <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        {location.pathname === '/' && (
          <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Solana">Solana</SelectItem>
              <SelectItem value="Ethereum">Ethereum</SelectItem>
              <SelectItem value="BSC">Binance Smart Chain</SelectItem>
            </SelectContent>
          </Select>
        )}
        <AlertsPopover />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@user" />
                <AvatarFallback>CF</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}