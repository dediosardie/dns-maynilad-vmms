// Fuel Tracking Module - Defined per fuel-tracking-module.md
import { useState, useEffect } from 'react';
import { FuelTransaction, Vehicle, Driver } from '../types';
import FuelTransactionTable from './FuelTransactionTable';
import FuelTransactionForm from './FuelTransactionForm';
import Modal from './Modal';
import { fuelService, vehicleService, driverService } from '../services/supabaseService';
import { notificationService } from '../services/notificationService';
import { auditLogService } from '../services/auditLogService';
// Format number with thousand separators
const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Format currency with Php prefix
const formatCurrency = (amount: number): string => {
  return `Php ${formatNumber(amount, 2)}`;
};
export default function FuelTrackingModule() {
  const [transactions, setTransactions] = useState<FuelTransaction[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<FuelTransaction | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [transactionsData, vehiclesData, driversData] = await Promise.all([
          fuelService.getAllTransactions(),
          vehicleService.getAll(),
          driverService.getAll(),
        ]);
        setTransactions(transactionsData);
        setVehicles(vehiclesData);
        setDrivers(driversData);
        console.log('Loaded fuel data:', {
          transactions: transactionsData.length,
          vehicles: vehiclesData.length,
          drivers: driversData.length,
        });
      } catch (error) {
        console.error('Error loading fuel transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    
    const handleVehiclesUpdate = ((event: CustomEvent) => {
      setVehicles(event.detail);
    }) as EventListener;
    
    const handleDriversUpdate = ((event: CustomEvent) => {
      setDrivers(event.detail);
    }) as EventListener;

    window.addEventListener('vehiclesUpdated', handleVehiclesUpdate);
    window.addEventListener('driversUpdated', handleDriversUpdate);

    return () => {
      window.removeEventListener('vehiclesUpdated', handleVehiclesUpdate);
      window.removeEventListener('driversUpdated', handleDriversUpdate);
    };
  }, []);

  // Dispatch event when transactions update so other modules can react
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('fuelUpdated', { detail: transactions }));
  }, [transactions]);

  // Action: Record Fuel Transaction (primary, submit)
  const handleSaveTransaction = async (transactionData: Omit<FuelTransaction, 'id' | 'created_at'>) => {
    try {
      const newTransaction = await fuelService.createTransaction(transactionData);
      setTransactions([newTransaction, ...transactions]);
      setIsModalOpen(false);
      
      notificationService.success(
        'Fuel Transaction Recorded',
        `${newTransaction.liters}L fuel recorded for vehicle`
      );
      await auditLogService.createLog(
        'Fuel Transaction Created',
        `Recorded ${newTransaction.liters}L fuel at ${newTransaction.cost_per_liter}/L`
      );
    } catch (error: any) {
      console.error('Failed to save fuel transaction:', error);
      notificationService.error('Failed to Record', error.message || 'Unable to save fuel transaction.');
      alert(error.message || 'Failed to save fuel transaction. Please try again.');
    }
  };

  // Action: Update Transaction (primary, submit)
  const handleUpdateTransaction = async (transaction: FuelTransaction) => {
    const oldTransaction = transactions.find(t => t.id === transaction.id);
    try {
      const { id, created_at, ...updateData } = transaction;
      const updated = await fuelService.updateTransaction(id, updateData);
      setTransactions(transactions.map(t => t.id === updated.id ? updated : t));
      setIsModalOpen(false);
      setEditingTransaction(undefined);
      
      notificationService.success(
        'Fuel Transaction Updated',
        'Transaction details have been updated'
      );
      await auditLogService.createLog(
        'Fuel Transaction Updated',
        `Updated fuel transaction (${updated.liters}L)`,
        { before: oldTransaction, after: updated }
      );
    } catch (error: any) {
      console.error('Failed to update fuel transaction:', error);
      notificationService.error('Failed to Update', error.message || 'Unable to update transaction.');
      alert(error.message || 'Failed to update fuel transaction. Please try again.');
    }
  };

  // Action: Delete Transaction (danger, confirmation required)
  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fuel transaction?')) {
      return;
    }
    try {
      const transaction = transactions.find(t => t.id === id);
      await fuelService.deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
      
      notificationService.info(
        'Transaction Deleted',
        'Fuel transaction has been removed'
      );
      await auditLogService.createLog(
        'Fuel Transaction Deleted',
        `Deleted fuel transaction (${transaction?.liters}L)`
      );
    } catch (error: any) {
      console.error('Failed to delete fuel transaction:', error);
      notificationService.error('Failed to Delete', error.message || 'Unable to delete transaction.');
      alert(error.message || 'Failed to delete fuel transaction. Please try again.');
    }
  };

  // Action: View Efficiency Report (secondary, opens analytics view)
  const handleViewEfficiency = () => {
    alert('Efficiency Report\n(Analytics dashboard would be displayed here)');
  };

  const handleEditTransaction = (transaction: FuelTransaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleAddTransaction = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };

  // Calculate stats
  const totalLiters = transactions.reduce((sum, t) => sum + t.liters, 0);
  const totalCost = transactions.reduce((sum, t) => sum + t.cost, 0);
  const avgCostPerLiter = totalLiters > 0 ? totalCost / totalLiters : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Transactions</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{transactions.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Liters</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatNumber(totalLiters, 2)} L</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Cost</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalCost)}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Cost/Liter</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(avgCostPerLiter)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Fuel Transactions</h2>
              <p className="text-sm text-slate-600 mt-1">Track fuel usage and monitor efficiency</p>
            </div>
            <div className="flex gap-2">
              {/* Action: View Efficiency Report (secondary) */}
              <button
                onClick={handleViewEfficiency}
                className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Efficiency Report
              </button>
              {/* Action: Record Fuel Transaction (primary) */}
              <button
                onClick={handleAddTransaction}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Transaction
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="mt-2 text-slate-600">Loading transactions...</p>
            </div>
          ) : (
            <FuelTransactionTable
              transactions={transactions}
              vehicles={vehicles}
              drivers={drivers}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onViewEfficiency={handleViewEfficiency}
            />
          )}
        </div>
      </div>

      {/* Modal for Create/Edit Transaction */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Edit Fuel Transaction' : 'Record Fuel Transaction'}
      >
        <FuelTransactionForm
          onSave={handleSaveTransaction}
          onUpdate={handleUpdateTransaction}
          initialData={editingTransaction}
          vehicles={vehicles}
          drivers={drivers}
        />
      </Modal>
    </div>
  );
}
