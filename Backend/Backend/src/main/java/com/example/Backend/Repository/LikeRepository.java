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
    @Modifying
    @Transactional
    @Query("UPDATE Like l SET l.post = NULL WHERE l.user.Id = :userId")
    void setLikesToNullForUser(@Param("userId") Long userId);
    List<Like> findAllByUser(User user);

}
