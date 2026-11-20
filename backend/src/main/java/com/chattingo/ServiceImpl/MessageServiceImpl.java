package com.chattingo.ServiceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chattingo.Exception.ChatException;
import com.chattingo.Exception.MessageException;
import com.chattingo.Exception.UserException;
import com.chattingo.Model.Chat;
import com.chattingo.Model.Message;
import com.chattingo.Model.User;
import com.chattingo.Payload.SendMessageRequest;
import com.chattingo.Repository.MessageRepository;
import com.chattingo.Service.MessageService;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private ChatServiceImpl chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Send message and broadcast through WebSocket
    @Override
    @Transactional
    public Message sendMessage(SendMessageRequest req)
            throws UserException, ChatException {

        if (req == null || req.getUserId() == null || req.getChatId() == null) {
            throw new IllegalArgumentException("Invalid message request");
        }

        // Validate sender
        User user = userService.findUserById(req.getUserId());

        // Validate chat
        Chat chat = chatService.findChatById(req.getChatId());

        // Verify chat membership
        boolean isChatMember = chat.getUsers().stream()
                .anyMatch(chatUser ->
                        Objects.equals(chatUser.getId(), user.getId()));

        if (!isChatMember) {
            throw new UserException("You are not a member of this chat");
        }

        // Create message
        Message message = new Message();

        message.setChat(chat);
        message.setUser(user);
        message.setContent(req.getContent());
        message.setTimestamp(LocalDateTime.now());

        // Media metadata
        message.setMediaUrl(req.getMediaUrl());
        message.setMediaType(req.getMediaType());
        message.setFileName(req.getFileName());
        message.setFileSize(req.getFileSize());
        message.setVoiceMessage(req.isVoiceMessage());
        message.setVoiceDuration(req.getVoiceDuration());

        // Save message to database
        Message savedMessage = messageRepository.save(message);

        // Broadcast saved message to subscribed chat users
        messagingTemplate.convertAndSend(
                "/topic/chat/" + chat.getId(),
                savedMessage
        );

        return savedMessage;
    }

    // Get chat messages
    @Override
    @Transactional(readOnly = true)
    public List<Message> getChatsMessages(Integer chatId, User reqUser)
            throws ChatException, UserException {

        if (chatId == null || reqUser == null) {
            throw new IllegalArgumentException("Invalid chat request");
        }

        Chat chat = chatService.findChatById(chatId);

        boolean isChatMember = chat.getUsers().stream()
                .anyMatch(chatUser ->
                        Objects.equals(chatUser.getId(), reqUser.getId()));

        if (!isChatMember) {
            throw new UserException("You are not a member of this chat");
        }

        return messageRepository.findByChatId(chat.getId());
    }

    // Find message by ID
    @Override
    @Transactional(readOnly = true)
    public Message findMessageById(Integer messageId)
            throws MessageException {

        if (messageId == null) {
            throw new MessageException("Invalid message ID");
        }

        return messageRepository.findById(messageId)
                .orElseThrow(() ->
                        new MessageException("Message not found"));
    }

    // Delete message (only sender)
    @Override
    @Transactional
    public void deleteMessage(Integer messageId, User reqUser)
            throws MessageException {

        if (reqUser == null) {
            throw new MessageException("Invalid user");
        }

        Message message = findMessageById(messageId);

        if (!Objects.equals(
                message.getUser().getId(),
                reqUser.getId())) {

            throw new MessageException(
                    "You cannot delete another user's message");
        }

        messageRepository.delete(message);
    }
}
