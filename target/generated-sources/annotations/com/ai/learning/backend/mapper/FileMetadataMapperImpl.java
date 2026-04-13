package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.response.FileMetadataResponse;
import com.ai.learning.backend.entity.FileMetadata;
import com.ai.learning.backend.entity.LearningSession;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-13T08:45:06+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Oracle Corporation)"
)
@Component
public class FileMetadataMapperImpl implements FileMetadataMapper {

    @Override
    public FileMetadataResponse toResponse(FileMetadata fileMetadata) {
        if ( fileMetadata == null ) {
            return null;
        }

        FileMetadataResponse.FileMetadataResponseBuilder fileMetadataResponse = FileMetadataResponse.builder();

        fileMetadataResponse.learningSessionId( fileMetadataLearningSessionLearningSessionId( fileMetadata ) );
        fileMetadataResponse.fileMetadataId( fileMetadata.getFileMetadataId() );
        fileMetadataResponse.size( fileMetadata.getSize() );
        fileMetadataResponse.storageProvider( fileMetadata.getStorageProvider() );
        fileMetadataResponse.createdAt( fileMetadata.getCreatedAt() );

        fileMetadataResponse.ownerName( fileMetadata.getUser().getFirstName() + " " + fileMetadata.getUser().getLastName() );
        fileMetadataResponse.friendlySize( formatSize(fileMetadata.getSize()) );

        return fileMetadataResponse.build();
    }

    private Long fileMetadataLearningSessionLearningSessionId(FileMetadata fileMetadata) {
        if ( fileMetadata == null ) {
            return null;
        }
        LearningSession learningSession = fileMetadata.getLearningSession();
        if ( learningSession == null ) {
            return null;
        }
        Long learningSessionId = learningSession.getLearningSessionId();
        if ( learningSessionId == null ) {
            return null;
        }
        return learningSessionId;
    }
}
