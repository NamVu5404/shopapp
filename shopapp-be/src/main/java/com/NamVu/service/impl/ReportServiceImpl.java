package com.NamVu.service.impl;

import com.NamVu.dto.response.report.*;
import com.NamVu.repository.ReportRepository;
import com.NamVu.service.ReportService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('ADMIN')")
public class ReportServiceImpl implements ReportService {
    ReportRepository reportRepository;

    @Override
    public OrderSummary getOrderSummary() {
        return reportRepository.getOrderSummary();
    }

    @Override
    public List<WeeklyRevenueTrend> getMonthlyRevenueTrend() {
        return reportRepository.getWeeklyRevenueTrend();
    }

    @Override
    public List<RevenueByOrderType> getRevenueByOrderType() {
        return reportRepository.getRevenueByOrderType();
    }

    @Override
    public List<CategoryReport> getCategoryReport() {
        return reportRepository.getCategoryReport();
    }

    @Override
    public List<SupplierReport> getSupplierReport() {
        return reportRepository.getSupplierReport();
    }

    @Override
    public List<UserGrowthRate> getUserGrowth() {
        return reportRepository.getUserGrowthRate();
    }

    @Override
    public List<ProductReport> getTop5ProductsByRevenue() {
        Pageable pageable = PageRequest.of(0, 5);
        return reportRepository.getTopProductsByRevenue(pageable);
    }

    @Override
    public List<ProductReport> getBottom5ProductsByRevenue() {
        Pageable pageable = PageRequest.of(0, 5);
        return reportRepository.getLowestProductsByRevenue(pageable);
    }

    @Override
    public RevenueByProduct getRevenueByProduct(String productCode) {
        return reportRepository.getRevenueByProduct(productCode);
    }
}
