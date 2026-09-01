package com.pharmacy.backend.service;

import com.pharmacy.backend.dto.OrderRequest;
import com.pharmacy.backend.dto.OrderItemRequest;
import com.pharmacy.backend.entity.*;
import com.pharmacy.backend.repository.CustomerRepository;
import com.pharmacy.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SalesService salesService;

    public Order createOrder(OrderRequest request) {

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<OrderItem> orderItems = new ArrayList<>();
        double subtotal = 0.0;

        for (OrderItemRequest itemRequest : request.getItems()) {

            Sales sale = new Sales();
            Customer saleCustomer = new Customer();
            saleCustomer.setId(request.getCustomerId());
            sale.setCustomer(saleCustomer);

            Medicine saleMedicine = new Medicine();
            saleMedicine.setId(itemRequest.getMedicineId());
            sale.setMedicine(saleMedicine);

            sale.setQuantity(itemRequest.getQuantity());

            // Reuses existing SalesService: stock check, price calc, stock deduction
            Sales savedSale = salesService.saveSale(sale);

            OrderItem orderItem = new OrderItem();
            orderItem.setMedicine(savedSale.getMedicine());
            orderItem.setQuantity(savedSale.getQuantity());
            orderItem.setUnitPrice(savedSale.getMedicine().getPrice());
            orderItem.setLineTotal(savedSale.getTotalPrice());

            subtotal += savedSale.getTotalPrice();
            orderItems.add(orderItem);
        }

        double discount = request.getDiscount() != null ? request.getDiscount() : 0.0;
        double gst = request.getGst() != null ? request.getGst() : 0.0;
        double grandTotal = subtotal - discount + gst;

        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setGst(gst);
        order.setGrandTotal(grandTotal);
        order.setPaymentMode(request.getPaymentMode());
        order.setItems(orderItems);

        orderItems.forEach(item -> item.setOrder(order));

        Order savedOrder = orderRepository.save(order);
        savedOrder.setOrderNumber("ORD-" + (1000 + savedOrder.getId()));
        return orderRepository.save(savedOrder);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }
}
