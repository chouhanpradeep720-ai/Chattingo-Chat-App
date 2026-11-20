package com.chattingo.Model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String chatName;

    private String chatImage;

    private boolean isGroup;

    @ManyToMany
    @JsonIgnoreProperties({"chats", "password"})
    private Set<User> admins = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties({"chats", "password"})
    private User createdBy;

    @ManyToMany
    @JsonIgnoreProperties({"chats", "password"})
    private Set<User> users = new HashSet<>();

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"chat", "user"})
    private List<Message> messages = new ArrayList<>();

    public Chat() {
    }

    public Chat(Integer id, String chatName, String chatImage, boolean isGroup,
                Set<User> admins, User createdBy, Set<User> users, List<Message> messages) {
        this.id = id;
        this.chatName = chatName;
        this.chatImage = chatImage;
        this.isGroup = isGroup;
        this.admins = admins;
        this.createdBy = createdBy;
        this.users = users;
        this.messages = messages;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getChatName() {
        return chatName;
    }

    public void setChatName(String chatName) {
        this.chatName = chatName;
    }

    public String getChatImage() {
        return chatImage;
    }

    public void setChatImage(String chatImage) {
        this.chatImage = chatImage;
    }

    public boolean isGroup() {
        return isGroup;
    }

    public void setGroup(boolean isGroup) {
        this.isGroup = isGroup;
    }

    public Set<User> getAdmins() {
        return admins;
    }

    public void setAdmins(Set<User> admins) {
        this.admins = admins;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    @Override
    public String toString() {
        return "Chat{" +
                "id=" + id +
                ", chatName='" + chatName + '\'' +
                ", chatImage='" + chatImage + '\'' +
                ", isGroup=" + isGroup +
                '}';
    }
}
