package com.rentroll.web.notification;

import com.rentroll.core.notification.Notification;
import com.rentroll.core.user.User;
import com.rentroll.data.notification.NotificationRepository;
import com.rentroll.services.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public NotificationController(NotificationRepository notificationRepository, UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications() {
        User currentUser = getCurrentUser();
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/{id}/mark-read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        Optional<Notification> notificationOpt = notificationRepository.findById(id);

        if (notificationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Notification notification = notificationOpt.get();
        if (!notification.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }

        notification.setRead(true);
        notificationRepository.save(notification);
        return ResponseEntity.ok().build();
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findByUsername(userDetails.getUsername());
    }
}
