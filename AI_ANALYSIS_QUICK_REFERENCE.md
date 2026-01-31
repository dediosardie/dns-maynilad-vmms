# AI-Driven Fuel Efficiency Analysis - Quick Reference

## Quick Setup (2 minutes)

1. **Get API Key**: Visit https://platform.openai.com/api-keys
2. **Copy Key**: Click "Create new secret key" and copy it
3. **Configure**: In Fuel Tracking, click "Efficiency Report" → Enter API key
4. **Analyze**: Click "Save API Key" to start AI analysis

## Usage Flow

```
Fuel Tracking Module
    ↓
Click "Efficiency Report" button
    ↓
[First time] → Enter OpenAI API key → Save
    ↓
AI analyzes data (5-15 seconds)
    ↓
View comprehensive report with insights
```

## Report Sections

| Section | Content |
|---------|---------|
| **Efficiency Score** | 0-100 rating with color badge |
| **Summary** | 2-3 sentence overview |
| **Key Insights** | 3+ data-driven observations |
| **Recommendations** | Actionable improvement steps |
| **Cost Trends** | Spending pattern analysis |
| **Anomalies** | Unusual patterns detected |

## API Key Storage Options

### Option 1: Environment Variable (Recommended for Production)
```env
# .env file
VITE_OPENAI_API_KEY=sk-proj-your-key-here
```

### Option 2: In-App Configuration (Quick Testing)
- Stored in browser localStorage
- Per-browser configuration
- Easy to change/update

## Costs Per Analysis

| Data Size | Avg Tokens | Estimated Cost |
|-----------|------------|----------------|
| Small (<50 txns) | ~1,500 | $0.02-0.03 |
| Medium (50-200 txns) | ~2,500 | $0.03-0.05 |
| Large (>200 txns) | ~3,500 | $0.05-0.08 |

## Keyboard Shortcuts

- **Esc**: Close report modal
- **Ctrl+P**: Print report (when viewing)

## Error Messages & Solutions

| Error | Quick Fix |
|-------|-----------|
| "API key not configured" | Enter API key in config modal |
| "Invalid API key" | Generate new key at platform.openai.com |
| "Rate limit exceeded" | Wait 1 minute, try again |
| "Network error" | Check internet connection |

## Best Practices

✅ **DO:**
- Run analysis weekly or monthly
- Review recommendations regularly
- Compare reports over time
- Act on anomalies immediately
- Print reports for records

❌ **DON'T:**
- Share your API key
- Run analysis excessively (costs add up)
- Ignore anomaly warnings
- Skip implementing recommendations

## Features at a Glance

🤖 **AI Model**: ChatGPT-4o (latest)
📊 **Analysis Type**: Fleet fuel efficiency
⚡ **Speed**: 5-15 seconds
🔒 **Security**: HTTPS + local storage
💰 **Cost**: ~$0.02-0.05 per report
📈 **Metrics**: Cost, efficiency, patterns, anomalies

## Component Files

- `openaiService.ts` - API integration
- `FuelEfficiencyReport.tsx` - Report display
- `OpenAIConfigModal.tsx` - API key configuration
- `FuelTrackingModule.tsx` - Main module (updated)

## Configuration Check

To verify your setup:
1. Open browser DevTools → Console
2. Run: `localStorage.getItem('openai_api_key')`
3. Should show your API key (or null if not set)

## Support Resources

- **OpenAI Docs**: https://platform.openai.com/docs
- **API Status**: https://status.openai.com
- **Setup Guide**: See AI_ANALYSIS_SETUP_GUIDE.md

---

**Version**: 1.0.0 | **Last Updated**: January 2026
