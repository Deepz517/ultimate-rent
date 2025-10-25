package com.rentroll.services.utilitybill;

import com.rentroll.core.utilitybill.UtilityBill;
import com.rentroll.data.utilitybill.UtilityBillRepository;
import com.rentroll.services.storage.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
public class UtilityBillServiceImpl implements UtilityBillService {

    private final UtilityBillRepository utilityBillRepository;
    private final StorageService storageService;

    public UtilityBillServiceImpl(UtilityBillRepository utilityBillRepository, StorageService storageService) {
        this.utilityBillRepository = utilityBillRepository;
        this.storageService = storageService;
    }

    @Override
    public UtilityBill createUtilityBill(UtilityBill utilityBill, MultipartFile file) {
        String imageUrl = storageService.store(file);
        utilityBill.setImageUrl(imageUrl);
        return utilityBillRepository.save(utilityBill);
    }

    @Override
    public List<UtilityBill> getUtilityBillsByLeaseId(Long leaseId) {
        return utilityBillRepository.findByLeaseId(leaseId);
    }

    @Override
    public UtilityBill getUtilityBillById(Long id) {
        return utilityBillRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteUtilityBill(Long id) {
        utilityBillRepository.deleteById(id);
    }
}