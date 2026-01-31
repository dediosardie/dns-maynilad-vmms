# GitHub AI Models - Quick Reference Card

## 🚀 Setup in 3 Steps

```
1. Generate Token
   github.com/settings/tokens
   ↓ "Generate new token (classic)"
   ↓ Name: "AI Analysis"
   ↓ Scope: ✅ copilot
   ↓ Copy token (ghp_...)

2. Configure App
   Fuel Tracking → "Efficiency Report"
   ↓ Enter GitHub token
   ↓ Save

3. Analyze
   Click "Efficiency Report"
   ↓ Wait 5-15 seconds
   ↓ View AI insights!
```

## ✅ Benefits vs OpenAI

| | GitHub AI | OpenAI |
|-|-----------|---------|
| Cost | FREE* | $0.02-0.05 |
| Model | GPT-4o | GPT-4o |
| Setup | 1 token | API key |
| Quota | Copilot | Pay-per-use |

*Requires active GitHub Copilot subscription

## 🔑 Token Configuration

### Environment Variable (.env):
```env
VITE_GITHUB_TOKEN=ghp_your_token_here
```

### In-App:
Stored in browser localStorage

## 🛠️ Quick Commands

```javascript
// Check token
localStorage.getItem('github_token')

// Clear token
localStorage.removeItem('github_token')

// Test connection
// (Use browser DevTools console)
```

## ⚠️ Troubleshooting

| Error | Fix |
|-------|-----|
| "Token not configured" | Generate and save token |
| "Invalid token" | Check copilot scope |
| "403 Forbidden" | Verify Copilot active |
| "Rate limited" | Wait, within quota |

## 📊 What You Get

✨ **AI Report Includes:**
- Efficiency Score (0-100)
- 3-5 Key Insights
- Actionable Recommendations
- Cost Trend Analysis
- Anomaly Detection

## 🔒 Security

- Token stored locally
- HTTPS encryption
- Copilot scope only
- No data storage
- Audit logged

## 📝 Token Scopes

**Required:**
- ✅ copilot

**Not Needed:**
- ❌ repo
- ❌ admin
- ❌ user

## 🆘 Support Links

- [Generate Token](https://github.com/settings/tokens)
- [Copilot Settings](https://github.com/settings/copilot)
- [Full Setup Guide](GITHUB_AI_SETUP.md)

## 💡 Pro Tips

1. **Set expiration**: 90 days recommended
2. **Minimal scopes**: Only "copilot" needed
3. **Environment var**: Best for production
4. **Rotate regularly**: Security best practice

## 🎯 Quick Test

```
1. Click "Efficiency Report"
2. If modal appears → Enter token
3. If analysis starts → Success!
4. Review 6-section report
```

## 📈 Cost Comparison

**Monthly Usage:**
- 4 reports: FREE vs $0.12
- 10 reports: FREE vs $0.30
- 50 reports: FREE vs $1.50

Savings with Copilot: 100%! 🎉

---

**Version**: 1.0.0 | **Updated**: Jan 2026
**Requires**: GitHub Copilot Subscription
