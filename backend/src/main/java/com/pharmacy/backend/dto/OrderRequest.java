package com.pharmacy.backend.dto;

import java.util.List;

public class OrderRequest {
    private Long customerId;
    private List<OrderItemRequest> items;
    private Double discount;
    private Double gst;
    private String paymentMode;

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
    public Double getDiscount() { return discount; }
    public void setDiscount(Double discount) { this.discount = discount; }
    public Double getGst() { return gst; }
    public void setGst(Double gst) { this.gst = gst; }
    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }
}