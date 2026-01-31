# GitHub AI Models Setup Guide - Using Your Copilot Subscription

## Quick Setup (3 minutes)

Your GitHub Copilot subscription includes access to GPT-4o through GitHub AI Models! Here's how to set it up:

### Step 1: Generate GitHub Token

1. Go to [GitHub Token Settings](https://github.com/settings/tokens)
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Configure the token:
   - **Name**: `AI Analysis`
   - **Expiration**: Choose your preference (recommend 90 days)
   - **Scopes**: Check ✅ `copilot`
4. Click **"Generate token"**
5. **Copy the token** (starts with `ghp_...`) - you won't see it again!

### Step 2: Configure in Application

**Option A: Environment Variable (Recommended)**
```env
# .env file
VITE_GITHUB_TOKEN=ghp_your_token_here
```

**Option B: In-App Configuration**
1. Open Fuel Tracking Module
2. Click "Efficiency Report" button
3. Enter your GitHub token in the modal
4. Click "Save GitHub Token"

### Step 3: Run Analysis

1. Click "Efficiency Report" button
2. Wait 5-15 seconds for AI analysis
3. Review comprehensive insights!

## Why GitHub AI Models?

✅ **Included with Copilot** - No additional costs!
✅ **Same GPT-4o Model** - Enterprise-grade AI
✅ **Secure** - GitHub enterprise security
✅ **Simple Setup** - One token, unlimited analyses
✅ **No API Limits** - Use your Copilot quota

## Comparison

| Feature | GitHub AI Models | OpenAI Direct |
|---------|-----------------|---------------|
| **Cost** | Free with Copilot | $0.02-0.05 per analysis |
| **Model** | GPT-4o | GPT-4o |
| **Setup** | GitHub token | Separate API key |
| **Billing** | Copilot subscription | Pay-per-use |
| **Rate Limits** | Copilot quota | OpenAI limits |

## Token Security

### Best Practices:
- ✅ Set expiration dates on tokens
- ✅ Use minimal scopes (only "copilot")
- ✅ Revoke unused tokens
- ✅ Never commit tokens to git
- ✅ Store in environment variables

### Token Storage:
- **Environment Variable**: Stored in `.env` (not committed)
- **LocalStorage**: Stored in browser (per-device)
- **Both are secure**: Choose based on your workflow

## Troubleshooting

### "GitHub token is not configured"
**Solution**: Follow Step 2 above

### "Invalid token" or "401 Unauthorized"
**Solutions**:
1. Verify token has "copilot" scope
2. Check token hasn't expired
3. Ensure you have active Copilot subscription
4. Generate a new token if needed

### "403 Forbidden" or "Rate limited"
**Solution**: You've reached Copilot usage limits. Wait a bit or upgrade your plan.

### "Model not available"
**Solution**: Ensure your Copilot subscription is active at github.com/settings/copilot

## Verify Copilot Subscription

Check your subscription status:
1. Visit [GitHub Copilot Settings](https://github.com/settings/copilot)
2. Verify status shows "Active"
3. Check AI model access is enabled

## API Endpoint Details

**Endpoint**: `https://models.inference.ai.azure.com/chat/completions`
**Model**: `gpt-4o`
**Authentication**: Bearer token (GitHub PAT with copilot scope)

## Token Scopes Explained

When creating your token, you only need:
- ✅ **copilot** - Access to GitHub AI Models

You don't need:
- ❌ repo
- ❌ admin
- ❌ user
- ❌ workflow

## Managing Tokens

### View Your Tokens
Visit: https://github.com/settings/tokens

### Revoke a Token
1. Go to token settings
2. Click "Delete" next to the token
3. Confirm deletion

### Rotate Tokens
Generate new token → Update configuration → Delete old token

## Cost Breakdown

With your Copilot subscription:
- ✅ AI analysis: **FREE**
- ✅ Unlimited reports (within quota)
- ✅ No per-request charges
- ✅ Enterprise support

## Support

### GitHub AI Models Documentation
- [GitHub Models Overview](https://docs.github.com/en/copilot)
- [API Reference](https://github.com/features/copilot)

### Token Help
- [Personal Access Tokens Guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

### Copilot Support
- [Copilot Subscription Help](https://github.com/settings/billing/summary)

## Quick Commands

### Check token is set (DevTools Console):
```javascript
localStorage.getItem('github_token')
```

### Clear token:
```javascript
localStorage.removeItem('github_token')
```

### Test API access:
```javascript
fetch('https://models.inference.ai.azure.com/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [{role: 'user', content: 'test'}]
  })
}).then(r => r.json()).then(console.log)
```

## Migration from OpenAI

If you were using OpenAI previously:

1. **No data migration needed** - Same analysis format
2. **Token configuration** - Just update your credentials
3. **Same features** - All functionality preserved
4. **Better cost** - Free with Copilot!

### Steps:
1. Generate GitHub token (Step 1 above)
2. Update `.env`: Replace `VITE_OPENAI_API_KEY` with `VITE_GITHUB_TOKEN`
3. Clear old OpenAI key: `localStorage.removeItem('openai_api_key')`
4. Test: Click "Efficiency Report"

## FAQ

**Q: Do I need a paid Copilot subscription?**
A: Yes, GitHub Copilot Individual ($10/mo) or Business subscription required.

**Q: Is this the same GPT-4o as OpenAI?**
A: Yes! Same model, provided through GitHub's AI Models service.

**Q: Are there usage limits?**
A: Yes, based on your Copilot subscription tier. Limits are generous.

**Q: Can I use both OpenAI and GitHub?**
A: The app is configured for one service. GitHub is recommended with Copilot.

**Q: Is my data secure?**
A: Yes, GitHub AI Models follows enterprise security standards.

**Q: Can I share my token with team members?**
A: No, each user should generate their own token.

---

**Setup Time**: 3 minutes
**Cost**: FREE (with Copilot subscription)
**Status**: ✅ Production Ready
**Updated**: January 2026
