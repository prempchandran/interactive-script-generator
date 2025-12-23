import React, { useState } from 'react';
import './App.css';

const GENRES = [
  'Horror', 'Comedy', 'Teen Romance', 'Thriller', 'Drama',
  'Science Fiction', 'Mystery', 'Action/Adventure', 'Fantasy',
  'Documentary-Style', 'Musical', 'Noir', 'Satire', 'Coming-of-Age'
];

const SYSTEM_PROMPT = `You are a master narrative adapter—a creative professional who combines the analytical precision of a film script analyst with the imaginative flair of a screenwriter. Your expertise lies in distilling the essence of any content into compelling visual stories suitable for both storyboarding and short film production.

Your core mission: Transform web content into genre-adapted narratives that are visually rich, emotionally resonant, and production-ready.

When analyzing content:
1. IDENTIFY the content type (news article, song lyrics, blog post, opinion piece, etc.)
2. EXTRACT the narrative core—the essential story elements, themes, conflicts, and emotional beats
3. TRANSFORM this content into a compelling narrative adapted to the selected genre
4. GENERATE four distinct outputs

Extract these story elements:
- PROTAGONIST: Who or what is the central focus?
- CONFLICT: What tension, struggle, or challenge exists?
- STAKES: What hangs in the balance?
- EMOTIONAL ARC: What emotional journey is present?
- SETTING POSSIBILITIES: What environments could visualize this story?
- THEMATIC CORE: What deeper meaning or message emerges?

Genre adaptation guidelines:
HORROR: Amplify tension, add dread, create atmosphere of unease
COMEDY: Find absurdity, timing opportunities, character quirks
TEEN ROMANCE: Focus on emotional intensity, first experiences
THRILLER: Build suspense, create stakes, add urgency
DRAMA: Deepen character psychology, explore moral complexity
SCI-FI: Extrapolate concepts to future implications
MYSTERY: Embed clues, create intrigue
ACTION: Externalize conflict into physical stakes

Generate outputs in this format:

## SYNOPSIS
[2-3 paragraph synopsis capturing the adapted story's essence. Include: premise, protagonist, central conflict, and emotional hook. Keep under 200 words.]

## COMIC PANEL STORYBOARD
Create a 6-8 panel visual storyboard:
**PANEL [N]:**
- VISUAL: [Detailed description of composition, characters, expressions, environment, lighting]
- CAPTION/DIALOGUE: [Text that appears in panel]
- TRANSITION NOTE: [How this panel flows to the next]

## SHORT FILM SCRIPT
Format as a proper screenplay (2-3 pages max, approximately 2-3 minute runtime):

FADE IN:
INT./EXT. [LOCATION] - [TIME OF DAY]
[Scene description in present tense]
CHARACTER NAME
(parenthetical)
Dialogue here.

## PRODUCTION NOTES
- Key visual motifs
- Tone guidance
- Music/sound design suggestions
- Adaptation choices explained`;

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [url, setUrl] = useState('');
  const [genre, setGenre] = useState('');
  const [extractedContent, setExtractedContent] = useState(null);
  const [generatedScript, setGeneratedScript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('synopsis');
  const [showApiHelp, setShowApiHelp] = useState(false);

  const extractContent = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your Anthropic API key');
      return;
    }
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setExtracting(true);
    setError('');
    setExtractedContent(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          tools: [{
            type: 'web_search_20250305',
            name: 'web_search'
          }],
          messages: [{
            role: 'user',
            content: `Please fetch and analyze the content from this URL: ${url}

Provide a brief summary (2-3 paragraphs) of what this content is about. Include:
1. **Content Type**: What kind of content is this? (news article, blog post, lyrics, essay, etc.)
2. **Main Subject**: What is the primary topic or story?
3. **Key Themes**: What are the main themes, emotions, or messages?
4. **Narrative Potential**: What story elements could be extracted for adaptation?

Keep your response concise but informative so the user can decide if they want to proceed with script generation.`
          }]
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'API request failed');
      }

      const data = await response.json();
      const textContent = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n');

      setExtractedContent(textContent);
    } catch (err) {
      setError(err.message || 'Failed to extract content');
    } finally {
      setExtracting(false);
    }
  };

  const generateScript = async () => {
    if (!genre) {
      setError('Please select a genre');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedScript(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 8000,
          system: SYSTEM_PROMPT,
          tools: [{
            type: 'web_search_20250305',
            name: 'web_search'
          }],
          messages: [{
            role: 'user',
            content: `Transform the content from this URL into a ${genre} narrative:

URL: ${url}

Previously extracted summary:
${extractedContent}

Please generate the complete adaptation with all four outputs:
1. Synopsis
2. Comic Panel Storyboard (6-8 panels)
3. Short Film Script
4. Production Notes

Adapt the content authentically to the ${genre} genre while maintaining the core themes and emotional truth of the source material.`
          }]
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'API request failed');
      }

      const data = await response.json();
      const textContent = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n');

      setGeneratedScript(textContent);
      setActiveTab('synopsis');
    } catch (err) {
      setError(err.message || 'Failed to generate script');
    } finally {
      setLoading(false);
    }
  };

  const parseGeneratedContent = (content) => {
    if (!content) return {};

    const sections = {
      synopsis: '',
      storyboard: '',
      script: '',
      notes: ''
    };

    const synopsisMatch = content.match(/##\s*SYNOPSIS([\s\S]*?)(?=##\s*COMIC|$)/i);
    const storyboardMatch = content.match(/##\s*COMIC PANEL STORYBOARD([\s\S]*?)(?=##\s*SHORT FILM|$)/i);
    const scriptMatch = content.match(/##\s*SHORT FILM SCRIPT([\s\S]*?)(?=##\s*PRODUCTION|$)/i);
    const notesMatch = content.match(/##\s*PRODUCTION NOTES([\s\S]*?)$/i);

    if (synopsisMatch) sections.synopsis = synopsisMatch[1].trim();
    if (storyboardMatch) sections.storyboard = storyboardMatch[1].trim();
    if (scriptMatch) sections.script = scriptMatch[1].trim();
    if (notesMatch) sections.notes = notesMatch[1].trim();

    return sections;
  };

  const parsedContent = parseGeneratedContent(generatedScript);

  const resetAll = () => {
    setUrl('');
    setGenre('');
    setExtractedContent(null);
    setGeneratedScript(null);
    setError('');
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>Interactive Script Generator</h1>
          <p className="subtitle">Transform web content into comics and short film scripts</p>
          <p className="credit">Created by Prem Chandran</p>
        </header>

        {/* Instructions */}
        <section className="card instructions">
          <h2>How to Use</h2>
          <ol>
            <li><strong>Enter your API key</strong> — Required to access Claude AI</li>
            <li><strong>Paste a URL</strong> — Any article, blog post, or web content</li>
            <li><strong>Extract & preview</strong> — Review the content summary</li>
            <li><strong>Choose a genre</strong> — Select from 14 adaptation styles</li>
            <li><strong>Generate</strong> — Get synopsis, storyboard, script & notes</li>
          </ol>
        </section>

        {/* API Key Section */}
        <section className="card">
          <div className="field">
            <label htmlFor="apiKey">
              Anthropic API Key
              <span className="required">*</span>
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="input"
            />
            <div className="field-help">
              <button
                type="button"
                className="link-button"
                onClick={() => setShowApiHelp(!showApiHelp)}
              >
                {showApiHelp ? 'Hide help' : 'Where do I get an API key?'}
              </button>
            </div>
            {showApiHelp && (
              <div className="help-box">
                <p>To get your Anthropic API key:</p>
                <ol>
                  <li>Go to <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">console.anthropic.com</a></li>
                  <li>Sign up or log in to your account</li>
                  <li>Navigate to <strong>API Keys</strong> in the sidebar</li>
                  <li>Click <strong>Create Key</strong> and copy it</li>
                </ol>
                <p className="help-note">Your key is used only in this session and never stored.</p>
              </div>
            )}
          </div>
        </section>

        {/* URL Input Section */}
        <section className="card">
          <div className="field">
            <label htmlFor="url">Source URL</label>
            <div className="input-group">
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="input"
              />
              <button
                onClick={extractContent}
                disabled={extracting || !apiKey || !url}
                className="btn btn-primary"
              >
                {extracting ? 'Extracting...' : 'Extract'}
              </button>
            </div>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="error-box">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}

        {/* Extracted Content Preview */}
        {extractedContent && (
          <section className="card">
            <div className="card-header success">
              <span className="status-icon">✓</span>
              <span>Content Extracted</span>
            </div>
            <div className="preview-content">
              {extractedContent}
            </div>
          </section>
        )}

        {/* Genre Selection & Generate */}
        {extractedContent && (
          <section className="card">
            <div className="field">
              <label htmlFor="genre">Select Genre</label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="select"
              >
                <option value="">Choose a genre...</option>
                {GENRES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="button-group">
              <button onClick={resetAll} className="btn btn-secondary">
                Reset
              </button>
              <button
                onClick={generateScript}
                disabled={loading || !genre}
                className="btn btn-primary"
              >
                {loading ? 'Generating...' : 'Generate Script'}
              </button>
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <section className="card loading-card">
            <div className="loading-spinner"></div>
            <p>Crafting your {genre} narrative...</p>
            <p className="loading-note">This may take a minute</p>
          </section>
        )}

        {/* Generated Output */}
        {generatedScript && (
          <section className="card output-card">
            <div className="tabs">
              {[
                { id: 'synopsis', label: 'Synopsis' },
                { id: 'storyboard', label: 'Storyboard' },
                { id: 'script', label: 'Script' },
                { id: 'notes', label: 'Notes' },
                { id: 'full', label: 'Full' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={`output-content ${activeTab === 'script' ? 'monospace' : ''}`}>
              {activeTab === 'full'
                ? generatedScript
                : parsedContent[activeTab] || 'Section not found.'}
            </div>

            <div className="output-footer">
              <span>Genre: {genre}</span>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="footer">
          <p>Powered by Claude AI</p>
        </footer>
      </div>
    </div>
  );
}
