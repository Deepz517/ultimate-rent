package com.rentroll.data.lease;

import com.rentroll.core.lease.Lease;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaseRepository extends JpaRepository<Lease, Long> {
    List<Lease> findByLandlordId(Long landlordId);
    List<Lease> findByTenantId(Long tenantId);
}