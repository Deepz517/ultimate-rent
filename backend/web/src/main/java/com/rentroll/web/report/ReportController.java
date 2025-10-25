package com.rentroll.web.report;

import com.rentroll.core.user.User;
import com.rentroll.services.report.ReportService;
import com.rentroll.services.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('LANDLORD')")
public class ReportController {

    private final ReportService reportService;
    private final UserService userService;

    public ReportController(ReportService reportService, UserService userService) {
        this.reportService = reportService;
        this.userService = userService;
    }

    @GetMapping("/payment-method-breakdown")
    public ResponseEntity<Map<String, Double>> getPaymentMethodBreakdown() {
        User currentUser = getCurrentUser();
        Map<String, Double> breakdown = reportService.getPaymentMethodBreakdown(currentUser.getId());
        return ResponseEntity.ok(breakdown);
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findByUsername(userDetails.getUsername());
    }
}
