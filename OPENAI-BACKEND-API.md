# OpenAI Backend API Documentation

This document describes the backend API structure required for OpenAI GPT-4 integration in the Daily Tracker application.

## Overview

The frontend sends weekly tracking data to a secure backend endpoint, which processes the data and sends it to OpenAI's GPT-4 API for intelligent summary generation. The backend handles API key security, rate limiting, and response formatting.

## API Endpoint

### Generate Summary

**Endpoint**: `POST /api/ai/generate-summary`

**Description**: Generates an AI-powered summary of weekly tracking data using OpenAI GPT-4.

## Request Format

### Headers
```http
Content-Type: application/json
Authorization: Bearer <API_TOKEN>
```

### Request Body

```typescript
interface SummaryRequest {
  entries: DailySummaryData[];
  dateRange: {
    startDate: string;          // YYYY-MM-DD format
    endDate: string;            // YYYY-MM-DD format
  };
  totalDays: number;
  requestTimestamp: string;     // ISO 8601 timestamp
}

interface DailySummaryData {
  date: string;                 // YYYY-MM-DD format
  mood: number;                 // 1-10 scale
  energy: number;               // 1-10 scale
  productivity: number;         // 1-10 scale
  sleep: number;                // Hours (e.g., 7.5)
  exercise: boolean;
  notes: string;                // User's daily notes
  goals: {
    total: number;
    completed: number;
    completionRate: number;     // Percentage (0-100)
    completedGoals: string[];   // Array of completed goal titles
  };
  habits: {
    total: number;
    completed: number;
  };
}
```

### Example Request

```json
{
  "entries": [
    {
      "date": "2025-01-03",
      "mood": 7,
      "energy": 6,
      "productivity": 8,
      "sleep": 7.5,
      "exercise": true,
      "notes": "Great day! Finished important project milestone.",
      "goals": {
        "total": 3,
        "completed": 2,
        "completionRate": 67,
        "completedGoals": ["Exercise 30 min", "Complete project review"]
      },
      "habits": {
        "total": 2,
        "completed": 2
      }
    }
  ],
  "dateRange": {
    "startDate": "2025-01-01",
    "endDate": "2025-01-07"
  },
  "totalDays": 7,
  "requestTimestamp": "2025-01-09T18:26:09Z"
}
```

## Response Format

### Success Response

**Status**: `200 OK`

```typescript
interface SummaryResponse {
  summary: string;              // Main narrative summary
  insights: string[];           // Array of key insights
  recommendations: string[];    // Array of actionable recommendations
  generatedAt: string;          // ISO 8601 timestamp
  confidence: number;           // Confidence score (0.0-1.0)
}
```

### Example Success Response

```json
{
  "summary": "Over the past 7 days, your wellness journey shows strong emotional wellbeing with consistently positive mood ratings. You've maintained high energy levels throughout the week, complemented by strong productivity patterns. Your sleep average of 7.3 hours meets recommended guidelines. Your exercise consistency has been excellent, contributing positively to your overall wellness.",
  "insights": [
    "Your mood tends to be higher than your energy levels, suggesting good emotional resilience despite physical fatigue.",
    "Days with exercise correlate with better mood scores, highlighting the mental health benefits of physical activity.",
    "Your goal completion rate exceeds one per day, showing strong motivation and achievement-oriented behavior."
  ],
  "recommendations": [
    "Continue your excellent exercise routine as it positively impacts your mood and energy levels.",
    "Consider tracking what specific activities boost your productivity on high-performing days.",
    "Your consistent sleep schedule appears to be working well - maintain this pattern."
  ],
  "generatedAt": "2025-01-09T18:26:15Z",
  "confidence": 0.85
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid request format: missing required field 'entries'",
  "code": "INVALID_REQUEST"
}
```

#### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing API token",
  "code": "UNAUTHORIZED"
}
```

#### 429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 60 seconds.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Failed to generate summary",
  "code": "SUMMARY_GENERATION_FAILED"
}
```

#### 503 Service Unavailable
```json
{
  "error": "Service Unavailable",
  "message": "OpenAI API is temporarily unavailable",
  "code": "OPENAI_UNAVAILABLE",
  "retryAfter": 300
}
```

## Backend Implementation Guide

### Node.js/Express Example

