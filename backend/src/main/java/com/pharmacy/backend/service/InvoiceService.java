package com.pharmacy.backend.service;

import com.pharmacy.backend.entity.Invoice;
import com.pharmacy.backend.entity.Sales;
import com.pharmacy.backend.repository.InvoiceRepository;
import com.pharmacy.backend.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private SalesRepository salesRepository;

    // Create Invoice
    public Invoice createInvoice(Long saleId) {

        Sales sale = salesRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found"));

        Invoice invoice = new Invoice();

        // Invoice Number
        invoice.setInvoiceNumber("INV-" + (invoiceRepository.count() + 1001));

        // Customer
        invoice.setCustomer(sale.getCustomer());

        // Sale
        invoice.setSale(sale);

        // Total Amount
        invoice.setTotalAmount(sale.getTotalPrice());

        // Invoice Date
        invoice.setInvoiceDate(LocalDateTime.now());

        return invoiceRepository.save(invoice);
    }

    // Get All Invoices
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    // Get Invoice By ID
    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }

    // Delete Invoice
    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
}