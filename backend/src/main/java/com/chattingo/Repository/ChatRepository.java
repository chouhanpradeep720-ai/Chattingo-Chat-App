package com.chattingo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.chattingo.Model.Chat;
import com.chattingo.Model.User;

public interface ChatRepository extends JpaRepository<Chat, Integer> {

    // Find all chats belonging to a user
    @Query("SELECT DISTINCT c FROM Chat c JOIN c.users u WHERE u.id = :userId")
    List<Chat> findChatByUserId(@Param("userId") Integer userId);

    // Find existing single chat between two users
    @Query("""
            SELECT c FROM Chat c
            WHERE c.isGroup = false
            AND :user MEMBER OF c.users
            AND :reqUser MEMBER OF c.users
            """)
    Chat findSingleChatByUserIds(
            @Param("user") User user,
            @Param("reqUser") User reqUser
    );
}
