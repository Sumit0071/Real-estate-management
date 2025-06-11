package com.dreamhome.controller;


import com.dreamhome.service.RazorPayService;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
public class PaymentController {


    @Autowired
    private RazorPayService razorPayService;

    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(
            @RequestParam int amount,
            @RequestParam String currency
    ) {
        try {
            System.out.println("Creating order with amount=" + amount + ", currency=" + currency);
            String order = razorPayService.createOrder(amount, currency, "receipt_100");
            return ResponseEntity.ok(order);
        } catch (RazorpayException e) {
            e.printStackTrace();  // This logs the full error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Order creation failed: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }



}
