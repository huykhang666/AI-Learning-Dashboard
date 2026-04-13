package com.ai.learning.backend.mapper;

import com.ai.learning.backend.dto.request.RegisterRequest;
import com.ai.learning.backend.dto.request.UpdateUserRequest;
import com.ai.learning.backend.dto.response.UserResponse;
import com.ai.learning.backend.entity.User;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeConstants;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-13T08:45:05+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.10 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    private final DatatypeFactory datatypeFactory;

    public UserMapperImpl() {
        try {
            datatypeFactory = DatatypeFactory.newInstance();
        }
        catch ( DatatypeConfigurationException ex ) {
            throw new RuntimeException( ex );
        }
    }

    @Override
    public User toUser(RegisterRequest request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.username( request.getUsername() );
        user.email( request.getEmail() );
        user.password( request.getPassword() );
        user.firstName( request.getFirstName() );
        user.lastName( request.getLastName() );
        user.dateOfBirth( request.getDateOfBirth() );

        return user.build();
    }

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.firstname( user.getFirstName() );
        userResponse.lastname( user.getLastName() );
        userResponse.dateOfBirth( user.getDateOfBirth() );
        userResponse.userId( user.getUserId() );
        userResponse.username( user.getUsername() );
        userResponse.email( user.getEmail() );
        Set<String> set = user.getRoles();
        if ( set != null ) {
            userResponse.roles( new LinkedHashSet<String>( set ) );
        }

        return userResponse.build();
    }

    @Override
    public void updateUser(User user, UpdateUserRequest request) {
        if ( request == null ) {
            return;
        }

        user.setFirstName( request.getFirstname() );
        user.setLastName( request.getLastname() );
        user.setDateOfBirth( xmlGregorianCalendarToLocalDate( localDateTimeToXmlGregorianCalendar( request.getDateOfBirth() ) ) );
    }

    private XMLGregorianCalendar localDateTimeToXmlGregorianCalendar( LocalDateTime localDateTime ) {
        if ( localDateTime == null ) {
            return null;
        }

        return datatypeFactory.newXMLGregorianCalendar(
            localDateTime.getYear(),
            localDateTime.getMonthValue(),
            localDateTime.getDayOfMonth(),
            localDateTime.getHour(),
            localDateTime.getMinute(),
            localDateTime.getSecond(),
            localDateTime.get( ChronoField.MILLI_OF_SECOND ),
            DatatypeConstants.FIELD_UNDEFINED );
    }

    private static LocalDate xmlGregorianCalendarToLocalDate( XMLGregorianCalendar xcal ) {
        if ( xcal == null ) {
            return null;
        }

        return LocalDate.of( xcal.getYear(), xcal.getMonth(), xcal.getDay() );
    }
}
