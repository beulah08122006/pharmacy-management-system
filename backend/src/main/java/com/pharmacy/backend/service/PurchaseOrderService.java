package com.pharmacy.backend.service;

import com.pharmacy.backend.entity.PurchaseOrder;
import com.pharmacy.backend.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;


    // Create Purchase Order
    public PurchaseOrder createOrder(PurchaseOrder purchaseOrder) {

    purchaseOrder.setOrderDate(LocalDateTime.now());

    if(purchaseOrder.getStatus() == null){
        purchaseOrder.setStatus("PENDING");
    }

    return purchaseOrderRepository.save(purchaseOrder);
}


    // Get all Purchase Orders
    public List<PurchaseOrder> getAllOrders() {
        return purchaseOrderRepository.findAll();
    }


    // Get Purchase Order by ID
    public Optional<PurchaseOrder> getOrderById(Long id) {
        return purchaseOrderRepository.findById(id);
    }


    // Update Purchase Order
    public PurchaseOrder updateOrder(Long id, PurchaseOrder order) {

        PurchaseOrder existingOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order not found"));

        existingOrder.setOrderNumber(order.getOrderNumber());
        existingOrder.setSupplier(order.getSupplier());
        existingOrder.setTotalAmount(order.getTotalAmount());
        existingOrder.setStatus(order.getStatus());

        return purchaseOrderRepository.save(existingOrder);
    }


    // Delete Purchase Order
    public void deleteOrder(Long id) {
        purchaseOrderRepository.deleteById(id);
    }
}