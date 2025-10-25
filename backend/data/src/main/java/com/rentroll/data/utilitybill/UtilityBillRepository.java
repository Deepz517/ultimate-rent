package com.rentroll.data.utilitybill;

import com.rentroll.core.utilitybill.UtilityBill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UtilityBillRepository extends JpaRepository<UtilityBill, Long> {
    List<UtilityBill> findByLeaseId(Long leaseId);
}