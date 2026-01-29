import { useState, useEffect } from 'react';
import { Vehicle } from './types';
import VehicleModule from './components/VehicleModule';
import DriverModule from './components/DriverModule';
import MaintenanceModule from './components/MaintenanceModule';
import TripModule from './components/TripModule';
import FuelTrackingModule from './components/FuelTrackingModule';
import IncidentInsuranceModule from './components/IncidentInsuranceModule';
import ComplianceDocumentModule from './components/ComplianceDocumentModule';
import VehicleDisposalModule from './components/VehicleDisposalModule';
import ReportingAnalyticsDashboard from './components/ReportingAnalyticsDashboard';

type ActiveModule = 'vehicles' | 'drivers' | 'maintenance' | 'trips' | 'fuel' | 'incidents' | 'compliance' | 'disposal' | 'reporting';

function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('vehicles');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    const handleVehiclesUpdate = (event: CustomEvent<Vehicle[]>) => {
      setVehicles(event.detail);
    };

    window.addEventListener('vehiclesUpdated' as any, handleVehiclesUpdate as any);
    return () => {
      window.removeEventListener('vehiclesUpdated' as any, handleVehiclesUpdate as any);
    };
  }, []);

  const getPageTitle = () => {
    switch (activeModule) {
      case 'vehicles': return 'Vehicle Management';
      case 'drivers': return 'Driver Management';
      case 'maintenance': return 'Maintenance Schedule';
      case 'trips': return 'Trip Scheduling & Routes';
      case 'fuel': return 'Fuel Tracking & Efficiency';
      case 'incidents': return 'Incidents & Insurance';
      case 'compliance': return 'Compliance & Documents';
      case 'disposal': return 'Vehicle Disposal Management';
      case 'reporting': return 'Reporting & Analytics';
      default: return 'Dashboard';
    }
  };

  const navItems = [
    { id: 'vehicles' as ActiveModule, label: 'Vehicles', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )},
    { id: 'drivers' as ActiveModule, label: 'Drivers', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { id: 'maintenance' as ActiveModule, label: 'Maintenance', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { id: 'trips' as ActiveModule, label: 'Trips', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )},
    { id: 'fuel' as ActiveModule, label: 'Fuel Tracking', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )},
    { id: 'incidents' as ActiveModule, label: 'Incidents', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )},
    { id: 'compliance' as ActiveModule, label: 'Compliance', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )},
    { id: 'disposal' as ActiveModule, label: 'Disposal', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    )},
    { id: 'reporting' as ActiveModule, label: 'Reporting', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="hidden lg:block p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-slate-900 hidden sm:block">{getPageTitle()}</h1>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right: Notifications + Profile */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500">
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-slate-900">Admin User</div>
                <div className="text-xs text-slate-500">admin@system.com</div>
              </div>
              <button className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-center text-sm font-semibold hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                A
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900 bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            bg-white border-r border-slate-200 shadow-lg lg:shadow-none
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${isSidebarExpanded ? 'w-64' : 'lg:w-20 w-64'}
            flex flex-col
          `}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
            {isSidebarExpanded && (
              <div className="flex items-center gap-2 w-full">
                <svg className="h-10 w-auto" viewBox="0 0 760 520" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="20" y="380" fontFamily="Arial, sans-serif" fontSize="320" fontWeight="300" fill="#CBD5E1" letterSpacing="-10">DNS</text>
                  <text x="20" y="500" fontFamily="Arial, sans-serif" fontSize="60" fontWeight="100" fill="#CBD5E1" letterSpacing="15">DELTA NEOSOLUTIONS</text>
                  <path d="M430 150 L530 260 L430 370 Z" fill="#DC2626"/>
                  <path d="M520 150 L620 260 L520 370 Z" fill="#DC2626"/>
                  <path d="M610 150 L710 260 L610 370 Z" fill="#DC2626"/>
                </svg>
              </div>
            )}
            {!isSidebarExpanded && (
              <div className="w-full flex justify-center">
                <svg className="h-10 w-auto" viewBox="0 0 300 520" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 150 L150 260 L50 370 Z" fill="#DC2626"/>
                  <path d="M125 150 L225 260 L125 370 Z" fill="#DC2626"/>
                  <path d="M200 150 L300 260 L200 370 Z" fill="#DC2626"/>
                </svg>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                  ${activeModule === item.id
                    ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                  }
                  ${!isSidebarExpanded ? 'justify-center lg:px-2' : ''}
                `}
              >
                <span className={`flex-shrink-0 ${activeModule === item.id ? 'text-red-600' : ''}`}>
                  {item.icon}
                </span>
                {isSidebarExpanded && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-slate-200">
            <button className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-all ${!isSidebarExpanded ? 'justify-center lg:px-2' : ''}`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {isSidebarExpanded && (
                <span className="font-medium text-sm">Settings</span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="p-4 md:p-6 lg:p-8">
            {activeModule === 'vehicles' && <VehicleModule />}
            {activeModule === 'drivers' && <DriverModule />}
            {activeModule === 'maintenance' && (
              <MaintenanceModule vehicles={vehicles.map(v => ({ id: v.id, plate_number: v.plate_number }))} />
            )}
            {activeModule === 'trips' && <TripModule />}
            {activeModule === 'fuel' && <FuelTrackingModule />}
            {activeModule === 'incidents' && <IncidentInsuranceModule />}
            {activeModule === 'compliance' && <ComplianceDocumentModule />}
            {activeModule === 'disposal' && <VehicleDisposalModule />}
            {activeModule === 'reporting' && <ReportingAnalyticsDashboard />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
