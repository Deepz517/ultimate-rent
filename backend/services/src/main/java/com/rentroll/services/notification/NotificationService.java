package com.rentroll.services.notification;

public interface NotificationService {
    void sendRentReminders();
    void sendOverdueNotices();
    void sendLeaseExpiryReminders();
}