```javascript
const express = require('express');
const OpenAI = require('openai');
const rateLimit = require('express-rate-limit');

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Rate limiting
const summaryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    error: "Too Many Requests",
    message: "Rate limit exceeded. Try again later.",
    code: "RATE_LIMIT_EXCEEDED"
  }
});

// Authentication middleware
const authenticateAPI = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token || token !== process.env.API_TOKEN) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or missing API token",
      code: "UNAUTHORIZED"
    });
  }
  
  next();
};

app.use(express.json());
app.use('/api/ai', summaryLimiter);

app.post('/api/ai/generate-summary', authenticateAPI, async (req, res) => {
  try {
    const { entries, dateRange, totalDays } = req.body;
    
    // Validate request
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid request format: missing or empty entries array",
        code: "INVALID_REQUEST"
      });
    }
    
    // Generate OpenAI prompt
    const prompt = generatePrompt(entries, dateRange, totalDays);
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a wellness and productivity coach analyzing personal tracking data. Provide insightful, actionable, and encouraging feedback based on the user's weekly data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });
    
    // Parse and format response
    const aiResponse = completion.choices[0].message.content;
    const formattedResponse = parseAIResponse(aiResponse);
    
    res.json({
      summary: formattedResponse.summary,
      insights: formattedResponse.insights,
      recommendations: formattedResponse.recommendations,
      generatedAt: new Date().toISOString(),
      confidence: 0.85 // Could be dynamic based on data quality
    });
    
  } catch (error) {
    console.error('Summary generation error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        error: "Service Unavailable",
        message: "AI service quota exceeded",
        code: "QUOTA_EXCEEDED"
      });
    }
    
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to generate summary",
      code: "SUMMARY_GENERATION_FAILED"
    });
  }
});

function generatePrompt(entries, dateRange, totalDays) {
  // Calculate statistics
  const avgMood = entries.reduce((sum, e) => sum + e.mood, 0) / entries.length;
  const avgEnergy = entries.reduce((sum, e) => sum + e.energy, 0) / entries.length;
  const avgProductivity = entries.reduce((sum, e) => sum + e.productivity, 0) / entries.length;
  const avgSleep = entries.reduce((sum, e) => sum + e.sleep, 0) / entries.length;
  const exerciseDays = entries.filter(e => e.exercise).length;
  const totalGoals = entries.reduce((sum, e) => sum + e.goals.total, 0);
  const completedGoals = entries.reduce((sum, e) => sum + e.goals.completed, 0);
  
  // Collect notes
  const notes = entries.filter(e => e.notes).map(e => `${e.date}: ${e.notes}`);
  
  return `
Analyze this weekly wellness tracking data from ${dateRange.startDate} to ${dateRange.endDate} (${totalDays} days):

DAILY METRICS AVERAGES:
- Mood: ${avgMood.toFixed(1)}/10
- Energy: ${avgEnergy.toFixed(1)}/10  
- Productivity: ${avgProductivity.toFixed(1)}/10
- Sleep: ${avgSleep.toFixed(1)} hours
- Exercise: ${exerciseDays}/${totalDays} days
- Goals: ${completedGoals}/${totalGoals} completed

USER NOTES:
${notes.length > 0 ? notes.join('\n') : 'No notes provided'}

DAILY DETAILS:
${entries.map(entry => `${entry.date}: Mood ${entry.mood}, Energy ${entry.energy}, Productivity ${entry.productivity}, Sleep ${entry.sleep}h, Exercise ${entry.exercise ? 'Yes' : 'No'}, Goals ${entry.goals.completed}/${entry.goals.total}`).join('\n')}

Please provide a comprehensive wellness summary with:
1. A narrative summary (2-3 paragraphs) highlighting patterns, achievements, and overall wellbeing
2. 3-5 key insights about patterns or correlations in the data
3. 3-5 actionable recommendations for improvement

Format your response as JSON with fields: summary, insights (array), recommendations (array).
`;
}

function parseAIResponse(aiResponse) {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(aiResponse);
    return parsed;
  } catch (error) {
    // If not JSON, parse manually
    return {
      summary: aiResponse.includes('Summary:') ? 
        aiResponse.split('Summary:')[1].split('Insights:')[0].trim() : 
        aiResponse,
      insights: [],
      recommendations: []
    };
  }
}

module.exports = app;
```

## OpenAI Prompt Engineering

### System Message
```
You are a wellness and productivity coach analyzing personal tracking data. Provide insightful, actionable, and encouraging feedback based on the user's weekly data. Focus on:

1. Identifying patterns and correlations in the data
2. Highlighting achievements and positive trends
3. Providing specific, actionable recommendations
4. Maintaining an encouraging and supportive tone
5. Respecting privacy and focusing only on the provided data

Respond in JSON format with: summary (string), insights (array), recommendations (array).
```

### Data Processing Best Practices

1. **Data Sanitization**: Remove or anonymize any sensitive information
2. **Statistical Analysis**: Calculate meaningful averages and trends
3. **Pattern Recognition**: Look for correlations between different metrics
4. **Contextual Understanding**: Consider the user's notes for additional context

## Security Considerations

### API Key Management
- Store OpenAI API keys in environment variables
- Use separate keys for development and production
- Implement key rotation policies

### Data Privacy
- Never log or store user data permanently
- Process data in memory only
- Implement data retention policies

### Rate Limiting
- Implement per-user rate limiting
- Set reasonable quotas to prevent abuse
- Provide clear error messages for rate limit violations

### Request Validation
- Validate all input data types and ranges
- Sanitize user-provided notes and text
- Implement request size limits

## Monitoring and Logging

### Metrics to Track
- API response times
- Success/failure rates
- OpenAI token usage
- User request patterns

### Error Monitoring
- Log all API errors with context
- Monitor OpenAI service status
- Track quota usage and limits

### Performance Optimization
- Cache common responses where appropriate
- Implement request batching for multiple summaries
- Use connection pooling for database operations

## Environment Variables

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_ORGANIZATION=org-your-org-id

# API Configuration
API_TOKEN=your-secure-api-token
PORT=3001
NODE_ENV=production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=10

# Logging
LOG_LEVEL=info
```

## Deployment Considerations

### Scaling
- Use load balancers for multiple backend instances
- Implement horizontal scaling based on request volume
- Consider serverless deployment for cost efficiency

### Reliability
- Implement circuit breakers for OpenAI API calls
- Use retry logic with exponential backoff
- Set up health check endpoints

### Cost Management
- Monitor OpenAI token usage
- Implement user quotas if necessary
- Consider caching strategies for similar requests

This backend implementation provides a secure, scalable foundation for integrating OpenAI GPT-4 summary generation into the Daily Tracker application while maintaining data privacy and system reliability.
