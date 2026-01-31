import { useState } from 'react';
import { Input, Button, Card } from './ui';

interface OpenAIConfigModalProps {
  onSave: (apiKey: string) => void;
  onClose: () => void;
}

export default function OpenAIConfigModal({ onSave, onClose }: OpenAIConfigModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Configure GitHub AI Models</h2>
              <p className="text-sm text-text-muted">Use your GitHub Copilot subscription</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-accent-soft border border-accent/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-text-secondary">
                  <p className="font-medium mb-1">How to get your GitHub Token (with Copilot access):</p>
                  <ol className="list-decimal list-inside space-y-1 text-text-muted">
                    <li>Visit <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">github.com/settings/tokens</a></li>
                    <li>Click "Generate new token" → "Generate new token (classic)"</li>
                    <li>Name: "AI Analysis" | Scopes: Select "copilot"</li>
                    <li>Click "Generate token" and copy it</li>
                    <li>Paste the token below (starts with "ghp_...")</li>
                  </ol>
                  <p className="mt-2 text-xs italic">✓ Your Copilot subscription includes access to GPT-4o</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <Input
                label="GitHub Personal Access Token"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="ghp_..."
                required
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-9 text-text-muted hover:text-text-secondary"
              >
                {showKey ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-text-secondary">
                  Your GitHub token will be stored locally in your browser. This uses your existing Copilot subscription at no additional cost.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={!apiKey.trim()}>
                Save GitHub Token
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
