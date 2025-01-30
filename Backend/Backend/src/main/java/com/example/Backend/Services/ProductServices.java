package com.example.Backend.Services;

import com.example.Backend.DTO.Product.ProductDTO;
import com.example.Backend.DTO.Product.ProductSaveDTO;
import com.example.Backend.Models.Product;
import com.example.Backend.Models.User;
import com.example.Backend.Repository.ProductRepository;
import com.example.Backend.Repository.UserRepository;
import org.hibernate.Length;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.util.List;

@Service
public class ProductServices {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Product create(ProductDTO productDTO){
        User user = userRepository.findById(productDTO.getUser_id()).orElseThrow(()-> new RuntimeException("User ne postoji"));
        Product product = new Product();
        product.setBroj_pregleda(productDTO.getBroj_pregleda());
        product.setUser(user);
        product.setDescription(productDTO.getDescription());
        product.setName(productDTO.getName());
        product.setPhoneNumber(productDTO.getPhone_number());
        product.setPath(productDTO.getPath());
        product.setPrice(product.getPrice());
        return productRepository.save(product);
    }

    public List<Product> find(){
        return productRepository.findAll();
    }

    public ResponseEntity pregledi(Long id){
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product nije pronadjen"));
        product.setBroj_pregleda(product.getBroj_pregleda() + 1);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity save(ProductSaveDTO productSaveDTO){
        User user = userRepository.findById(productSaveDTO.getUser_id()).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        Product product = productRepository.findById(productSaveDTO.getProduct_id()).orElseThrow(() -> new RuntimeException("Product nije pronadjen"));
        List<Product> lista = user.getSacuvane();
        lista.add(product);
        user.setSacuvane(lista);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity unsave(ProductSaveDTO productSaveDTO){
        Product product = productRepository.findById(productSaveDTO.getProduct_id()).orElseThrow(() -> new RuntimeException("Product nije pronadjen"));
        product.setUser(null);
        productRepository.save(product);
        return ResponseEntity.ok().build();
    }
}
