package com.jobtracker.backend.config;

import com.jobtracker.backend.mapper.JobApplicationMapper;
import com.jobtracker.backend.mapper.InterviewMapper;
import org.mapstruct.factory.Mappers;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    @Bean
    public JobApplicationMapper jobApplicationMapper() {
        return Mappers.getMapper(JobApplicationMapper.class);
    }

    @Bean
    public InterviewMapper interviewMapper() {
        return Mappers.getMapper(InterviewMapper.class);
    }
}
