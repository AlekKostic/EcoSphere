package com.example.Backend.Repository;

import com.example.Backend.Models.Product;
import com.example.Backend.Models.Sacuvane;
import com.example.Backend.Models.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SacuvaneRepository extends JpaRepository<Sacuvane, Long> {
    Sacuvane findByUserAndProduct(User user, Product product);

    List<Sacuvane> findByProduct(Product product);

    List<Sacuvane> findByUser(User user);
}
