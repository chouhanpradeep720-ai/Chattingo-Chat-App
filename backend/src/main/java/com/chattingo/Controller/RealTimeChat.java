package com.chattingo.Controller;

/*
 * Message broadcasting is handled by MessageServiceImpl.
 *
 * Messages are:
 * 1. Received through MessageController REST API.
 * 2. Saved in the database by MessageServiceImpl.
 * 3. Broadcast to /topic/chat/{chatId} using SimpMessagingTemplate.
 *
 * No separate STOMP message handler is required here.
 */
