
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Users, Building, Menu, X, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, isSuperAdmin, roleLoading } = useAuth();

  console.log('Layout render - isSuperAdmin:', isSuperAdmin, 'roleLoading:', roleLoading);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FileText },
    { id: 'fornecedores', label: 'Fornecedores', icon: Users },
    { id: 'orgaos', label: 'Órgãos', icon: Building },
  ];

  // Add user management for superadmin only - wait for role to load
  if (!roleLoading && isSuperAdmin) {
    console.log('Adding Usuários menu item for superadmin');
    menuItems.push({ id: 'usuarios', label: 'Usuários', icon: UserPlus });
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSignOut = async () => {
    await signOut();
  };

  // Show loading spinner while role is loading
  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Carregando permissões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="md:hidden">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Sistema de Licitações</h1>
              <p className="text-sm text-muted-foreground">Controle e gestão empresarial</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "default" : "ghost"}
                    onClick={() => onNavigate(item.id)}
                    className={currentView === item.id ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={toggleSidebar} />
            <Card className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold">Menu</h2>
                  <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={currentView === item.id ? "default" : "ghost"}
                      className={`w-full justify-start ${currentView === item.id ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      onClick={() => {
                        onNavigate(item.id);
                        setSidebarOpen(false);
                      }}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
                
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
