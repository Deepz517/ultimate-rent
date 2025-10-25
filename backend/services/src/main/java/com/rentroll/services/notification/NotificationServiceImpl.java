package com.rentroll.services.notification;

import com.rentroll.core.lease.Lease;
import com.rentroll.data.lease.LeaseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationServiceImpl.class);
    private final LeaseRepository leaseRepository;

    public NotificationServiceImpl(LeaseRepository leaseRepository) {
        this.leaseRepository = leaseRepository;
    }

    @Override
    public void sendRentReminders() {
        LocalDate today = LocalDate.now();
        List<Lease> leases = leaseRepository.findAll();

        for (Lease lease : leases) {
            LocalDate dueDate = lease.getStartDate().withDayOfMonth(lease.getStartDate().getDayOfMonth());
            if (dueDate.isEqual(today.plusDays(3))) {
                LOGGER.info("Rent reminder for tenant: {}", lease.getTenant().getName());
            }
        }
    }

    @Override
    public void sendOverdueNotices() {
        LocalDate today = LocalDate.now();
        List<Lease> leases = leaseRepository.findAll();

        for (Lease lease : leases) {
            LocalDate dueDate = lease.getStartDate().withDayOfMonth(lease.getStartDate().getDayOfMonth());
            if (dueDate.isEqual(today.minusDays(1))) {
                LOGGER.info("Rent overdue for tenant: {}", lease.getTenant().getName());
            }
        }
    }

    @Override
    public void sendLeaseExpiryReminders() {
        LocalDate today = LocalDate.now();
        LocalDate expiryDate = today.plusDays(60);
        List<Lease> leases = leaseRepository.findAll();

        for (Lease lease : leases) {
            if (lease.getEndDate().isEqual(expiryDate)) {
                LOGGER.info("Lease expiry reminder for landlord: {}", lease.getLandlord().getUsername());
            }
        }
    }
}