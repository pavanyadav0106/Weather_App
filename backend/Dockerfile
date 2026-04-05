# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the project, skipping tests to speed up the process
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/backend-1.0.0.jar app.jar

# Expose the application port
EXPOSE 5000

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
