package com.jobtracker.backend.mapper;

import com.jobtracker.backend.dto.InterviewDTO;
import com.jobtracker.backend.entity.Interview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InterviewMapper {

    @Mapping(target = "applicationId", source = "application.id")
    InterviewDTO toDto(Interview entity);

    @Mapping(target = "application", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Interview toEntity(InterviewDTO dto);
}
