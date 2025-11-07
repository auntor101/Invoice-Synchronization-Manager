import React, { useState, useEffect } from 'react';
import { Camera, Upload, Wifi, WifiOff, Clock, CheckCircle, AlertTriangle, Search, Filter, Download, Settings, X, Eye, Trash2, RefreshCw } from 'lucide-react';
import InvoiceTable from './InvoiceTable';
import StatsCards from './StatsCards';
import SearchBar from './SearchBar';
import OfflineBanner from './OfflineBanner';
import OfflineQueue from './OfflineQueue';
import { useInvoiceData } from '../hooks/useInvoiceData';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useQueueManager } from '../hooks/useQueueManager';

export default function InvoiceManager() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const isOnline = useNetworkStatus();
  const { invoices, pendingCount, stats, searchTerm, setSearchTerm, filterStatus, setFilterStatus, deleteInvoice, refreshData } = useInvoiceData();
  const { queuedInvoices, updatePriority, syncQueue, removeFromQueue } = useQueueManager(invoices);
  const [showSettings, setShowSettings] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleSync = async () => {
    setIsSyncing(true);
    await syncQueue();
    await refreshData();
    setTimeout(() => setIsSyncing(false), 1500);
  };

  const handleScanInvoice = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'camera';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log('Processing:', file.name);
      }
    };
    input.click();
  };

  const handleUploadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.png,.jpg,.jpeg';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      console.log('Uploading:', files.length, 'files');
    };
    input.click();
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center relative">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <svg className="w-3 h-3 text-white absolute -bottom-0.5 -right-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Invoice Synchronization Manager</h1>
                <p className="text-xs text-gray-500">Enterprise Account</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span className="font-medium">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{pendingCount} Pending</span>
              </div>
              
              <button 
                onClick={handleSync}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSyncing}
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
              
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button 
            onClick={handleScanInvoice}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-lg flex items-center justify-center gap-3 shadow-lg transition-all transform hover:scale-[1.02]"
          >
            <Camera className="w-6 h-6" />
            <span className="font-semibold text-lg">Scan Invoice</span>
          </button>
          <button 
            onClick={handleUploadFile}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-4 rounded-lg flex items-center justify-center gap-3 shadow border border-gray-200 transition-all transform hover:scale-[1.02]"
          >
            <Upload className="w-6 h-6" />
            <span className="font-semibold text-lg">Upload File</span>
          </button>
        </div>

        <OfflineQueue
          queuedInvoices={queuedInvoices}
          onUpdatePriority={updatePriority}
          onSyncNow={handleSync}
          onRemoveFromQueue={removeFromQueue}
          isOnline={isOnline}
          isSyncing={isSyncing}
        />

        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          invoiceCount={invoices.length}
        />

        <InvoiceTable 
          invoices={invoices}
          onDelete={deleteInvoice}
        />

        <StatsCards stats={stats} />
      </div>

      {!isOnline && <OfflineBanner />}

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between py-2">
                  <span className="text-gray-700">Auto-sync when online</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </label>
              </div>
              <div>
                <label className="flex items-center justify-between py-2">
                  <span className="text-gray-700">Low confidence alerts</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </label>
              </div>
              <div>
                <label className="flex items-center justify-between py-2">
                  <span className="text-gray-700">Dark mode</span>
                  <input type="checkbox" className="toggle" />
                </label>
              </div>
              <div className="pt-4 border-t">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
