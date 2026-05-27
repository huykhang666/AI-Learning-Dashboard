# ==========================================
# STAGE 1: BUILD CODE
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy src và đóng gói file .jar
COPY src ./src
RUN mvn package -DskipTests

# ==========================================
# STAGE 2: RUNTIME JRE
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Tạo user bảo mật không chạy bằng quyền root
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Bốc duy nhất sản phẩm .jar sang Stage 2
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Cấu hình tối ưu bộ nhớ JVM và dọn rác tự động khi chạy trên VPS
ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:+ExitOnOutOfMemoryError", "-jar", "app.jar"]