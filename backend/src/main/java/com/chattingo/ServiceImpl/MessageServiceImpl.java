package com.chattingo.ServiceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

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

    @Override
    public Message sendMessage(SendMessageRequest req)
            throws UserException, ChatException {

        User user = userService.findUserById(req.getUserId());

        Chat chat = chatService.findChatById(req.getChatId());

        boolean isChatMember = chat.getUsers().stream()
                .anyMatch(chatUser ->
                        Objects.equals(chatUser.getId(), user.getId()));

        if (!isChatMember) {
            throw new UserException("You are not related to this chat");
        }

        Message message = new Message();

        message.setChat(chat);
        message.setUser(user);
        message.setContent(req.getContent());
        message.setTimestamp(LocalDateTime.now());

        Message savedMessage = messageRepository.save(message);

        // Broadcast message to all users subscribed to this chat.
        messagingTemplate.convertAndSend(
                "/topic/chat/" + chat.getId(),
                savedMessage
        );

        return savedMessage;
    }

    @Override
    public List<Message> getChatsMessages(Integer chatId, User reqUser)
            throws ChatException, UserException {

        Chat chat = chatService.findChatById(chatId);

        boolean isChatMember = chat.getUsers().stream()
                .anyMatch(chatUser ->
                        Objects.equals(chatUser.getId(), reqUser.getId()));

        if (!isChatMember) {
            throw new UserException("You are not related to this chat");
        }

        return messageRepository.findByChatId(chat.getId());
    }

    @Override
    public Message findMessageById(Integer messageId)
            throws MessageException {

        return messageRepository.findById(messageId)
                .orElseThrow(() ->
                        new MessageException("Message not found"));
    }

    @Override
    public void deleteMessage(Integer messageId, User reqUser)
            throws MessageException {

        Message message = findMessageById(messageId);

        if (Objects.equals(
                message.getUser().getId(),
                reqUser.getId())) {

            messageRepository.delete(message);

        } else {
            throw new MessageException(
                    "You cannot delete another user's message");
        }
    }
}
