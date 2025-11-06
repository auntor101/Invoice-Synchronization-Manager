import React, { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, Eye, Trash2, MoreVertical, FileText, Mail, Share2 } from 'lucide-react';

export default function InvoiceTable({ invoices, onDelete }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showActions, setShowActions] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'review':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleExportInvoice = (invoice) => {
    const data = JSON.stringify(invoice, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.id}.json`;
    a.click();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 text-sm font-semibold text-gray-600">
          <div className="col-span-2">Invoice #</div>
          <div className="col-span-3">Supplier</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Confidence</div>
          <div className="col-span-1">Actions</div>
        </div>

        <div className="divide-y divide-gray-100">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="relative">
              <div className="md:hidden p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800">{invoice.id}</p>
                    <p className="text-sm text-gray-600">{invoice.supplier}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(invoice.status)}
                    <button
                      onClick={() => setShowActions(showActions === invoice.id ? null : invoice.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-500">{invoice.date}</p>
                    <p className="font-semibold text-lg">{invoice.amount}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getConfidenceColor(invoice.confidence)}`}
                        style={{ width: `${invoice.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{invoice.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 cursor-pointer items-center">
                <div className="col-span-2 font-medium text-gray-800">{invoice.id}</div>
                <div className="col-span-3 text-gray-700">{invoice.supplier}</div>
                <div className="col-span-2 text-gray-600">{invoice.date}</div>
                <div className="col-span-2 font-semibold text-gray-800">{invoice.amount}</div>
                
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getConfidenceColor(invoice.confidence)}`}
                        style={{ width: `${invoice.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{invoice.confidence}%</span>
                  </div>
                </div>
                
                <div className="col-span-1 flex items-center gap-2">
                  {getStatusIcon(invoice.status)}
                  <button
                    onClick={() => setShowActions(showActions === invoice.id ? null : invoice.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {showActions === invoice.id && (
                <div className="absolute right-4 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10">
                  <button
                    onClick={() => {
                      handleViewInvoice(invoice);
                      setShowActions(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      handleExportInvoice(invoice);
                      setShowActions(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Export
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-left text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      onDelete(invoice.id);
                      setShowActions(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 w-full text-left text-sm text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Invoice Details</h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Invoice Number</p>
                  <p className="font-semibold">{selectedInvoice.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedInvoice.status)}
                    <span className="capitalize">{selectedInvoice.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Supplier</p>
                  <p className="font-semibold">{selectedInvoice.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold">{selectedInvoice.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold text-lg">{selectedInvoice.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Confidence Score</p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getConfidenceColor(selectedInvoice.confidence)}`}
                        style={{ width: `${selectedInvoice.confidence}%` }}
                      ></div>
                    </div>
                    <span className="font-medium">{selectedInvoice.confidence}%</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Additional Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    This invoice was processed automatically using OCR technology. 
                    {selectedInvoice.confidence < 80 && ' Manual review is recommended due to low confidence score.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
