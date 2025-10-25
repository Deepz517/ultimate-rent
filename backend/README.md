# RentRoll Backend

This is the backend for the RentRoll application, built with Java and Spring Boot.

## Configuration

### Environment Variables

To run the application, you must configure the following environment variables:

-   `JWT_SECRET`: This is a critical, required variable that sets the secret key for signing and verifying JSON Web Tokens (JWTs). It must be a long, random, and securely stored string.

    **Example (for local development only):**
    ```bash
    export JWT_SECRET=your-super-secret-and-long-random-key
    ```

-   `DB_URL`: The full JDBC URL for the PostgreSQL database.
-   `DB_USERNAME`: The username for the database connection.
-   `DB_PASSWORD`: The password for the database connection.

### Application Properties

The `application.properties` file is configured to read these environment variables. No manual changes should be needed if the environment is set up correctly.

## Running the Application

Once the environment is configured, you can run the application using the following Maven command from the `backend` directory:

```bash
mvn spring-boot:run
```
