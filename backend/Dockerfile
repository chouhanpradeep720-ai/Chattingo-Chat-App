# Stage 1: Dependencies Stage
FROM maven:3.9-eclipse-temurin-21 as dependencies
WORKDIR /app
COPY pom.xml .
RUN mvn -q -e -B -DskipTests dependency:go-offline

# Stage 2: Build Stage
FROM maven:3.9-eclipse-temurin-21 as build
WORKDIR /app
COPY --from=dependencies /root/.m2 /root/.m2
COPY . .
RUN mvn -q -e -B -DskipTests package

# Stage 3: Runtime Stage
FROM eclipse-temurin:21-jre-alpine as runtime
WORKDIR /app
COPY --from=build /app/target/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]