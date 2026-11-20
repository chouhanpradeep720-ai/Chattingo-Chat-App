package com.chattingo.ServiceImpl;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chattingo.Exception.ChatException;
import com.chattingo.Exception.UserException;
import com.chattingo.Model.Chat;
import com.chattingo.Model.User;
import com.chattingo.Payload.GroupChatRequest;
import com.chattingo.Repository.ChatRepository;
import com.chattingo.Service.ChatService;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private ChatRepository chatRepository;

    // Helper: check membership by user ID
    private boolean isMember(Chat chat, Integer userId) {
        return chat.getUsers().stream()
                .anyMatch(user -> Objects.equals(user.getId(), userId));
    }

    // Helper: check admin by user ID
    private boolean isAdmin(Chat chat, Integer userId) {
        return chat.getAdmins().stream()
                .anyMatch(admin -> Objects.equals(admin.getId(), userId));
    }

    // Helper: count group admins
    private long countAdmins(Chat chat) {
        return chat.getAdmins().stream()
                .map(User::getId)
                .distinct()
                .count();
    }

    // Create single chat or return existing chat
    @Override
    @Transactional
    public Chat createChat(User reqUser, Integer userId) throws UserException {

        if (reqUser == null || userId == null || userId == reqUser.getId()) {

            throw new UserException("Invalid user ID for chat");
        }

        User targetUser = userService.findUserById(userId);

        Chat existingChat =
                chatRepository.findSingleChatByUserIds(targetUser, reqUser);

        if (existingChat != null) {
            return existingChat;
        }

        Chat chat = new Chat();

        chat.setCreatedBy(reqUser);
        chat.setGroup(false);

        chat.getUsers().add(reqUser);
        chat.getUsers().add(targetUser);

        return chatRepository.save(chat);
    }

    // Find chat by ID
    @Override
    @Transactional(readOnly = true)
    public Chat findChatById(Integer chatId) throws ChatException {

        if (chatId == null) {
            throw new ChatException("Chat ID cannot be null");
        }

        return chatRepository.findById(chatId)
                .orElseThrow(() ->
                        new ChatException("The requested chat was not found"));
    }

    // Get all chats for a user
    @Override
    @Transactional(readOnly = true)
    public List<Chat> findAllChatByUserId(Integer userId) throws UserException {

        if (userId == null) {
            throw new UserException("User ID cannot be null");
        }

        User user = userService.findUserById(userId);

        return chatRepository.findChatByUserId(user.getId());
    }

    // Create group chat
    @Override
    @Transactional
    public Chat createGroup(GroupChatRequest req, User reqUser)
            throws UserException {

        if (req == null || reqUser == null) {
            throw new UserException("Invalid group creation request");
        }

        if (req.getChatName() == null || req.getChatName().trim().isEmpty()) {
            throw new IllegalArgumentException("Group name cannot be empty");
        }

        Chat group = new Chat();

        group.setGroup(true);
        group.setChatName(req.getChatName().trim());
        group.setChatImage(req.getChatImage());
        group.setCreatedBy(reqUser);

        // Creator is a member and admin
        group.getUsers().add(reqUser);
        group.getAdmins().add(reqUser);

        if (req.getUserIds() != null) {

            for (Integer userId : req.getUserIds()) {

                if (userId == null || userId.equals(reqUser.getId())) {
                    continue;
                }

                // Avoid duplicate members
                if (isMember(group, userId)) {
                    continue;
                }

                User user = userService.findUserById(userId);
                group.getUsers().add(user);
            }
        }

        return chatRepository.save(group);
    }

    // Add user to group
    @Override
    @Transactional
    public Chat addUserToGroup(Integer userId, Integer chatId, User reqUser)
            throws UserException, ChatException {

        if (userId == null || chatId == null || reqUser == null) {
            throw new UserException("Invalid request");
        }

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() ->
                        new ChatException("The requested chat was not found"));

        if (!chat.isGroup()) {
            throw new ChatException("Users can only be added to group chats");
        }

        if (!isAdmin(chat, reqUser.getId())) {
            throw new UserException("Only group admins can add members");
        }

        User user = userService.findUserById(userId);

        if (isMember(chat, userId)) {
            return chat;
        }

        chat.getUsers().add(user);

        return chatRepository.save(chat);
    }

    // Rename group
    @Override
    @Transactional
    public Chat renameGroup(Integer chatId, String groupName, User reqUser)
            throws ChatException, UserException {

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() ->
                        new ChatException("The requested chat was not found"));

        if (!chat.isGroup()) {
            throw new ChatException("This chat is not a group");
        }

        if (reqUser == null || !isAdmin(chat, reqUser.getId())) {
            throw new UserException("Only group admins can rename the group");
        }

        if (groupName == null || groupName.trim().isEmpty()) {
            throw new IllegalArgumentException("Group name cannot be empty");
        }

        chat.setChatName(groupName.trim());

        return chatRepository.save(chat);
    }

    // Remove member or leave group
    @Override
    @Transactional
    public Chat removeFromGroup(Integer chatId, Integer userId, User reqUser)
            throws UserException, ChatException {

        if (chatId == null || userId == null || reqUser == null) {
            throw new UserException("Invalid request");
        }

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() ->
                        new ChatException("The requested chat was not found"));

        if (!chat.isGroup()) {
            throw new ChatException("This operation is only allowed for groups");
        }

        User targetUser = userService.findUserById(userId);

        if (!isMember(chat, userId)) {
            throw new UserException("User is not a member of this group");
        }

        boolean requesterIsAdmin = isAdmin(chat, reqUser.getId());
        boolean requesterRemovingSelf = reqUser.getId() == userId;

        // Only admins can remove other members
        if (!requesterIsAdmin && !requesterRemovingSelf) {
            throw new UserException("You do not have permission to remove this user");
        }

        // Prevent removing the last admin
        if (isAdmin(chat, userId) && countAdmins(chat) <= 1) {
            throw new UserException(
                    "The last admin cannot leave or be removed");
        }

        chat.getUsers().remove(targetUser);
        chat.getAdmins().remove(targetUser);

        return chatRepository.save(chat);
    }

    // Delete chat
    @Override
    @Transactional
    public void deleteChat(Integer chatId, Integer userId)
            throws ChatException, UserException {

        if (chatId == null || userId == null) {
            throw new UserException("Invalid request");
        }

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() ->
                        new ChatException("The requested chat was not found"));

        if (!isMember(chat, userId)) {
            throw new UserException("You are not a member of this chat");
        }

        chatRepository.delete(chat);
    }
}
