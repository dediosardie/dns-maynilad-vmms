// Vehicle Disposal Module - Defined per vehicle-disposal-module.md
import { useState, useEffect } from 'react';
import { DisposalRequest, DisposalAuction, Bid, Vehicle } from '../types';
import Modal from './Modal';

export default function VehicleDisposalModule() {
  const [disposalRequests, setDisposalRequests] = useState<DisposalRequest[]>([]);
  const [auctions, setAuctions] = useState<DisposalAuction[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DisposalRequest | undefined>();
  const [selectedAuction, setSelectedAuction] = useState<DisposalAuction | undefined>();

  useEffect(() => {
    const handleVehiclesUpdate = ((event: CustomEvent) => setVehicles(event.detail)) as EventListener;
    window.addEventListener('vehiclesUpdated', handleVehiclesUpdate);
    return () => window.removeEventListener('vehiclesUpdated', handleVehiclesUpdate);
  }, []);

  // Disposal Request Form - per markdown Disposal Request Form section (9 fields)
  const DisposalRequestForm = ({ initialData, onSubmit, onClose }: any) => {
    const [formData, setFormData] = useState({
      vehicle_id: initialData?.vehicle_id || '',
      requested_by: initialData?.requested_by || 'current_user_id',
      disposal_reason: initialData?.disposal_reason || 'end_of_life',
      recommended_method: initialData?.recommended_method || 'auction',
      condition_rating: initialData?.condition_rating || 'good',
      current_mileage: initialData?.current_mileage || 0,
      estimated_value: initialData?.estimated_value || 0,
      request_date: initialData?.request_date || new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Vehicle (select, required) */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Vehicle <span className="text-red-600">*</span>
            </label>
            <select value={formData.vehicle_id} onChange={(e) => setFormData({...formData, vehicle_id: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500">
              <option value="">Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.plate_number} - {v.make} {v.model} ({v.year})</option>
              ))}
            </select>
          </div>

          {/* Reason for Disposal (select, required) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reason for Disposal <span className="text-red-600">*</span>
            </label>
            <select value={formData.disposal_reason} onChange={(e) => setFormData({...formData, disposal_reason: e.target.value as any})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500">
              <option value="end_of_life">End of Life</option>
              <option value="excessive_maintenance">Excessive Maintenance</option>
              <option value="accident_damage">Accident Damage</option>
              <option value="upgrade">Upgrade</option>
              <option value="policy_change">Policy Change</option>
            </select>
          </div>

          {/* Condition Rating (select, required) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Condition Rating <span className="text-red-600">*</span>
            </label>
            <select value={formData.condition_rating} onChange={(e) => setFormData({...formData, condition_rating: e.target.value as any})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500">
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="salvage">Salvage</option>
            </select>
          </div>

          {/* Current Mileage (number, required) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Current Mileage <span className="text-red-600">*</span>
            </label>
            <input type="number" value={formData.current_mileage} onChange={(e) => setFormData({...formData, current_mileage: parseInt(e.target.value)})} required min="0" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Estimated Value (number, required) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estimated Value <span className="text-red-600">*</span>
            </label>
            <input type="number" value={formData.estimated_value} onChange={(e) => setFormData({...formData, estimated_value: parseFloat(e.target.value)})} required step="0.01" min="0" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Recommended Method (select, required) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Recommended Method <span className="text-red-600">*</span>
            </label>
            <select value={formData.recommended_method} onChange={(e) => setFormData({...formData, recommended_method: e.target.value as any})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500">
              <option value="auction">Auction</option>
              <option value="best_offer">Best Offer</option>
              <option value="trade_in">Trade-in</option>
              <option value="scrap">Scrap</option>
              <option value="donation">Donation</option>
            </select>
          </div>

          {/* Request Date (date, required) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Request Date <span className="text-red-600">*</span>
            </label>
            <input type="date" value={formData.request_date} onChange={(e) => setFormData({...formData, request_date: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        {/* Actions: Submit Request (primary, submit) */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Submit Request</button>
        </div>
      </form>
    );
  };

  // Auction Setup Form - per markdown Auction Setup Form section (9 fields)
  const AuctionSetupForm = ({ request, onSubmit, onClose }: any) => {
    const [formData, setFormData] = useState({
      disposal_id: request.id,
      auction_type: 'online' as 'public' | 'sealed_bid' | 'online',
      starting_price: request.estimated_value * 0.7,
      reserve_price: request.estimated_value * 0.85,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Validate auction duration minimum 7 days per business rules
      const duration = (new Date(formData.end_date).getTime() - new Date(formData.start_date).getTime()) / (1000 * 60 * 60 * 24);
      if (duration < 7) {
        alert('Auction duration must be at least 7 days');
        return;
      }
      // Validate reserve_price >= starting_price per business rules
      if (formData.reserve_price && formData.reserve_price < formData.starting_price) {
        alert('Reserve price must be greater than or equal to starting price');
        return;
      }
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Auction Type (select, required) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Auction Type <span className="text-red-600">*</span>
            </label>
            <select value={formData.auction_type} onChange={(e) => setFormData({...formData, auction_type: e.target.value as any})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500">
              <option value="public">Public</option>
              <option value="sealed_bid">Sealed Bid</option>
              <option value="online">Online</option>
            </select>
          </div>

          {/* Starting Price (number, required) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Starting Price <span className="text-red-600">*</span>
            </label>
            <input type="number" value={formData.starting_price} onChange={(e) => setFormData({...formData, starting_price: parseFloat(e.target.value)})} required step="0.01" min="0" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Reserve Price (number, optional) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reserve Price</label>
            <input type="number" value={formData.reserve_price} onChange={(e) => setFormData({...formData, reserve_price: parseFloat(e.target.value)})} step="0.01" min={formData.starting_price} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Start Date (date, required) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Start Date <span className="text-red-600">*</span>
            </label>
            <input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>

          {/* End Date (date, required, min 7 days) */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              End Date <span className="text-red-600">*</span> (min 7 days)
            </label>
            <input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        {/* Actions: Create Auction (primary, submit) */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Create Auction</button>
        </div>
      </form>
    );
  };

  // Bid Submission Form - per markdown Bid Submission Form section (6 fields)
  const BidSubmissionForm = ({ auction, onSubmit, onClose }: any) => {
    const currentHighestBid = bids.filter(b => b.auction_id === auction.id).reduce((max, b) => Math.max(max, b.bid_amount), 0);
    const minimumBid = Math.max(auction.starting_price, currentHighestBid + auction.bid_increment);

    const [formData, setFormData] = useState({
      auction_id: auction.id,
      bidder_name: '',
      bidder_email: '',
      bidder_phone: '',
      bid_amount: minimumBid,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Validate bid amount per business rules
      if (formData.bid_amount < minimumBid) {
        alert(`Minimum bid amount is $${minimumBid.toFixed(2)}`);
        return;
      }
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <p className="text-sm text-blue-900">
            <strong>Current Highest Bid:</strong> ${currentHighestBid.toFixed(2)}<br />
            <strong>Minimum Next Bid:</strong> ${minimumBid.toFixed(2)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Bidder Name (text, required) */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bidder Name <span className="text-red-600">*</span>
            </label>
            <input type="text" value={formData.bidder_name} onChange={(e) => setFormData({...formData, bidder_name: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Bidder Email (email, required) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bidder Email <span className="text-red-600">*</span>
            </label>
            <input type="email" value={formData.bidder_email} onChange={(e) => setFormData({...formData, bidder_email: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Bidder Phone (tel, required) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bidder Phone <span className="text-red-600">*</span>
            </label>
            <input type="tel" value={formData.bidder_phone} onChange={(e) => setFormData({...formData, bidder_phone: e.target.value})} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Bid Amount (number, required, >= minimum bid) */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bid Amount <span className="text-red-600">*</span>
            </label>
            <input type="number" value={formData.bid_amount} onChange={(e) => setFormData({...formData, bid_amount: parseFloat(e.target.value)})} required step="0.01" min={minimumBid} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        {/* Actions: Submit Bid (primary, submit) */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Submit Bid</button>
        </div>
      </form>
    );
  };

  // Action: Submit Request (primary) - per markdown
  const handleSaveDisposalRequest = (requestData: any) => {
    // Disposal requests >$10,000 require approval per business rules
    const needsApproval = requestData.estimated_value > 10000;
    const newRequest: DisposalRequest = {
      ...requestData,
      id: crypto.randomUUID(),
      disposal_number: `DISP-${Date.now()}`,
      approval_status: needsApproval ? 'pending' : 'approved',
      status: needsApproval ? 'pending_approval' : 'listed',
      approved_by: needsApproval ? undefined : 'auto_approved',
      approval_date: needsApproval ? undefined : new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setDisposalRequests([...disposalRequests, newRequest]);
    setIsRequestModalOpen(false);
  };

  // Action: Approve Request (success) - per markdown
  const handleApproveRequest = (id: string) => {
    setDisposalRequests(disposalRequests.map(r =>
      r.id === id
        ? { ...r, approval_status: 'approved', approved_by: 'current_user_id', approval_date: new Date().toISOString(), status: 'listed', updated_at: new Date().toISOString() }
        : r
    ));
  };

  // Action: Create Auction (primary) - per markdown
  const handleCreateAuction = (auctionData: any) => {
    const newAuction: DisposalAuction = {
      ...auctionData,
      id: crypto.randomUUID(),
      auction_status: 'scheduled',
      total_bids: 0,
    };
    setAuctions([...auctions, newAuction]);
    // Update disposal request status
    setDisposalRequests(disposalRequests.map(r =>
      r.id === auctionData.disposal_id
        ? { ...r, status: 'bidding_open', updated_at: new Date().toISOString() }
        : r
    ));
    setIsAuctionModalOpen(false);
    setSelectedRequest(undefined);
  };

  // Action: Submit Bid (primary) - per markdown
  const handleSubmitBid = (bidData: any) => {
    const newBid: Bid = {
      ...bidData,
      id: crypto.randomUUID(),
      bidder_contact: bidData.bidder_email,
      bid_date: new Date().toISOString(),
      is_valid: true,
    };
    setBids([...bids, newBid]);
    // Update auction total_bids and current_highest_bid
    setAuctions(auctions.map(a =>
      a.id === bidData.auction_id
        ? { ...a, total_bids: (a.total_bids || 0) + 1, current_highest_bid: bidData.bid_amount }
        : a
    ));
    setIsBidModalOpen(false);
    setSelectedAuction(undefined);
  };

  // Action: Close Auction (success) - per markdown
  const handleCloseAuction = (auctionId: string) => {
    const auction = auctions.find(a => a.id === auctionId);
    if (!auction) return;

    const auctionBids = bids.filter(b => b.auction_id === auctionId);
    if (auctionBids.length === 0) {
      alert('Cannot close auction with no bids');
      return;
    }

    const winningBid = auctionBids.reduce((max, b) => b.bid_amount > max.bid_amount ? b : max, auctionBids[0]);
    
    // Check if reserve price met per business rules
    if (auction.reserve_price && winningBid.bid_amount < auction.reserve_price) {
      alert('Reserve price not met. Auction cannot be closed.');
      return;
    }

    setAuctions(auctions.map(a =>
      a.id === auctionId
        ? { ...a, auction_status: 'closed', winner_id: winningBid.bidder_name, winning_bid: winningBid.bid_amount }
        : a
    ));
    // Update disposal request status
    setDisposalRequests(disposalRequests.map(r =>
      r.id === auction.disposal_id
        ? { ...r, status: 'sold', updated_at: new Date().toISOString() }
        : r
    ));
  };

  // Calculate stats
  const pendingRequests = disposalRequests.filter(r => r.approval_status === 'pending').length;
  const activeAuctions = auctions.filter(a => a.auction_status === 'active').length;
  const totalDisposals = disposalRequests.filter(r => r.status === 'transferred').length;
  const totalRevenue = auctions.reduce((sum, a) => sum + (a.winning_bid || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Requests</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{pendingRequests}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Auctions</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{activeAuctions}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Disposals</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{totalDisposals}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <h2 className="text-xl font-semibold text-slate-900">Vehicle Disposal Management</h2>
              <p className="text-sm text-slate-600 mt-1">Manage disposal requests and auctions</p>
            </div>
            {/* Action: Submit Disposal Request (primary) */}
            <button onClick={() => setIsRequestModalOpen(true)} className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Disposal Request
            </button>
          </div>
        </div>

        {/* Disposal Requests Table */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Disposal Requests</h3>
          {disposalRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600">No disposal requests yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Vehicle</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Est. Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Approval</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {disposalRequests.map((request) => {
                    const vehicle = vehicles.find(v => v.id === request.vehicle_id);
                    const auction = auctions.find(a => a.disposal_id === request.id);
                    return (
                      <tr key={request.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {vehicle ? `${vehicle.plate_number} - ${vehicle.make} ${vehicle.model}` : 'Unknown'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700 capitalize">{request.disposal_reason.replace('_', ' ')}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">${request.estimated_value.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-700 capitalize">{request.recommended_method.replace('_', ' ')}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            request.status === 'pending_approval' ? 'bg-amber-100 text-amber-800' :
                            request.status === 'listed' ? 'bg-emerald-100 text-emerald-800' :
                            request.status === 'bidding_open' ? 'bg-blue-100 text-blue-800' :
                            request.status === 'sold' ? 'bg-purple-100 text-purple-800' :
                            request.status === 'transferred' ? 'bg-slate-100 text-slate-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            request.approval_status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            request.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.approval_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm space-x-2">
                          {request.approval_status === 'pending' && (
                            <button onClick={() => handleApproveRequest(request.id)} className="text-emerald-600 hover:text-emerald-900">Approve</button>
                          )}
                          {request.approval_status === 'approved' && !auction && (
                            <button onClick={() => { setSelectedRequest(request); setIsAuctionModalOpen(true); }} className="text-blue-600 hover:text-blue-900">Create Auction</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Auctions Table */}
        <div className="p-6 border-t border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Auctions</h3>
          {auctions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600">No auctions created yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Auction Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Starting Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Current Bid</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Total Bids</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">End Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {auctions.map((auction) => (
                    <tr key={auction.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{auction.auction_type} Auction</td>
                      <td className="px-4 py-3 text-sm text-slate-700">${auction.starting_price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">${(auction.current_highest_bid || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{auction.total_bids || 0}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{new Date(auction.end_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          auction.auction_status === 'scheduled' ? 'bg-slate-100 text-slate-800' :
                          auction.auction_status === 'active' ? 'bg-blue-100 text-blue-800' :
                          auction.auction_status === 'closed' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {auction.auction_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm space-x-2">
                        {auction.auction_status === 'active' && (
                          <>
                            <button onClick={() => { setSelectedAuction(auction); setIsBidModalOpen(true); }} className="text-blue-600 hover:text-blue-900">Place Bid</button>
                            <button onClick={() => handleCloseAuction(auction.id)} className="text-emerald-600 hover:text-emerald-900">Close</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} title="New Disposal Request">
        <DisposalRequestForm onSubmit={handleSaveDisposalRequest} onClose={() => setIsRequestModalOpen(false)} />
      </Modal>

      {selectedRequest && (
        <Modal isOpen={isAuctionModalOpen} onClose={() => { setIsAuctionModalOpen(false); setSelectedRequest(undefined); }} title="Create Auction">
          <AuctionSetupForm request={selectedRequest} onSubmit={handleCreateAuction} onClose={() => { setIsAuctionModalOpen(false); setSelectedRequest(undefined); }} />
        </Modal>
      )}

      {selectedAuction && (
        <Modal isOpen={isBidModalOpen} onClose={() => { setIsBidModalOpen(false); setSelectedAuction(undefined); }} title="Place Bid">
          <BidSubmissionForm auction={selectedAuction} onSubmit={handleSubmitBid} onClose={() => { setIsBidModalOpen(false); setSelectedAuction(undefined); }} />
        </Modal>
      )}
    </div>
  );
}
