import { useState, useEffect, useMemo } from 'react';

export function useQueueManager(invoices) {
  const [queue, setQueue] = useState([]);

  const calculatePriority = (invoice) => {
    const now = new Date();
    const invoiceDate = new Date(invoice.date);
    const ageInHours = Math.abs(now - invoiceDate) / 36e5;
    
    const amountValue = parseFloat(invoice.amount.replace(/[৳$,]/g, ''));
    const maxAmount = 100000;
    const normalizedAmount = Math.min(amountValue / maxAmount, 1);
    
    const ageWeight = 0.40;
    const amountWeight = 0.30;
    const confidenceWeight = 0.30;
    
    const ageScore = Math.min(ageInHours / 72, 1);
    const amountScore = normalizedAmount;
    const confidenceScore = (100 - invoice.confidence) / 100;
    
    const priority = Math.round(
      (ageScore * ageWeight + amountScore * amountWeight + confidenceScore * confidenceWeight) * 100
    );

    let reason = '';
    if (invoice.confidence < 70) {
      reason = 'Low confidence score requires review';
    } else if (amountValue > 50000) {
      reason = 'High-value invoice';
    } else if (ageInHours > 48) {
      reason = 'Invoice older than 2 days';
    }

    return {
      priority,
      reason,
      ageWeight: `${Math.round(ageScore * ageWeight * 100)}%`,
      amountWeight: `${Math.round(amountScore * amountWeight * 100)}%`,
      confidenceWeight: `${Math.round(confidenceScore * confidenceWeight * 100)}%`,
      age: ageInHours < 1 ? `${Math.round(ageInHours * 60)}m ago` : 
           ageInHours < 24 ? `${Math.round(ageInHours)}h ago` : 
           `${Math.round(ageInHours / 24)}d ago`
    };
  };

  const queuedInvoices = useMemo(() => {
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending' || inv.status === 'review');
    
    const invoicesWithPriority = pendingInvoices.map(invoice => ({
      ...invoice,
      ...calculatePriority(invoice)
    }));

    return invoicesWithPriority.sort((a, b) => b.priority - a.priority);
  }, [invoices]);

  useEffect(() => {
    setQueue(queuedInvoices);
  }, [queuedInvoices]);

  const updatePriority = (invoiceId, newIndex) => {
    setQueue(prevQueue => {
      const newQueue = [...prevQueue];
      const currentIndex = newQueue.findIndex(inv => inv.id === invoiceId);
      const [movedItem] = newQueue.splice(currentIndex, 1);
      newQueue.splice(newIndex, 0, movedItem);
      return newQueue;
    });
  };

  const syncQueue = async () => {
    for (const invoice of queue) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('Synced:', invoice.id);
    }
    setQueue([]);
  };

  const removeFromQueue = (invoiceId) => {
    setQueue(prevQueue => prevQueue.filter(inv => inv.id !== invoiceId));
  };

  return {
    queuedInvoices: queue,
    updatePriority,
    syncQueue,
    removeFromQueue
  };
}
