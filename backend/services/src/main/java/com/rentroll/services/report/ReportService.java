package com.rentroll.services.report;

import java.util.Map;

public interface ReportService {
    Map<String, Double> getPaymentMethodBreakdown(Long landlordId);
}
