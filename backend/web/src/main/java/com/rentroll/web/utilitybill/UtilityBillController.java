package com.rentroll.web.utilitybill;

import com.rentroll.core.utilitybill.UtilityBill;
import com.rentroll.services.utilitybill.UtilityBillService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/utility-bills")
public class UtilityBillController {

    private final UtilityBillService utilityBillService;

    public UtilityBillController(UtilityBillService utilityBillService) {
        this.utilityBillService = utilityBillService;
    }

    @PostMapping
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<UtilityBill> createUtilityBill(@RequestPart("utilityBill") UtilityBill utilityBill,
                                                         @RequestPart("file") MultipartFile file) {
        UtilityBill createdUtilityBill = utilityBillService.createUtilityBill(utilityBill, file);
        return ResponseEntity.ok(createdUtilityBill);
    }

    @GetMapping("/lease/{leaseId}")
    public ResponseEntity<List<UtilityBill>> getUtilityBillsByLeaseId(@PathVariable Long leaseId) {
        List<UtilityBill> utilityBills = utilityBillService.getUtilityBillsByLeaseId(leaseId);
        return ResponseEntity.ok(utilityBills);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UtilityBill> getUtilityBillById(@PathVariable Long id) {
        UtilityBill utilityBill = utilityBillService.getUtilityBillById(id);
        return ResponseEntity.ok(utilityBill);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('LANDLORD')")
    public ResponseEntity<Void> deleteUtilityBill(@PathVariable Long id) {
        utilityBillService.deleteUtilityBill(id);
        return ResponseEntity.noContent().build();
    }
}