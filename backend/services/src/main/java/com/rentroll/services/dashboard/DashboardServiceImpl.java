package com.rentroll.services.dashboard;

import com.rentroll.core.lease.Lease;
import com.rentroll.core.payment.Payment;
import com.rentroll.data.lease.LeaseRepository;
import com.rentroll.data.payment.PaymentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final LeaseRepository leaseRepository;
    private final PaymentRepository paymentRepository;

    public DashboardServiceImpl(LeaseRepository leaseRepository, PaymentRepository paymentRepository) {
        this.leaseRepository = leaseRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public BigDecimal getTotalMonthlyRentDue(Long landlordId) {
        List<Lease> leases = leaseRepository.findByLandlordId(landlordId);
        return leases.stream()
                .map(Lease::getRentAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public BigDecimal getTotalOverdueAmount(Long landlordId) {
        BigDecimal totalDue = getTotalMonthlyRentDue(landlordId);
        List<Lease> leases = leaseRepository.findByLandlordId(landlordId);
        BigDecimal totalPaid = leases.stream()
                .flatMap(lease -> paymentRepository.findByLeaseId(lease.getId()).stream())
                .filter(payment -> payment.getPaymentDate().getMonth() == LocalDate.now().getMonth())
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal overdue = totalDue.subtract(totalPaid);
        return overdue.compareTo(BigDecimal.ZERO) > 0 ? overdue : BigDecimal.ZERO;
    }

    @Override
    public BigDecimal getCollectionRate(Long landlordId) {
        BigDecimal totalDue = getTotalMonthlyRentDue(landlordId);
        if (totalDue.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        List<Lease> leases = leaseRepository.findByLandlordId(landlordId);
        BigDecimal totalPaid = leases.stream()
                .flatMap(lease -> paymentRepository.findByLeaseId(lease.getId()).stream())
                .filter(payment -> payment.getPaymentDate().getMonth() == LocalDate.now().getMonth())
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return totalPaid.divide(totalDue, 2, RoundingMode.HALF_UP).multiply(new BigDecimal(100));
    }
}