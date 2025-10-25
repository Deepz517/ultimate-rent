package com.rentroll.services.utilitybill;

import com.rentroll.core.utilitybill.UtilityBill;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface UtilityBillService {
    UtilityBill createUtilityBill(UtilityBill utilityBill, MultipartFile file);
    List<UtilityBill> getUtilityBillsByLeaseId(Long leaseId);
    UtilityBill getUtilityBillById(Long id);
    void deleteUtilityBill(Long id);
}