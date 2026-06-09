# ==========================================
# STAGE 1: BUILD CODE
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache dependencies
COPY api-exam/pom.xml ./
RUN mvn dependency:go-offline -B

# Copy src và đóng gói file .jar
COPY api-exam/src ./src
RUN mvn package -DskipTests

# ==========================================
# STAGE 2: RUNTIME JRE
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Tạo user bảo mật không chạy bằng quyền root
RUN addgroup -S spring && adduser -S spring -G spring

# Tạo thư mục logs với quyền sở hữu của user spring
RUN mkdir -p /app/logs && chown -R spring:spring /app/logs

USER spring:spring

# Copy file .jar sang Stage 2
COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

# Copy thư mục database chứa seed.sql để khởi tạo CSDL H2
COPY --chown=spring:spring api-exam/database ./database

EXPOSE 8081

# Cấu hình tối ưu bộ nhớ JVM
ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:+ExitOnOutOfMemoryError", "-jar", "app.jar"]
