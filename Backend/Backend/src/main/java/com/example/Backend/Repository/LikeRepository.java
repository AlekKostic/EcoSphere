package com.example.Backend.Repository;

import com.example.Backend.Models.Like;
import com.example.Backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    List<Like> findAllByUser(User user);
}
