import { useState, useEffect, useMemo } from 'react';

export function useInvoiceData() {
  const [invoices, setInvoices] = useState([
    { id: 'INV-001', supplier: 'Dhaka Steel Ltd', date: '2025-11-05', amount: '৳45,230', status: 'synced', confidence: 95 },
    { id: 'INV-002', supplier: 'Bengal Traders', date: '2025-11-04', amount: '৳12,450', status: 'pending', confidence: 72 },
    { id: 'INV-003', supplier: 'রহিম টেক্সটাইল', date: '2025-11-03', amount: '৳89,100', status: 'review', confidence: 68 },
    { id: 'INV-004', supplier: 'City Hardware', date: '2025-11-02', amount: '৳23,670', status: 'synced', confidence: 91 },
    { id: 'INV-005', supplier: 'Quality Electronics', date: '2025-11-02', amount: '৳156,890', status: 'synced', confidence: 88 },
    { id: 'INV-006', supplier: 'Metro Supplies', date: '2025-11-01', amount: '৳67,450', status: 'pending', confidence: 75 },
    { id: 'INV-007', supplier: 'আলম ব্রাদার্স', date: '2025-10-31', amount: '৳34,200', status: 'synced', confidence: 92 },
    { id: 'INV-008', supplier: 'Tech Solutions BD', date: '2025-10-30', amount: '৳78,900', status: 'review', confidence: 65 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const matchesSearch = searchTerm === '' || 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.amount.includes(searchTerm);
      
      const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const pendingCount = invoices.filter(inv => inv.status === 'pending').length;
    const reviewCount = invoices.filter(inv => inv.status === 'review').length;
    const totalConfidence = invoices.reduce((sum, inv) => sum + inv.confidence, 0);
    const avgConfidence = Math.round(totalConfidence / invoices.length);
    
    return {
      totalThisMonth: invoices.length,
      monthlyChange: 12,
      pendingReview: reviewCount,
      avgConfidence,
      storageUsed: '6.2 MB',
      cachedInvoices: invoices.filter(inv => inv.status === 'synced').length
    };
  }, [invoices]);

  const deleteInvoice = (id) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const refreshData = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
    if (pendingInvoices.length > 0) {
      setInvoices(prev => prev.map(inv => 
        inv.status === 'pending' ? { ...inv, status: 'synced' } : inv
      ));
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('invoices');
    if (stored) {
      try {
        setInvoices(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load invoices from storage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  return {
    invoices: filteredInvoices,
    pendingCount: invoices.filter(inv => inv.status === 'pending').length,
    stats,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    deleteInvoice,
    refreshData
  };
}
