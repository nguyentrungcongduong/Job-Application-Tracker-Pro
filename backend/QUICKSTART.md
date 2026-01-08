# Quick Start - Create Your .env File

## Step 1: Copy the template
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

## Step 2: Edit .env with your actual values

Open `.env` and replace with these values:

```env
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/job_tracker
DB_USERNAME=postgres
DB_PASSWORD=123456

# Mail Configuration (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=congduongnguyentrung@gmail.com
MAIL_PASSWORD=wwlbjeqofyzkdmfk

# JWT Configuration
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000

# Server Configuration
SERVER_PORT=8080
```

**Note:** I've removed spaces from your Gmail app password (wwlb jeqo fyzk dmfk → wwlbjeqofyzkdmfk)

## Step 3: Run the application

```bash
mvn spring-boot:run
```

## ⚠️ Security Reminder

The `.env` file is already in `.gitignore`, so it won't be pushed to GitHub. 
Your sensitive credentials are now safe! 🔒
