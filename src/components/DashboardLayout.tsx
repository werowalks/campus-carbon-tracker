import React from 'react';
import { Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Leaf,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Shield,
  UserCog,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, profile, isAuthenticated, isLoading, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <Leaf className="w-12 h-12 text-primary" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Log Energy', href: '/log', icon: PlusCircle },
  ];

  if (isAdmin) {
    navigation.push({ name: 'Admin Panel', href: '/admin', icon: Shield });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg eco-gradient flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-lg hidden sm:block">
                Carbon Dashboard
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className={isActive ? 'bg-secondary' : ''}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.name || 'User'} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {getInitials(profile?.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium">
                  {profile?.name || user?.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{profile?.name || 'User'}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && (
                <DropdownMenuItem className="text-primary">
                  <Shield className="w-4 h-4 mr-2" />
                  Administrator
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <UserCog className="w-4 h-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}
