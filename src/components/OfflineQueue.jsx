import React, { useState } from 'react';
import { Clock, AlertCircle, DollarSign, TrendingUp, ChevronUp, ChevronDown, Wifi, X, PlayCircle, Pause } from 'lucide-react';

export default function OfflineQueue({ queuedInvoices, onUpdatePriority, onSyncNow, onRemoveFromQueue, isOnline, isSyncing }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const calculateEstimatedTime = (invoiceCount) => {
    const avgTimePerInvoice = 3;
    const totalSeconds = invoiceCount * avgTimePerInvoice;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  const getPriorityColor = (priority) => {
    if (priority >= 80) return 'text-red-600 bg-red-50';
    if (priority >= 60) return 'text-orange-600 bg-orange-50';
    if (priority >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getPriorityLabel = (priority) => {
    if (priority >= 80) return 'Critical';
    if (priority >= 60) return 'High';
    if (priority >= 40) return 'Medium';
    return 'Low';
  };

  const movePriority = (invoiceId, direction) => {
    const currentIndex = queuedInvoices.findIndex(inv => inv.id === invoiceId);
    if (direction === 'up' && currentIndex > 0) {
      onUpdatePriority(invoiceId, currentIndex - 1);
    } else if (direction === 'down' && currentIndex < queuedInvoices.length - 1) {
      onUpdatePriority(invoiceId, currentIndex + 1);
    }
  };

  if (queuedInvoices.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md border-l-4 border-orange-500 overflow-hidden mb-6">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {queuedInvoices.length}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Sync Queue</h3>
            <p className="text-sm text-gray-500">
              {queuedInvoices.length} invoice{queuedInvoices.length !== 1 ? 's' : ''} waiting • 
              Est. {calculateEstimatedTime(queuedInvoices.length)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isOnline && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
              <Wifi className="w-4 h-4" />
              <span>Offline</span>
            </div>
          )}
          {isOnline && !isSyncing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSyncNow();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <PlayCircle className="w-4 h-4" />
              Sync Now
            </button>
          )}
          {isSyncing && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              Syncing...
            </div>
          )}
          <button className="p-1 hover:bg-gray-200 rounded">
            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200">
          <div className="bg-gray-50 px-4 py-2 text-xs font-medium text-gray-600 flex items-center justify-between">
            <span>Invoices will sync in priority order when online</span>
            {isOnline && (
              <span className="text-emerald-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                Connected
              </span>
            )}
          </div>

          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {queuedInvoices.map((invoice, index) => (
              <div 
                key={invoice.id} 
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{invoice.id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(invoice.priority)}`}>
                          {getPriorityLabel(invoice.priority)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Supplier</p>
                        <p className="font-medium text-gray-700 truncate">{invoice.supplier}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Amount</p>
                        <p className="font-semibold text-gray-800">{invoice.amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Confidence</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${invoice.confidence >= 80 ? 'bg-green-500' : invoice.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${invoice.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{invoice.confidence}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Age</p>
                        <p className="font-medium text-gray-700">{invoice.age || '2h ago'}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>Amount weight: {invoice.amountWeight || '30%'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Age weight: {invoice.ageWeight || '40%'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Confidence weight: {invoice.confidenceWeight || '30%'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => movePriority(invoice.id, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up in queue"
                    >
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => movePriority(invoice.id, 'down')}
                      disabled={index === queuedInvoices.length - 1}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down in queue"
                    >
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => onRemoveFromQueue(invoice.id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors mt-1"
                      title="Remove from queue"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {invoice.reason && (
                  <div className="mt-3 flex items-start gap-2 bg-blue-50 p-2 rounded text-xs">
                    <AlertCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-700">
                      <strong>Priority reason:</strong> {invoice.reason}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  Total estimated time: <strong className="text-gray-800">{calculateEstimatedTime(queuedInvoices.length)}</strong>
                </span>
                <span className="text-gray-600">
                  Average: <strong className="text-gray-800">3s per invoice</strong>
                </span>
              </div>
              {isOnline && (
                <span className="text-xs text-gray-500">
                  Sync will begin automatically or click "Sync Now"
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
