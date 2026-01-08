# Backend Setup Guide

## Environment Variables Configuration

This application uses environment variables to protect sensitive information. Follow these steps to set up your local environment.

### Step 1: Create .env file

Copy the `.env.example` file to create your own `.env` file:

```bash
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit the `.env` file and replace the placeholder values with your actual credentials:

```env
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/job_tracker
DB_USERNAME=postgres
DB_PASSWORD=your_actual_database_password

# Mail Configuration (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRATION=86400000

# Server Configuration
SERVER_PORT=8080
```

### Step 3: Gmail App Password Setup

To use Gmail for sending emails, you need to create an **App Password**:

1. Go to your Google Account settings
2. Navigate to **Security** → **2-Step Verification** (enable if not already enabled)
3. Scroll down to **App passwords**
4. Generate a new app password for "Mail"
5. Copy the generated password and use it as `MAIL_PASSWORD` in your `.env` file

**Note:** Remove all spaces from the app password (e.g., `wwlb jeqo fyzk dmfk` → `wwlbjeqofyzkdmfk`)

### Step 4: JWT Secret Generation

Generate a secure JWT secret key. You can use one of these methods:

**Method 1: Online Generator**
- Visit: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
- Select "256-bit" and "Hex" format
- Copy the generated key

**Method 2: Command Line (Linux/Mac)**
```bash
openssl rand -hex 32
```

**Method 3: PowerShell (Windows)**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

### Step 5: Run the Application

#### Option 1: Using Maven (Recommended for Development)

```bash
mvn spring-boot:run
```

#### Option 2: Using IDE (IntelliJ IDEA / Eclipse)

1. Make sure you have a plugin to load `.env` files:
   - **IntelliJ IDEA**: Install "EnvFile" plugin
   - **Eclipse**: Install "Spring Tools" plugin

2. Configure the run configuration to load environment variables from `.env`

3. Run the application

#### Option 3: Using JAR with Environment Variables

```bash
# Build the JAR
mvn clean package

# Run with environment variables
java -jar target/job-application-tracker-pro-0.0.1-SNAPSHOT.jar
```

### Step 6: Verify Configuration

Once the application starts, verify that:

1. Database connection is successful
2. Email service is configured (check logs)
3. JWT authentication is working

## Security Best Practices

⚠️ **IMPORTANT:**

- **NEVER** commit the `.env` file to version control
- **NEVER** share your `.env` file or credentials publicly
- Use different credentials for development, staging, and production
- Rotate your JWT secret and passwords regularly
- Use strong, unique passwords for each service

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database name, username, and password
- Ensure the database `job_tracker` exists

### Email Sending Issues
- Verify Gmail App Password is correct (no spaces)
- Ensure 2-Step Verification is enabled on your Google Account
- Check if "Less secure app access" is NOT required (use App Password instead)

### JWT Authentication Issues
- Ensure JWT_SECRET is set and is a strong, random string
- Verify JWT_EXPIRATION is a valid number (milliseconds)

## Production Deployment

For production deployment, set environment variables through your hosting platform:

- **Heroku**: Use Config Vars in Settings
- **AWS**: Use Systems Manager Parameter Store or Secrets Manager
- **Docker**: Use docker-compose.yml environment section or .env file
- **Kubernetes**: Use ConfigMaps and Secrets

Example for Docker:

```yaml
# docker-compose.yml
services:
  backend:
    image: job-tracker-backend
    environment:
      - DB_URL=${DB_URL}
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - MAIL_USERNAME=${MAIL_USERNAME}
      - MAIL_PASSWORD=${MAIL_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
```

## Support

If you encounter any issues, please check the application logs or create an issue in the repository.
