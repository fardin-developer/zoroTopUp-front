"use client";

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../apiClient';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw, 
  Smartphone, 
  CreditCard, 
  ArrowLeft,
  Copy,
  ExternalLink,
  User,
  Mail,
  Phone,
  Calendar,
  Hash
} from 'lucide-react';

export default function PaymentStatusPage() {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactionType, setTransactionType] = useState('wallet'); // 'wallet' or 'ekqr'
  const [urlParams, setUrlParams] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clientTxnId = params.get('client_txn_id');
    const txnId = params.get('txn_id');
    const walletTransactionId = params.get('transactionId');
    const paymentUrlFromURL = params.get('paymentUrl');

    // Determine transaction type based on URL parameters
    if (clientTxnId && txnId) {
      // New ekqr transaction flow
      setTransactionType('ekqr');
      setUrlParams({ client_txn_id: clientTxnId, txn_id: txnId });
      setTransactionId(clientTxnId);
      fetchEkqrTransactionStatus(clientTxnId, txnId);
    } else if (walletTransactionId) {
      // Original wallet transaction flow
      setTransactionType('wallet');
      setTransactionId(walletTransactionId);
      if (paymentUrlFromURL) {
        setPaymentUrl(decodeURIComponent(paymentUrlFromURL));
      }
      fetchWalletPaymentStatus(walletTransactionId);
      
      // Poll for status updates every 5 seconds for wallet transactions
      const interval = setInterval(() => {
        fetchWalletPaymentStatus(walletTransactionId);
      }, 5000);

      return () => clearInterval(interval);
    } else {
      setError('No transaction parameters provided in URL');
      setLoading(false);
      return;
    }
  }, []);

  const fetchEkqrTransactionStatus = async (clientTxnId, txnId) => {
    try {
      const response = await apiClient.get(`/transaction/status?client_txn_id=${clientTxnId}&txn_id=${txnId}`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch transaction status');
      }

      const data = response.data;

      // Normalize/transform ekqr response (supports both old snake_case and new camelCase formats)
      const transformedData = {
        ...data,
        gatewayType: data.gatewayType || 'ekqr',
        orderId: data.orderId || data.client_txn_id,
        gatewayOrderId: data.txnId || data.id,
        upiTxnId: data.upiTxnId || data.upi_txn_id,
        amount: data.amount,
        status: data.status,
        customerInfo: {
          name: data.customerName || data.customer_name,
          email: data.customerEmail || data.customer_email,
          mobile: data.customerNumber || data.customer_mobile,
          vpa: data.customerVpa || data.customer_vpa,
        },
        paymentNote: data.paymentNote || data.p_info,
        merchant: data.merchant || data.Merchant,
        ekqrResponse: response.ekqr_response,
      };

      setStatusData(transformedData);
      setError(null);
    } catch (e) {
      console.error('EKQR Transaction Status API Error:', e);
      setError(`Failed to fetch transaction status: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletPaymentStatus = async (id) => {
    try {
      const response = await apiClient.get(`/wallet/payment-status/${id}`);

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch payment status');
      }

      setStatusData(response.data);
      setError(null);

      // Stop polling if payment is completed or failed
      if (response.data?.status === 'completed' || response.data?.status === 'failed') {
        // Will be cleaned up by useEffect cleanup
      }
    } catch (e) {
      console.error('Wallet Payment Status API Error:', e);
      setError(`Failed to fetch payment status: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'completed': { 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50', 
        border: 'border-emerald-200',
        icon: CheckCircle,
        label: 'Completed',
        description: 'Payment processed successfully'
      },
      'success': { 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50', 
        border: 'border-emerald-200',
        icon: CheckCircle,
        label: 'Success',
        description: 'Payment processed successfully'
      },
      'pending': { 
        color: 'text-amber-600', 
        bg: 'bg-amber-50', 
        border: 'border-amber-200',
        icon: Clock,
        label: 'Pending',
        description: 'Awaiting payment confirmation'
      },
      'processing': { 
        color: 'text-blue-600', 
        bg: 'bg-blue-50', 
        border: 'border-blue-200',
        icon: RefreshCw,
        label: 'Processing',
        description: 'Payment is being processed'
      },
      'failed': { 
        color: 'text-red-600', 
        bg: 'bg-red-50', 
        border: 'border-red-200',
        icon: XCircle,
        label: 'Failed',
        description: 'Payment could not be processed'
      },
      'cancelled': { 
        color: 'text-red-600', 
        bg: 'bg-red-50', 
        border: 'border-red-200',
        icon: XCircle,
        label: 'Cancelled',
        description: 'Payment was cancelled'
      }
    };
    return configs[status] || configs['pending'];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayNow = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  const openUPIApp = (link) => {
    window.location.href = link;
  };

  const statusConfig = statusData ? getStatusConfig(statusData.status) : null;
  const StatusIcon = statusConfig?.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Payment Status</h1>
                <p className="text-sm text-gray-500">
                  {transactionType === 'ekqr' ? 'Transaction verification' : 'Transaction tracking'}
                </p>
              </div>
            </div>
            {statusData && (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border`}>
                <StatusIcon className="w-4 h-4 mr-1.5" />
                {statusConfig.label}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !statusData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading transaction details...</p>
            </div>
          </div>
        )}

        {error && !statusData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load transaction details</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {statusData && (
          <div className="space-y-6">
            {/* Main Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className={`px-6 py-8 ${statusConfig.bg} border-b ${statusConfig.border}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${statusConfig.bg} ${statusConfig.border} border-2`}>
                      <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">₹{statusData.amount}</h2>
                      <p className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.description}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(statusData.createdAt)}
                      </p>
                      {transactionType === 'ekqr' && statusData.p_info && (
                        <p className="text-sm text-gray-600">{statusData.p_info}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {transactionType === 'ekqr' ? 'Client Transaction ID' : 'Transaction ID'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                        {transactionType === 'ekqr' ? statusData.client_txn_id?.slice(-8) : transactionId?.slice(-8)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(transactionType === 'ekqr' ? statusData.client_txn_id : transactionId)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy transaction ID"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    {copied && (
                      <p className="text-xs text-green-600 mt-1">Copied!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount</span>
                      <span className="font-medium text-gray-900">₹{statusData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment Method</span>
                      <span className="font-medium text-gray-900 uppercase">{statusData.gatewayType || 'UPI'}</span>
                    </div>
                    {transactionType === 'ekqr' ? (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Client Transaction ID</span>
                        <span className="font-medium text-gray-900 font-mono text-xs">{statusData.client_txn_id}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Order ID</span>
                        <span className="font-medium text-gray-900">{statusData.orderId}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gateway Order ID</span>
                      <span className="font-medium text-gray-900">{statusData.gatewayOrderId || statusData.id}</span>
                    </div>
                    {statusData.upiTxnId && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">UPI Transaction ID</span>
                        <span className="font-medium text-gray-900 font-mono text-xs">{statusData.upiTxnId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Transaction Date</span>
                      <span className="font-medium text-gray-900">{formatDate(statusData.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information for EKQR transactions */}
            {transactionType === 'ekqr' && statusData.customerInfo && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium text-gray-900">{statusData.customerInfo.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium text-gray-900">{statusData.customerInfo.email}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">Mobile:</span>
                      <span className="font-medium text-gray-900">{statusData.customerInfo.mobile}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">UPI ID:</span>
                      <span className="font-medium text-gray-900 font-mono text-xs">{statusData.customerInfo.vpa}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Merchant Information for EKQR transactions */}
            {transactionType === 'ekqr' && statusData.merchant && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Merchant Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Merchant Name</span>
                    <span className="font-medium text-gray-900">{statusData.merchant.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Merchant UPI ID</span>
                    <span className="font-medium text-gray-900 font-mono text-xs">{statusData.merchant.upi_id}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Actions for Pending Status (Wallet transactions only) */}
            {transactionType === 'wallet' && statusData.status === 'pending' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Your Payment</h3>
                <p className="text-gray-600 text-sm mb-6">Choose your preferred payment method to complete the transaction.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {paymentUrl && (
                    <button
                      onClick={handlePayNow}
                      className="flex items-center justify-center px-6 py-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <CreditCard className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Pay Online</div>
                        <div className="text-sm text-gray-500">Credit/Debit Card, Net Banking</div>
                      </div>
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowPaymentOptions(!showPaymentOptions)}
                    className="flex items-center justify-center px-6 py-4 border border-blue-300 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Smartphone className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">UPI Payment</div>
                      <div className="text-sm text-blue-600">GPay, PhonePe, Paytm & more</div>
                    </div>
                  </button>
                </div>

                {/* UPI Payment Options */}
                {showPaymentOptions && statusData.upiIntent && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Select UPI App</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {statusData.upiIntent.gpay_link && (
                        <button
                          onClick={() => openUPIApp(statusData.upiIntent.gpay_link)}
                          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-600 rounded-lg mb-2 flex items-center justify-center text-white text-xs font-bold">
                            G
                          </div>
                          <span className="text-sm font-medium">Google Pay</span>
                        </button>
                      )}
                      {statusData.upiIntent.phonepe_link && (
                        <button
                          onClick={() => openUPIApp(statusData.upiIntent.phonepe_link)}
                          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-purple-600 rounded-lg mb-2 flex items-center justify-center text-white text-xs font-bold">
                            P
                          </div>
                          <span className="text-sm font-medium">PhonePe</span>
                        </button>
                      )}
                      {statusData.upiIntent.paytm_link && (
                        <button
                          onClick={() => openUPIApp(statusData.upiIntent.paytm_link)}
                          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-500 rounded-lg mb-2 flex items-center justify-center text-white text-xs font-bold">
                            P
                          </div>
                          <span className="text-sm font-medium">Paytm</span>
                        </button>
                      )}
                      {statusData.upiIntent.bhim_link && (
                        <button
                          onClick={() => openUPIApp(statusData.upiIntent.bhim_link)}
                          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-orange-600 rounded-lg mb-2 flex items-center justify-center text-white text-xs font-bold">
                            B
                          </div>
                          <span className="text-sm font-medium">BHIM</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Success Message */}
            {(statusData.status === 'completed' || statusData.status === 'success') && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-emerald-900">Payment Successful</h3>
                    <p className="text-emerald-700">
                      {transactionType === 'ekqr' ? 
                        `Transaction completed successfully. Amount: ₹${statusData.amount}` :
                        `Your wallet has been credited with ₹${statusData.amount}`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Auto-refresh indicator for pending wallet payments */}
            {transactionType === 'wallet' && statusData.status === 'pending' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center text-blue-700">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span className="text-sm">Status updates automatically every 5 seconds</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
              >
                Go to Home
              </button>
              <button
                onClick={() => window.location.href = '/transactions'}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
              >
                View Transactions
              </button>
              <button
                onClick={() => {
                  if (transactionType === 'ekqr') {
                    fetchEkqrTransactionStatus(urlParams.client_txn_id, urlParams.txn_id);
                  } else {
                    fetchWalletPaymentStatus(transactionId);
                  }
                }}
                className="sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 