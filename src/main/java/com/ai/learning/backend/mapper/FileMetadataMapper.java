package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.FileMetadataResponse;
import com.ai.learning.backend.entity.FileMetadata;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)public interface FileMetadataMapper {
    @Mapping(target = "ownerName", expression = "java(fileMetadata.getUser().getFirstName() + \" \" + fileMetadata.getUser().getLastName())")
    @Mapping(target = "friendlySize", expression = "java(formatSize(fileMetadata.getSize()))")
    FileMetadataResponse toResponse(FileMetadata fileMetadata);

    default String formatSize(Long bytes) {
        if(bytes == null || bytes == 0)
            return "0B";

        String[] units = {"B","KB","MB","GB"};

        int unitIndex = (int) (Math.log(bytes) / Math.log(1024));

        double value = bytes/ Math.pow(1024, unitIndex);
        return String.format("%.2f %s",value,units[unitIndex]);
    }




}
