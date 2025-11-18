import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '../ui/sidebar'
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Search,
  PenTool,
  Scale,
  Settings,
  LogOut,
} from 'lucide-react'
import { Button } from '../ui/button'

const menuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'JurisGênio',
    url: '/jurisgenio',
    icon: MessageSquare,
  },
  {
    title: 'Acórdãos',
    url: '/acordaos',
    icon: FileText,
  },
  {
    title: 'Análises',
    url: '/analises',
    icon: Search,
  },
  {
    title: 'Peças',
    url: '/pecas',
    icon: PenTool,
  },
]

export default function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <Scale className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">JurisGênio</h1>
            <p className="text-xs text-sidebar-foreground/60">Assistente Jurídico</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

