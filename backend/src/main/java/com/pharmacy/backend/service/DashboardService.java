package com.pharmacy.backend.service;

import com.pharmacy.backend.dto.DashboardDTO;
import com.pharmacy.backend.repository.CustomerRepository;
import com.pharmacy.backend.repository.InventoryRepository;
import com.pharmacy.backend.repository.InvoiceRepository;
import com.pharmacy.backend.repository.MedicineRepository;
import com.pharmacy.backend.repository.SalesRepository;
import com.pharmacy.backend.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public DashboardDTO getDashboardData() {

        DashboardDTO dashboard = new DashboardDTO();

        dashboard.setTotalMedicines(medicineRepository.count());
        dashboard.setTotalCustomers(customerRepository.count());
        dashboard.setTotalSuppliers(supplierRepository.count());
        dashboard.setTotalSales(salesRepository.count());
        dashboard.setTotalInvoices(invoiceRepository.count());

        double revenue = salesRepository.findAll()
                .stream()
                .mapToDouble(sale -> sale.getTotalPrice())
                .sum();

        dashboard.setTotalRevenue(revenue);

        dashboard.setLowStockMedicines(
                inventoryRepository.countLowStockMedicines()
        );

        return dashboard;
    }
}