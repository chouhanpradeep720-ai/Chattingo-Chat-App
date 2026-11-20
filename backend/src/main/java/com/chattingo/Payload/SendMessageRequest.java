package com.chattingo.Payload;

public class SendMessageRequest {

    private Integer userId;
    private Integer chatId;
    private String content;

    private String mediaUrl;
    private String mediaType;
    private String fileName;
    private Long fileSize;
    private boolean voiceMessage;

    private Integer voiceDuration;

    public SendMessageRequest() {
    }

    public SendMessageRequest(Integer userId, Integer chatId, String content) {
        this.userId = userId;
        this.chatId = chatId;
        this.content = content;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getChatId() {
        return chatId;
    }

    public void setChatId(Integer chatId) {
        this.chatId = chatId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
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

    @Override
    public String toString() {
        return "SendMessageRequest{" +
                "userId=" + userId +
                ", chatId=" + chatId +
                ", contentLength=" + (content != null ? content.length() : 0) +
                ", mediaType='" + mediaType + '\'' +
                ", fileName='" + fileName + '\'' +
                ", voiceMessage=" + voiceMessage +
                ", voiceDuration=" + voiceDuration +
                '}';
    }
}
