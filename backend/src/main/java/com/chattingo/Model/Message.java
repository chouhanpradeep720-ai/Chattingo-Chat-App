package com.chattingo.Model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String content;

    private LocalDateTime timestamp;

    private String mediaUrl;

    private String mediaType;

    private String fileName;

    private Long fileSize;

    private boolean voiceMessage = false;

    private Integer voiceDuration;

    @ManyToOne
    @JsonIgnoreProperties({"messages"})
    private Chat chat;

    @ManyToOne
    @JsonIgnoreProperties({"password"})
    private User user;

    public Message() {
    }

    public Message(Integer id, String content, LocalDateTime timestamp, Chat chat, User user) {
        this.id = id;
        this.content = content;
        this.timestamp = timestamp;
        this.chat = chat;
        this.user = user;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public boolean isVoiceMessage() {
        return voiceMessage;
    }

    public void setVoiceMessage(boolean voiceMessage) {
        this.voiceMessage = voiceMessage;
    }

    public Integer getVoiceDuration() {
        return voiceDuration;
    }

    public void setVoiceDuration(Integer voiceDuration) {
        this.voiceDuration = voiceDuration;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Message{" +
                "id=" + id +
                ", content='" + content + '\'' +
                ", timestamp=" + timestamp +
                ", mediaType='" + mediaType + '\'' +
                ", fileName='" + fileName + '\'' +
                ", voiceMessage=" + voiceMessage +
                ", voiceDuration=" + voiceDuration +
                ", chatId=" + (chat != null ? chat.getId() : null) +
                ", userId=" + (user != null ? user.getId() : null) +
                '}';
    }
}
