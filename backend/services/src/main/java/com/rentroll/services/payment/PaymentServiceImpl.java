package com.rentroll.services.payment;

import com.rentroll.core.payment.Payment;
import com.rentroll.core.payment.PaymentMethod;
import com.rentroll.data.payment.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Payment createPayment(Payment payment) {
        if (payment.getPaymentMethod() == PaymentMethod.CASH) {
            if (!StringUtils.hasText(payment.getNote())) {
                throw new IllegalArgumentException("A note/receipt reference is required for cash payments.");
            }
        }
        return paymentRepository.save(payment);
    }

    @Override
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    @Override
    public List<Payment> getPaymentsByLease(Long leaseId) {
        return paymentRepository.findByLeaseId(leaseId);
    }
}