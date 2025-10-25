package com.rentroll.web.lease;

import com.rentroll.core.lease.Lease;
import com.rentroll.core.user.User;
import com.rentroll.services.lease.LeaseService;
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
@RequestMapping("/api/leases")
public class LeaseController {

    private final LeaseService leaseService;
    private final UserService userService;

    public LeaseController(LeaseService leaseService, UserService userService) {
        this.leaseService = leaseService;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Lease> createLease(@RequestBody Lease lease) {
        // Ensure the lease is associated with the currently authenticated landlord
        User currentUser = getCurrentUser();
        lease.setLandlord(currentUser);
        Lease createdLease = leaseService.createLease(lease);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLease);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lease> getLeaseById(@PathVariable Long id) {
        Optional<Lease> leaseOpt = leaseService.getLeaseById(id);
        if (leaseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Lease lease = leaseOpt.get();
        User currentUser = getCurrentUser();

        // Security check for data isolation
        if (currentUser.getRole().name().equals("LANDLORD") && lease.getLandlord().getId().equals(currentUser.getId())) {
            return ResponseEntity.ok(lease);
        }
        if (currentUser.getRole().name().equals("TENANT") && lease.getTenant().getId().equals(currentUser.getTenantId())) {
            return ResponseEntity.ok(lease);
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @GetMapping("/landlord")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<List<Lease>> getLeasesForCurrentLandlord() {
        User currentUser = getCurrentUser();
        List<Lease> leases = leaseService.getLeasesByLandlord(currentUser.getId());
        return ResponseEntity.ok(leases);
    }

    @GetMapping("/tenant")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<Lease>> getLeasesForCurrentTenant() {
        User currentUser = getCurrentUser();
        List<Lease> leases = leaseService.getLeasesByTenant(currentUser.getTenantId());
        return ResponseEntity.ok(leases);
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findByUsername(userDetails.getUsername());
    }
}