import React from 'react';

const PaymentHistory: React.FC<{ leaseId: number }> = ({ leaseId }) => {
  return <div>Payment History (Lease ID: {leaseId})</div>;
};

export default PaymentHistory;
