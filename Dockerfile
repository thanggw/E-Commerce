# Stage 1: Build ứng dụng bằng Maven
FROM maven:3-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Chạy ứng dụng bằng OpenJDK
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/e-commerce-0.0.1-SNAPSHOT.war drcomputer.war
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "drcomputer.war"]

