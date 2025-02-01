package com.example.Backend.Controllers;

import com.example.Backend.DTO.Product.ProductDTO;
import com.example.Backend.DTO.Product.ProductSaveDTO;
import com.example.Backend.Models.Product;
import com.example.Backend.Models.User;
import com.example.Backend.Services.ProductServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v5/api")
public class ProductController {
    @Autowired
    private ProductServices productServices;

    @PostMapping("/create")
    public ProductDTO create(@RequestBody ProductDTO product){
        return productServices.create(product);
    }

    @GetMapping
    public List<ProductDTO> getProduct(){
        return productServices.find();
    }

    @PutMapping("/{id}")
    public ResponseEntity pregledi(@PathVariable("id") Long id){
        return productServices.pregledi(id);
    }

    @PutMapping("/save")
    public  ResponseEntity save(@RequestBody ProductSaveDTO productSaveDTO){
        return productServices.save(productSaveDTO);
    }

    @PutMapping("/unsave")
    public ResponseEntity unsave(@RequestBody ProductSaveDTO productSaveDTO){
        return productServices.unsave(productSaveDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity remove(@PathVariable Long id){
        return productServices.delete(id);
    }

    @GetMapping("/user/{id}")
    public List<ProductDTO> find(@PathVariable("id") Long id){
        return productServices.search(id);
    }
}
