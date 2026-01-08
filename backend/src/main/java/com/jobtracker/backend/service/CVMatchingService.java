package com.jobtracker.backend.service;

import com.jobtracker.backend.dto.CVMatchResult;
import com.jobtracker.backend.entity.Resume;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class CVMatchingService {

    /**
     * Calculate match score between CV and Job Description
     */
    public CVMatchResult calculateMatch(Resume resume, String jobDescription) {
        // Extract skills from JD
        List<String> jdSkills = extractSkillsFromText(jobDescription);

        // Get CV skills
        List<String> cvSkills = resume.getExtractedSkills() != null
                ? Arrays.asList(resume.getExtractedSkills().split(","))
                        .stream()
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList())
                : new ArrayList<>();

        // 1. Calculate skill overlap
        List<String> matchingSkills = cvSkills.stream()
                .filter(skill -> jdSkills.stream()
                        .anyMatch(jdSkill -> jdSkill.equalsIgnoreCase(skill)))
                .collect(Collectors.toList());

        List<String> missingSkills = jdSkills.stream()
                .filter(jdSkill -> cvSkills.stream()
                        .noneMatch(cvSkill -> cvSkill.equalsIgnoreCase(jdSkill)))
                .collect(Collectors.toList());

        int skillScore = jdSkills.isEmpty() ? 0
                : (int) ((matchingSkills.size() / (double) jdSkills.size()) * 100);

        // 2. Experience level match
        int jdYearsRequired = extractYearsRequired(jobDescription);
        int cvYearsTotal = extractYearsFromCV(resume.getParsedContent());
        int experienceScore = cvYearsTotal >= jdYearsRequired ? 100
                : (cvYearsTotal > 0 ? (int) ((cvYearsTotal / (double) jdYearsRequired) * 100) : 50);

        // 3. Keyword density
        int keywordScore = calculateKeywordDensity(resume.getParsedContent(), jdSkills);

        // Weighted average
        int finalScore = (int) (skillScore * 0.5 +
                experienceScore * 0.3 +
                keywordScore * 0.2);

        return CVMatchResult.builder()
                .resumeId(resume.getId().toString())
                .resumeName(resume.getVersionName() != null ? resume.getVersionName() : resume.getFileName())
                .matchScore(Math.min(finalScore, 100))
                .matchingSkills(matchingSkills)
                .missingSkills(missingSkills)
                .skillScore(skillScore)
                .experienceScore(experienceScore)
                .keywordScore(keywordScore)
                .build();
    }

    /**
     * Extract skills from job description text
     */
    private List<String> extractSkillsFromText(String text) {
        if (text == null || text.isEmpty()) {
            return new ArrayList<>();
        }

        // Expanded list of technical and soft skills
        String[] commonSkills = {
                // Languages
                "Java", "Python", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust", "PHP", "Ruby",
                "Swift", "Kotlin", "Scala", "R", "Dart", "Shell", "Bash", "HTML", "CSS", "SQL", "NoSQL",
                // Frontend
                "React", "Angular", "Vue", "Node.js", "Express", "Next.js", "Nuxt.js", "Svelte",
                "Redux", "MobX", "Tailwind", "Bootstrap", "Material UI", "Webpack", "Vite", "Babel",
                // Backend & Frameworks
                "Django", "Flask", "Spring", "Spring Boot", "Laravel", "Symfony", "ASP.NET", ".NET Core",
                "Hibernate", "JPA", "Sequelize", "Mongoose", "GraphQL", "REST", "gRPC",
                // Database
                "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra", "DynamoDB",
                "Oracle", "SQL Server", "MariaDB", "SQLite", "Firebase", "Supabase",
                // Cloud & DevOps
                "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins", "Git", "GitHub", "GitLab",
                "Bitbucket", "Terraform", "Ansible", "CircleCI", "TravisCI", "Heroku", "DigitalOcean",
                "Nginx", "Apache", "Linux", "Unix", "CI/CD", "Microservices", "Serverless",
                // AI/ML & Data
                "Machine Learning", "AI", "Deep Learning", "TensorFlow", "PyTorch", "Pandas", "NumPy",
                "Scikit-learn", "Keras", "OpenCV", "NLP", "Computer Vision", "Data Science", "Big Data",
                "Hadoop", "Spark", "Kafka", "Tableau", "Power BI",
                // Mobile
                "Android", "iOS", "React Native", "Flutter", "Ionic", "Xamarin",
                // Tools & Testing
                "Jira", "Confluence", "Trello", "Slack", "Postman", "Swagger", "Selenium", "Jest",
                "Mocha", "Chai", "Cypress", "JUnit", "TestNG",
                // Soft Skills & Methodologies
                "Agile", "Scrum", "Kanban", "Waterfall", "Leadership", "Communication", "Teamwork",
                "Problem Solving", "Critical Thinking", "Adaptability", "Time Management", "Mentoring"
        };

        List<String> foundSkills = new ArrayList<>();
        String lowerText = text.toLowerCase();

        for (String skill : commonSkills) {
            // Use word boundary for short skills to avoid false positives (e.g. "Go" in
            // "Google")
            if (skill.length() <= 3) {
                // Escape special regex chars if any (like C++, C#)
                String escapedSkill = Pattern.quote(skill.toLowerCase());
                // Handle special cases manually or use non-word boundary checks
                // For C++, C# we can just contains because they have symbols
                if (skill.equals("C++") || skill.equals("C#")) {
                    if (lowerText.contains(skill.toLowerCase()))
                        foundSkills.add(skill);
                } else {
                    // For Go, R, C, IT, etc. use Regex word boundary
                    if (Pattern.compile("\\b" + escapedSkill + "\\b").matcher(lowerText).find()) {
                        foundSkills.add(skill);
                    }
                }
            } else {
                if (lowerText.contains(skill.toLowerCase())) {
                    foundSkills.add(skill);
                }
            }
        }

        return foundSkills;
    }

    /**
     * Extract years of experience required from JD
     */
    private int extractYearsRequired(String jobDescription) {
        if (jobDescription == null)
            return 0;

        // Pattern: "3+ years", "5-7 years", "minimum 3 years"
        Pattern pattern = Pattern.compile("(\\d+)\\+?\\s*years?", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(jobDescription);

        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }

        return 2; // Default assumption
    }

    /**
     * Extract years of experience from CV content
     */
    private int extractYearsFromCV(String cvContent) {
        if (cvContent == null)
            return 0;

        // Simple heuristic: look for "X years" mentions
        Pattern pattern = Pattern.compile("(\\d+)\\+?\\s*years?", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(cvContent);

        int maxYears = 0;
        while (matcher.find()) {
            int years = Integer.parseInt(matcher.group(1));
            maxYears = Math.max(maxYears, years);
        }

        return maxYears;
    }

    /**
     * Calculate keyword density score
     */
    private int calculateKeywordDensity(String cvContent, List<String> keywords) {
        if (cvContent == null || cvContent.isEmpty() || keywords.isEmpty()) {
            return 0;
        }

        String lowerContent = cvContent.toLowerCase();
        int matchCount = 0;

        for (String keyword : keywords) {
            if (lowerContent.contains(keyword.toLowerCase())) {
                matchCount++;
            }
        }

        return (int) ((matchCount / (double) keywords.size()) * 100);
    }

    /**
     * Calculate match for multiple CVs
     */
    public List<CVMatchResult> calculateMatchForAllCVs(List<Resume> resumes, String jobDescription) {
        return resumes.stream()
                .filter(resume -> resume.getParsingStatus() == com.jobtracker.backend.enums.ParsingStatus.READY ||
                        resume.getParsingStatus() == com.jobtracker.backend.enums.ParsingStatus.NEEDS_REVIEW)
                .map(resume -> calculateMatch(resume, jobDescription))
                .sorted((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore())) // Sort by score desc
                .collect(Collectors.toList());
    }
}
