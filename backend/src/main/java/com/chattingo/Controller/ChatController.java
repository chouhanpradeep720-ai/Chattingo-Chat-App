package com.chattingo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chattingo.Exception.ChatException;
import com.chattingo.Exception.UserException;
import com.chattingo.Model.Chat;
import com.chattingo.Model.User;
import com.chattingo.Payload.ApiResponse;
import com.chattingo.Payload.GroupChatRequest;
import com.chattingo.Payload.SingleChatRequest;
import com.chattingo.ServiceImpl.ChatServiceImpl;
import com.chattingo.ServiceImpl.UserServiceImpl;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatServiceImpl chatService;

    @Autowired
    private UserServiceImpl userService;

    // Create or get existing single chat
    @PostMapping("/single")
    public ResponseEntity<Chat> createChatHandler(
            @RequestBody SingleChatRequest request,
            @RequestHeader("Authorization") String jwt) throws UserException {

        User reqUser = userService.findUserProfile(jwt);

        Chat chat = chatService.createChat(reqUser, request.getUserId());

        return ResponseEntity.status(HttpStatus.CREATED).body(chat);
    }

    // Create group chat
    @PostMapping("/group")
    public ResponseEntity<Chat> createGroupHandler(
            @RequestBody GroupChatRequest request,
            @RequestHeader("Authorization") String jwt) throws UserException {

        User reqUser = userService.findUserProfile(jwt);

        Chat chat = chatService.createGroup(request, reqUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(chat);
    }

    // Find chat by ID
    @GetMapping("/{chatId}")
    public ResponseEntity<Chat> findChatByIdHandler(
            @PathVariable Integer chatId) throws ChatException {

        Chat chat = chatService.findChatById(chatId);

        return ResponseEntity.ok(chat);
    }

    // Get all chats of logged-in user
    @GetMapping("/user")
    public ResponseEntity<List<Chat>> findChatByUserIdHandler(
            @RequestHeader("Authorization") String jwt) throws UserException {

        User reqUser = userService.findUserProfile(jwt);

        List<Chat> chats = chatService.findAllChatByUserId(reqUser.getId());

        return ResponseEntity.ok(chats);
    }

    // Add user to group
    @PutMapping("/{chatId}/add/{userId}")
    public ResponseEntity<Chat> addUserToGroupHandler(
            @PathVariable Integer chatId,
            @PathVariable Integer userId,
            @RequestHeader("Authorization") String jwt)
            throws UserException, ChatException {

        User reqUser = userService.findUserProfile(jwt);

        Chat chat = chatService.addUserToGroup(userId, chatId, reqUser);

        return ResponseEntity.ok(chat);
    }

    // Remove user from group
    @PutMapping("/{chatId}/remove/{userId}")
    public ResponseEntity<Chat> removeUserFromGroupHandler(
            @PathVariable Integer chatId,
            @PathVariable Integer userId,
            @RequestHeader("Authorization") String jwt)
            throws UserException, ChatException {

        User reqUser = userService.findUserProfile(jwt);

        Chat chat = chatService.removeFromGroup(userId, chatId, reqUser);

        return ResponseEntity.ok(chat);
    }

    // Delete chat
    @DeleteMapping("/delete/{chatId}")
    public ResponseEntity<ApiResponse> deleteChatHandler(
            @PathVariable Integer chatId,
            @RequestHeader("Authorization") String jwt)
            throws UserException, ChatException {

        User reqUser = userService.findUserProfile(jwt);

        chatService.deleteChat(chatId, reqUser.getId());

        ApiResponse response = new ApiResponse("Deleted Successfully...", false);

        return ResponseEntity.ok(response);
    }
}
