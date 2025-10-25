package com.rentroll.services.scheduler;

import com.rentroll.services.notification.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificationScheduler {

    private final NotificationService notificationService;

    public NotificationScheduler(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Scheduled(cron = "0 0 9 * * ?", zone = "IST")
    public void scheduleNotifications() {
        notificationService.sendRentReminders();
        notificationService.sendOverdueNotices();
        notificationService.sendLeaseExpiryReminders();
    }
}