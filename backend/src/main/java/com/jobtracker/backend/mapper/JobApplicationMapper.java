package com.jobtracker.backend.mapper;

import com.jobtracker.backend.dto.JobApplicationDTO;
import com.jobtracker.backend.entity.JobApplication;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JobApplicationMapper {

    JobApplicationDTO toDto(JobApplication entity);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "interviews", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    JobApplication toEntity(JobApplicationDTO dto);
}
