import { Outlet } from 'react-router-dom'
import { SidebarProvider } from './ui/sidebar'
import AppSidebar from './ui/AppSidebar'
import Header from './ui/Header'

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-6 bg-muted/10">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

