package com.rentroll.web.tenant;

import com.rentroll.core.tenant.Tenant;
import com.rentroll.core.user.User;
import com.rentroll.services.tenant.TenantService;
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
@RequestMapping("/api/tenants")
@PreAuthorize("hasRole('LANDLORD')")
public class TenantController {

    private final TenantService tenantService;
    private final UserService userService;

    public TenantController(TenantService tenantService, UserService userService) {
        this.tenantService = tenantService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Tenant> createTenant(@RequestBody Tenant tenant) {
        // In a real app, you'd associate this tenant with the landlord, likely via a lease.
        // For now, we'll just create the tenant.
        Tenant createdTenant = tenantService.createTenant(tenant);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTenant);
    }

    @GetMapping
    public ResponseEntity<List<Tenant>> getTenantsForCurrentLandlord() {
        User currentUser = getCurrentUser();
        List<Tenant> tenants = tenantService.getTenantsByLandlord(currentUser.getId());
        return ResponseEntity.ok(tenants);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tenant> getTenantById(@PathVariable Long id) {
        if (!isUserAuthorizedForTenant(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Optional<Tenant> tenant = tenantService.getTenantById(id);
        return tenant.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tenant> updateTenant(@PathVariable Long id, @RequestBody Tenant tenantDetails) {
        if (!isUserAuthorizedForTenant(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Optional<Tenant> tenantOptional = tenantService.getTenantById(id);
        if (tenantOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Tenant tenant = tenantOptional.get();
        tenant.setName(tenantDetails.getName());
        tenant.setUnit(tenantDetails.getUnit());
        Tenant updatedTenant = tenantService.updateTenant(tenant);
        return ResponseEntity.ok(updatedTenant);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTenant(@PathVariable Long id) {
        if (!isUserAuthorizedForTenant(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        tenantService.deleteTenant(id);
        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userService.findByUsername(userDetails.getUsername());
    }

    private boolean isUserAuthorizedForTenant(Long tenantId) {
        User currentUser = getCurrentUser();
        List<Tenant> landlordTenants = tenantService.getTenantsByLandlord(currentUser.getId());
        return landlordTenants.stream().anyMatch(t -> t.getId().equals(tenantId));
    }
}