package com.rentroll.services.dashboard;

import java.math.BigDecimal;

public interface DashboardService {
    BigDecimal getTotalMonthlyRentDue(Long landlordId);
    BigDecimal getTotalOverdueAmount(Long landlordId);
    BigDecimal getCollectionRate(Long landlordId);
}