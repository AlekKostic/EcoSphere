FROM openjdk:17-jdk-slim

WORKDIR /Backend

COPY Backend/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]