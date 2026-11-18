package com.chattingo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${cors.allowed.origins:http://localhost:3000,http://localhost}")
    private String allowedOrigins;

    // Register WebSocket endpoint
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        String[] origins = allowedOrigins.split(",");

        registry.addEndpoint("/ws")
                .setAllowedOrigins(origins)
                .withSockJS();
    }

    // Configure message broker
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        // Destinations for messages sent from frontend to backend
        registry.setApplicationDestinationPrefixes("/app");

        // Destinations for messages broadcast to subscribed clients
        registry.enableSimpleBroker("/topic", "/group", "/user");

        // Prefix for user-specific destinations
        registry.setUserDestinationPrefix("/user");
    }
}
