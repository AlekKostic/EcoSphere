package com.example.Backend.Controllers;

import com.example.Backend.Models.Product;
import com.example.Backend.Services.ProductServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v5/api")
public class ProductController {
    @Autowired
    private ProductServices productServices;

    @PostMapping("/create")
    public Product create(@RequestBody Product product){
        return productServices.create(product);
    }

    @GetMapping
    public List<Product> getProduct(){
        return productServices.find();
    }
}
