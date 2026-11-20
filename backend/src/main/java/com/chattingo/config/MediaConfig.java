package com.chattingo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class MediaConfig implements WebMvcConfigurer {

    @Value("${chattingo.media.upload-dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        File directory = new File(uploadDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String absolutePath = directory.getAbsolutePath();

        if (!absolutePath.endsWith(File.separator)) {
            absolutePath += File.separator;
        }

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + absolutePath);
    }
}
