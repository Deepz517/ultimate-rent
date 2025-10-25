package com.rentroll.web.dashboard;

import com.rentroll.core.user.User;
import com.rentroll.services.dashboard.DashboardService;
import com.rentroll.services.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasRole('LANDLORD')")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserService userService;

    public DashboardController(DashboardService dashboardService, UserService userService) {
        this.dashboardService = dashboardService;
        this.userService = userService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<DashboardMetrics> getDashboardMetrics() {
        User currentUser = getCurrentUser();
        Long landlordId = currentUser.getId();

        BigDecimal totalMonthlyRentDue = dashboardService.getTotalMonthlyRentDue(landlordId);
        BigDecimal totalOverdueAmount = dashboardService.getTotalOverdueAmount(landlordId);
        BigDecimal collectionRate = dashboardService.getCollectionRate(landlordId);

        DashboardMetrics metrics = new DashboardMetrics(totalMonthlyRentDue, totalOverdueAmount, collectionRate);
        return ResponseEntity.ok(metrics);
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findByUsername(userDetails.getUsername());
    }
}