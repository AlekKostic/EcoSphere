package com.example.Backend.Repository;

import com.example.Backend.Models.Postovi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public interface PostoviRepository extends JpaRepository<Postovi, Long> {
}
