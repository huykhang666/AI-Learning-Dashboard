CREATE TABLE password_reset_token (
                                      id BIGSERIAL PRIMARY KEY,
                                      token VARCHAR(255),
                                      email VARCHAR(255),
                                      expiry_date TIMESTAMP,
                                      used BOOLEAN DEFAULT FALSE
);
