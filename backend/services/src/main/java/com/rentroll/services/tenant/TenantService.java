package com.rentroll.services.tenant;

import com.rentroll.core.tenant.Tenant;
import java.util.List;
import java.util.Optional;

public interface TenantService {
    Tenant createTenant(Tenant tenant);
    Optional<Tenant> getTenantById(Long id);
    List<com.rentroll.core.dto.TenantDTO> getTenantsByLandlord(Long landlordId);
    Tenant updateTenant(Tenant tenant);
    void deleteTenant(Long id);
}