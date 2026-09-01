package com.pharmacy.backend.payment;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class StripePaymentController {

    private final StripePaymentService stripePaymentService;

    public StripePaymentController(
            StripePaymentService stripePaymentService
    ) {
        this.stripePaymentService = stripePaymentService;
    }

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(
            @RequestBody PaymentRequest request
    ) {
        try {
            if (request.amount() <= 0) {
                return ResponseEntity.badRequest().body(
                        Map.of("message", "Payment amount must be greater than zero.")
                );
            }

            long amountInPaise =
                    Math.round(request.amount() * 100);

            String orderReference =
                    request.orderReference() == null ||
                    request.orderReference().isBlank()
                            ? "PHARMACY-PAYMENT"
                            : request.orderReference();

            String checkoutUrl =
                    stripePaymentService.createCheckoutSession(
                            amountInPaise,
                            orderReference
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "url", checkoutUrl,
                            "message", "Stripe checkout session created."
                    )
            );

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of(
                            "message",
                            "Unable to create Stripe payment session."
                    )
            );
        }
    }

    public record PaymentRequest(
            double amount,
            String orderReference
    ) {
    }
}