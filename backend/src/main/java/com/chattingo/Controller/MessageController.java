package com.chattingo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chattingo.Exception.ChatException;
import com.chattingo.Exception.MessageException;
import com.chattingo.Exception.UserException;
import com.chattingo.Model.Message;
import com.chattingo.Model.User;
import com.chattingo.Payload.ApiResponse;
import com.chattingo.Payload.SendMessageRequest;
import com.chattingo.ServiceImpl.MessageServiceImpl;
import com.chattingo.ServiceImpl.UserServiceImpl;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageServiceImpl messageService;

    @Autowired
    private UserServiceImpl userService;

    // Send message
    @PostMapping("/create")
    public ResponseEntity<Message> sendMessageHandler(
            @RequestBody SendMessageRequest request,
            @RequestHeader("Authorization") String jwt)
            throws UserException, ChatException {

        User user = userService.findUserProfile(jwt);

        request.setUserId(user.getId());

        Message message = messageService.sendMessage(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    // Get all messages of a chat
    @GetMapping("/{chatId}")
    public ResponseEntity<List<Message>> getChatMessageHandler(
            @PathVariable Integer chatId,
            @RequestHeader("Authorization") String jwt)
            throws UserException, ChatException {

        User user = userService.findUserProfile(jwt);

        List<Message> messages = messageService.getChatsMessages(chatId, user);

        return ResponseEntity.ok(messages);
    }

    // Delete message
    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse> deleteMessageHandler(
            @PathVariable Integer messageId,
            @RequestHeader("Authorization") String jwt)
            throws UserException, MessageException {

        User user = userService.findUserProfile(jwt);

        messageService.deleteMessage(messageId, user);

        ApiResponse response = new ApiResponse("Message deleted successfully", false);

        return ResponseEntity.ok(response);
    }
}
