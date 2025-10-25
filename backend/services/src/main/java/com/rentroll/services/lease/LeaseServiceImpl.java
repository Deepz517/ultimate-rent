package com.rentroll.services.lease;

import com.rentroll.core.lease.Lease;
import com.rentroll.data.lease.LeaseRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LeaseServiceImpl implements LeaseService {

    private final LeaseRepository leaseRepository;

    public LeaseServiceImpl(LeaseRepository leaseRepository) {
        this.leaseRepository = leaseRepository;
    }

    @Override
    public Lease createLease(Lease lease) {
        // In a real application, we would validate that the landlord exists and has permissions
        return leaseRepository.save(lease);
    }

    @Override
    public Optional<Lease> getLeaseById(Long id) {
        return leaseRepository.findById(id);
    }

    @Override
    public List<Lease> getLeasesByLandlord(Long landlordId) {
        return leaseRepository.findByLandlordId(landlordId);
    }

    @Override
    public List<Lease> getLeasesByTenant(Long tenantId) {
        return leaseRepository.findByTenantId(tenantId);
    }

    @Override
    public Lease updateLease(Lease lease) {
        return leaseRepository.save(lease);
    }

    @Override
    public void deleteLease(Long id) {
        leaseRepository.deleteById(id);
    }
}