package com.jobtracker.backend.mapper;

import com.jobtracker.backend.dto.JobApplicationDTO;
import com.jobtracker.backend.entity.JobApplication;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "default")
public interface JobApplicationMapper {
    JobApplicationMapper INSTANCE = Mappers.getMapper(JobApplicationMapper.class);

    JobApplicationDTO toDto(JobApplication entity);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "resume", ignore = true)
    @Mapping(target = "interviews", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    JobApplication toEntity(JobApplicationDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "resume", ignore = true)
    @Mapping(target = "interviews", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(JobApplicationDTO dto, @MappingTarget JobApplication entity);
}
