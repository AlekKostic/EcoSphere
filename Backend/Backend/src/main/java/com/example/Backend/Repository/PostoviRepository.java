package com.example.Backend.Repository;

import com.example.Backend.Models.Postovi;
import com.example.Backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PostoviRepository extends JpaRepository<Postovi, Long> {
    List<Postovi> findAllByAuthor(User user);
}
