package com.rentroll.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.rentroll")
@EnableJpaRepositories(basePackages = "com.rentroll.data")
@EntityScan(basePackages = "com.rentroll.core")
@EnableScheduling
public class RentRollApplication {

    public static void main(String[] args) {
        SpringApplication.run(RentRollApplication.class, args);
    }
}