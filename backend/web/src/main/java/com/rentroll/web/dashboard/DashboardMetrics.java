package com.rentroll.web.dashboard;

import java.math.BigDecimal;

public class DashboardMetrics {

    private final BigDecimal totalMonthlyRentDue;
    private final BigDecimal totalOverdueAmount;
    private final BigDecimal collectionRate;

    public DashboardMetrics(BigDecimal totalMonthlyRentDue, BigDecimal totalOverdueAmount, BigDecimal collectionRate) {
        this.totalMonthlyRentDue = totalMonthlyRentDue;
        this.totalOverdueAmount = totalOverdueAmount;
        this.collectionRate = collectionRate;
    }

    // Getters
    public BigDecimal getTotalMonthlyRentDue() {
        return totalMonthlyRentDue;
    }

    public BigDecimal getTotalOverdueAmount() {
        return totalOverdueAmount;
    }

    public BigDecimal getCollectionRate() {
        return collectionRate;
    }
}