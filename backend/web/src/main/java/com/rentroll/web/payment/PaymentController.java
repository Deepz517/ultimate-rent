package com.rentroll.web.payment;

import com.rentroll.core.lease.Lease;
import com.rentroll.core.payment.Payment;
import com.rentroll.core.user.User;
import com.rentroll.services.lease.LeaseService;
import com.rentroll.services.payment.PaymentService;
import com.rentroll.services.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;
    private final LeaseService leaseService;

    public PaymentController(PaymentService paymentService, UserService userService, LeaseService leaseService) {
        this.paymentService = paymentService;
        this.userService = userService;
        this.leaseService = leaseService;
    }

    @PostMapping
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<?> createPayment(@RequestBody Payment payment) {
        try {
            // Security check: ensure the landlord owns the lease associated with the payment
            Optional<Lease> leaseOpt = leaseService.getLeaseById(payment.getLease().getId());
            if (leaseOpt.isEmpty() || !leaseOpt.get().getLandlord().getId().equals(getCurrentUser().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to record a payment for this lease.");
            }
            Payment createdPayment = paymentService.createPayment(payment);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/lease/{leaseId}")
    public ResponseEntity<List<Payment>> getPaymentsByLease(@PathVariable Long leaseId) {
        if (!isUserAuthorizedForLease(leaseId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Payment> payments = paymentService.getPaymentsByLease(leaseId);
        return ResponseEntity.ok(payments);
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findByUsername(userDetails.getUsername());
    }

    private boolean isUserAuthorizedForLease(Long leaseId) {
        User currentUser = getCurrentUser();
        Optional<Lease> leaseOpt = leaseService.getLeaseById(leaseId);
        if (leaseOpt.isEmpty()) {
            return false;
        }
        Lease lease = leaseOpt.get();

        if (currentUser.getRole().name().equals("LANDLORD")) {
            return lease.getLandlord().getId().equals(currentUser.getId());
        }
        if (currentUser.getRole().name().equals("TENANT")) {
            return lease.getTenant().getId().equals(currentUser.getTenantId());
        }
        return false;
    }
}