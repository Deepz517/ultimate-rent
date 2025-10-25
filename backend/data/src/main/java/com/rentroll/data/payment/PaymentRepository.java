package com.rentroll.data.payment;

import com.rentroll.core.payment.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByLeaseId(Long leaseId);
}