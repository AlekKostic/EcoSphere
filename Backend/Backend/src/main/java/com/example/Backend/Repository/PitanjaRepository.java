package com.example.Backend.Repository;

import com.example.Backend.Models.Pitanja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PitanjaRepository extends JpaRepository<Pitanja, Long> {
    @Query(value = "SELECT * FROM Pitanja", nativeQuery = true)
    List<Pitanja> findAllNative();
}
