package com.pharmacy.backend.controller;

import com.pharmacy.backend.entity.PurchaseOrder;
import com.pharmacy.backend.service.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin("*")
public class PurchaseOrderController {


    @Autowired
    private PurchaseOrderService purchaseOrderService;


    // Create Purchase Order
    @PostMapping
    public ResponseEntity<PurchaseOrder> createOrder(
            @RequestBody PurchaseOrder purchaseOrder) {

        return ResponseEntity.ok(
                purchaseOrderService.createOrder(purchaseOrder)
        );
    }


    // Get All Purchase Orders
    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getAllOrders() {

        return ResponseEntity.ok(
                purchaseOrderService.getAllOrders()
        );
    }


    // Get Purchase Order By ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long id) {

        return purchaseOrderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // Update Purchase Order
    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrder> updateOrder(
            @PathVariable Long id,
            @RequestBody PurchaseOrder purchaseOrder) {

        return ResponseEntity.ok(
                purchaseOrderService.updateOrder(id, purchaseOrder)
        );
    }


    // Delete Purchase Order
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(
            @PathVariable Long id) {

        purchaseOrderService.deleteOrder(id);

        return ResponseEntity.ok(
                "Purchase Order deleted successfully"
        );
    }
}
