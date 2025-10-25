package com.rentroll.services.notification;

import com.rentroll.core.lease.Lease;
import com.rentroll.core.notification.Notification;
import com.rentroll.core.user.User;
import com.rentroll.data.lease.LeaseRepository;
import com.rentroll.data.notification.NotificationRepository;
import com.rentroll.data.payment.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationServiceImpl.class);
    private final LeaseRepository leaseRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(LeaseRepository leaseRepository, PaymentRepository paymentRepository, NotificationRepository notificationRepository) {
        this.leaseRepository = leaseRepository;
        this.paymentRepository = paymentRepository;
        this.notificationRepository = notificationRepository;
    }

    private LocalDate getDueDateForCurrentMonth(Lease lease) {
        LocalDate today = LocalDate.now();
        int leaseDay = lease.getStartDate().getDayOfMonth();
        int lastDayOfMonth = today.lengthOfMonth();
        int dueDay = Math.min(leaseDay, lastDayOfMonth);
        return LocalDate.of(today.getYear(), today.getMonth(), dueDay);
    }

    private void createNotification(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notificationRepository.save(notification);
        LOGGER.info("Created notification for {}: {}", user.getUsername(), message);
    }

    @Override
    public void sendRentReminders() {
        LocalDate today = LocalDate.now();
        List<Lease> leases = leaseRepository.findAll();

        for (Lease lease : leases) {
            LocalDate dueDate = getDueDateForCurrentMonth(lease);
            if (dueDate.isEqual(today.plusDays(3))) {
                String message = "Your rent payment of ₹" + lease.getRentAmount() + " is due in 3 days.";
                createNotification(lease.getTenant().getUser(), message);
                createNotification(lease.getLandlord(), "Rent reminder sent to " + lease.getTenant().getName());
            }
        }
    }

    @Override
    public void sendOverdueNotices() {
        LocalDate today = LocalDate.now();
        List<Lease> leases = leaseRepository.findAll();

        for (Lease lease : leases) {
            LocalDate dueDate = getDueDateForCurrentMonth(lease);
            if (dueDate.isBefore(today)) {
                boolean paidThisMonth = paymentRepository.findByLeaseId(lease.getId()).stream()
                    .anyMatch(p -> p.getPaymentDate().getMonth() == today.getMonth() && p.getPaymentDate().getYear() == today.getYear());

                if (!paidThisMonth) {
                    String message = "Your rent payment of ₹" + lease.getRentAmount() + " is overdue.";
                    createNotification(lease.getTenant().getUser(), message);
                    createNotification(lease.getLandlord(), "Rent for " + lease.getTenant().getName() + " is overdue.");
                }
            }
        }
    }

    @Override
    public void sendLeaseExpiryReminders() {
        LocalDate today = LocalDate.now();
        List<Lease> leases = leaseRepository.findAll();

        for (Lease lease : leases) {
            if (lease.getEndDate().isEqual(today.plusDays(60))) {
                String message = "The lease for tenant " + lease.getTenant().getName() + " is expiring in 60 days.";
                createNotification(lease.getLandlord(), message);
            }
        }
    }
}