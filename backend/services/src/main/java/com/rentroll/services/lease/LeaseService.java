package com.rentroll.services.lease;

import com.rentroll.core.lease.Lease;
import java.util.List;
import java.util.Optional;

public interface LeaseService {
    Lease createLease(Lease lease);
    Optional<Lease> getLeaseById(Long id);
    List<Lease> getLeasesByLandlord(Long landlordId);
    List<Lease> getLeasesByTenant(Long tenantId);
    Lease updateLease(Lease lease);
    void deleteLease(Long id);
}