package com.rentroll.core.dto;

import java.time.LocalDate;

public class TenantDTO {
    private Long id;
    private String name;
    private String unit;
    private LocalDate leaseStartDate;
    private LocalDate leaseEndDate;

    // Constructors, Getters, and Setters
    public TenantDTO(Long id, String name, String unit, LocalDate leaseStartDate, LocalDate leaseEndDate) {
        this.id = id;
        this.name = name;
        this.unit = unit;
        this.leaseStartDate = leaseStartDate;
        this.leaseEndDate = leaseEndDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public LocalDate getLeaseStartDate() { return leaseStartDate; }
    public void setLeaseStartDate(LocalDate leaseStartDate) { this.leaseStartDate = leaseStartDate; }
    public LocalDate getLeaseEndDate() { return leaseEndDate; }
    public void setLeaseEndDate(LocalDate leaseEndDate) { this.leaseEndDate = leaseEndDate; }
}
