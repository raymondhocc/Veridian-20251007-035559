import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3, Globe, LayoutDashboard, Settings, BotMessageSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/compare', icon: BarChart3, label: 'Comparative Analysis' },
  { to: '/regional', icon: Globe, label: 'Regional Insights' },
  { to: '/alerts', icon: Settings, label: 'Alerts Configuration' },
];
export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-4 space-y-8">
      <div className="flex items-center space-x-2 px-2">
        <BotMessageSquare className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold cal-sans">Veridian</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200',
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}