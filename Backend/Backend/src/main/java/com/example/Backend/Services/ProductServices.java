package com.example.Backend.Services;

import com.example.Backend.Models.Product;
import com.example.Backend.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServices {
    @Autowired
    private ProductRepository productRepository;

    public Product create(Product product){
        return productRepository.save(product);
    }

    public List<Product> find(){
        return productRepository.findAll();
    }
}
