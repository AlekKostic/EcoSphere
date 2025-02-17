package com.example.Backend.Repository;

import com.example.Backend.Models.Like;
import com.example.Backend.Models.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    List<Like> findAllByUser(User user);

    Like findByPost_IdAndUser_Id(Long postId, Long userId);

    List<Like> findAllByPost_Id(Long postId);
}
