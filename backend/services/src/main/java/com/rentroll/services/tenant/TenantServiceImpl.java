package com.rentroll.services.tenant;

import com.rentroll.core.lease.Lease;
import com.rentroll.core.tenant.Tenant;
import com.rentroll.data.lease.LeaseRepository;
import com.rentroll.data.tenant.TenantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TenantServiceImpl implements TenantService {

    private final TenantRepository tenantRepository;
    private final LeaseRepository leaseRepository;

    public TenantServiceImpl(TenantRepository tenantRepository, LeaseRepository leaseRepository) {
        this.tenantRepository = tenantRepository;
        this.leaseRepository = leaseRepository;
    }

    @Override
    public Tenant createTenant(Tenant tenant) {
        return tenantRepository.save(tenant);
    }

    @Override
    public Optional<Tenant> getTenantById(Long id) {
        return tenantRepository.findById(id);
    }

    @Override
    public List<Tenant> getTenantsByLandlord(Long landlordId) {
        return leaseRepository.findByLandlordId(landlordId)
                .stream()
                .map(Lease::getTenant)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public Tenant updateTenant(Tenant tenant) {
        return tenantRepository.save(tenant);
    }

    @Override
    public void deleteTenant(Long id) {
        // Business logic to ensure a tenant can't be deleted if they have an active lease would go here
        tenantRepository.deleteById(id);
    }
}