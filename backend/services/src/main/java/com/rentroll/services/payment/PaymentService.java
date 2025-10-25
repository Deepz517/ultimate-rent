package com.rentroll.services.payment;

import com.rentroll.core.payment.Payment;
import java.util.List;
import java.util.Optional;

public interface PaymentService {
    Payment createPayment(Payment payment);
    Optional<Payment> getPaymentById(Long id);
    List<Payment> getPaymentsByLease(Long leaseId);
}