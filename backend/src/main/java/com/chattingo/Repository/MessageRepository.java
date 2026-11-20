package com.chattingo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.chattingo.Model.Message;

public interface MessageRepository extends JpaRepository<Message, Integer> {

    // Fetch chat messages in chronological order
    @Query("""
            SELECT m FROM Message m
            WHERE m.chat.id = :chatId
            ORDER BY m.timestamp ASC
            """)
    List<Message> findByChatId(@Param("chatId") Integer chatId);
}
