package com.rentroll.services.report;

import com.rentroll.core.lease.Lease;
import com.rentroll.core.payment.Payment;
import com.rentroll.data.lease.LeaseRepository;
import com.rentroll.data.payment.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    private final LeaseRepository leaseRepository;
    private final PaymentRepository paymentRepository;

    public ReportServiceImpl(LeaseRepository leaseRepository, PaymentRepository paymentRepository) {
        this.leaseRepository = leaseRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Map<String, Double> getPaymentMethodBreakdown(Long landlordId) {
        List<Lease> leases = leaseRepository.findByLandlordId(landlordId);
        List<Payment> payments = leases.stream()
                .flatMap(lease -> paymentRepository.findByLeaseId(lease.getId()).stream())
                .collect(Collectors.toList());

        return payments.stream()
                .collect(Collectors.groupingBy(
                        payment -> payment.getPaymentMethod().name(),
                        Collectors.summingDouble(payment -> payment.getAmount().doubleValue())
                ));
    }
}
