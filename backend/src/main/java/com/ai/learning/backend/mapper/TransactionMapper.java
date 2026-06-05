package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.TransactionResponse;
import com.ai.learning.backend.entity.CourseTransaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TransactionMapper {
    @Mapping(target = "courseTitle", source = "course.title")
    @Mapping(target = "amount", source = "amount")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "createdAt", source = "createdAt")
    TransactionResponse toTransactionResponse(CourseTransaction transaction);

    List<TransactionResponse> toTransactionResponseList(List<CourseTransaction> transactions);
}
