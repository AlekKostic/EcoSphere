package com.example.Backend.Services;

import com.example.Backend.DTO.Product.ProductDTO;
import com.example.Backend.DTO.Product.ProductSaveDTO;
import com.example.Backend.Models.Product;
import com.example.Backend.Models.Sacuvane;
import com.example.Backend.Models.User;
import com.example.Backend.Repository.ProductRepository;
import com.example.Backend.Repository.SacuvaneRepository;
import com.example.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServices {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SacuvaneRepository sacuvaneRepository;

    public ProductDTO create(ProductDTO productDTO){
        User user = userRepository.findById(productDTO.getUser_id()).orElseThrow(()-> new RuntimeException("User ne postoji"));
        Product product = new Product();
        product.setBroj_pregleda(productDTO.getBroj_pregleda());
        product.setUser(user);
        product.setDescription(productDTO.getDescription());
        product.setName(productDTO.getName());
        product.setPhoneNumber(productDTO.getPhone_number());
        product.setPath(productDTO.getPath());
        product.setPrice(productDTO.getPrice());
        productRepository.save(product);
        return new ProductDTO(productDTO.getPath(), productDTO.getDescription(), productDTO.getName(), productDTO.getPhone_number(), product.getPrice(), productDTO.getBroj_pregleda(), user.getId(), product.getProduct_id());
    }

    public List<ProductDTO> find(){
         List<Product> productList = productRepository.findAll();
         return productList.stream().map(product -> {
             ProductDTO productDTO = new ProductDTO(product.getPath(), product.getDescription(), product.getName(), product.getPhoneNumber(), product.getPrice(), product.getBroj_pregleda(),product.getUser().getId(), product.getProduct_id());
            return productDTO;
         }).collect(Collectors.toList());
    }

    public ResponseEntity pregledi(Long id){
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product nije pronadjen"));
        product.setBroj_pregleda(product.getBroj_pregleda() + 1);
        productRepository.save(product);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity save(ProductSaveDTO productSaveDTO){
        User user = userRepository.findById(productSaveDTO.getUser_id()).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        Product product = productRepository.findById(productSaveDTO.getProduct_id()).orElseThrow(() -> new RuntimeException("Product nije pronadjen"));
        Sacuvane sacuvane = new Sacuvane();
        sacuvane.setProduct(product);
        sacuvane.setUser(user);
        sacuvaneRepository.save(sacuvane);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity unsave(ProductSaveDTO productSaveDTO){
        Product product = productRepository.findById(productSaveDTO.getProduct_id()).orElseThrow(() -> new RuntimeException("Product nije pronadjen"));
        User user = userRepository.findById(productSaveDTO.getUser_id()).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        Sacuvane sacuvane = sacuvaneRepository.findByUserAndProduct(user, product);
        sacuvane.setUser(null);
        sacuvane.setProduct(null);
        sacuvaneRepository.save(sacuvane);
        sacuvaneRepository.delete(sacuvane);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity delete(Long id){
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product nije pronadjen"));
        List<Sacuvane> sacuvane = sacuvaneRepository.findByProduct(product);
        for (Sacuvane sacuvane1 : sacuvane){
            sacuvane1.setUser(null);
            sacuvane1.setProduct(null);
            sacuvaneRepository.save(sacuvane1);
            sacuvaneRepository.delete(sacuvane1);
        }
        product.setUser(null);
        productRepository.save(product);
        productRepository.delete(product);
        return ResponseEntity.ok().build();
    }

    public List<ProductDTO> search(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User nije pronadjen"));
        List<Product> productList = productRepository.findByUser(user);
        return productList.stream().map(product -> {
            ProductDTO productDTO = new ProductDTO(product.getPath(), product.getDescription(), product.getName(), product.getPhoneNumber(), product.getPrice(), product.getBroj_pregleda(), product.getUser().getId(), product.getProduct_id());
            return productDTO;
        }).collect(Collectors.toList());
    }
}
