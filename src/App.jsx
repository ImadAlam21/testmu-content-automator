import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const TestMuAIPower = () => {
  const [apiKey, setApiKey] = useState('');
  const [input, setInput] = useState('');
  const [layout, setLayout] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  const generateContent = async () => {
    if (!apiKey || !input) return alert("Please provide both API Key and Content");
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      const prompt = `
Act as a TestMu developer. Convert the input into two blocks separated by "---BLOCK_SEPARATOR---".

### BLOCK 1: EXACT LAYOUT TEMPLATE
Generate the <Layout> tag following this EXACT structure:
<Layout
  head={[
    <>
      <title>{TITLE}</title>
      <link
        rel="canonical"
        href={\`\${baseUrl}/free-online-tools/{SLUG}/\`}
      />
      <meta name="description" content="{DESC}" />
      <meta name="keywords" content="{KEYWORDS}" />
      <meta property="og:title" content="{TITLE}" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={\`\${baseUrl}/free-online-tools/{SLUG}/\`} />
      <meta property="og:description" content="{DESC}" />
      <meta property="og:image" content={\`\${resourcesHost}/images/meta/{SLUG}-og.png\`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="{TITLE}" />
      <meta name="twitter:description" content="{DESC}" />
      <meta name="twitter:url" content={\`\${baseUrl}/free-online-tools/{SLUG}/\`} />
      <meta name="twitter:image" content={\`\${resourcesHost}/images/meta/{SLUG}-og.png\`} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org/",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: \`\${baseUrl}\` },
                { "@type": "ListItem", position: 2, name: \`\${BrandName} Tools\`, item: \`\${baseUrl}/free-online-tools/\` },
                { "@type": "ListItem", position: 3, name: "{PRIMARY_KEY}", item: \`\${baseUrl}/free-online-tools/{SLUG}/\` }
              ]
            }
          ])
        }}2
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [{FAQ_JSON_ARRAY}]
            }
          ])
        }}
      />
    </>
  ]}
>

---BLOCK_SEPARATOR---

### BLOCK 2: STRICT BODY STRUCTURE (NO DEVIATION ALLOWED)

1. Wrap ALL content inside EXACTLY:
<div className="mt-80">
  ...ALL SECTIONS...
</div>

2. EACH section MUST follow EXACT pattern:
<div className="pt-30">

  <Text size="h2" classes=" w-full text-size-26 font-bold ls-36 leading-height-32">
    Heading
  </Text>

  <Text size="para" className="text-size-16 text-black mt-10">
    Paragraph
  </Text>

</div>

3. DO NOT:
- Add/remove even a single word in the given data
- Change class names
- Change spacing
- Change structure
- Add extra wrappers

4. LIST RULES:
- Bullet list:
<ul className="list-disc ml-50 smtablet:ml-10 mt-20 text-size-16 leading-loose">
  <li className="text-size-16 text-black mt-10"><b>Label:</b> Content</li>
</ul>

- Number list:
<ul className="list-decimal ml-50 smtablet:ml-10 mt-20 text-size-16 leading-loose">
  <li className="text-size-16 text-black mt-10"><b>Label:</b> Content</li>
</ul>

5. TABLE FORMAT (MANDATORY WHEN NEEDED):
<center>
  <div className="hub_table mt-10">
    <table>
      <tr><th>...</th><th>...</th></tr>
      <tr><td>...</td><td>...</td></tr>
    </table>
  </div>
</center>

6. EXAMPLES / CODE BLOCK (STRICT FORMAT):
<div className="pt-30">
  <Text size="h2" className="text-size-26 text-black font-medium">
    Examples Heading
  </Text>

  <Text size="para" className="text-size-16 text-black mt-15">
    <b>Example 1:</b>
  </Text>

  <SyntaxHighlighter style={dracula} language="bash">{\`Input...
Output...\`}</SyntaxHighlighter>
</div>

7. FAQ SECTION MUST BE EXACTLY:
<div className="mt-40 w-full">
  <Text size="h2" classes="w-full text-size-26 font-bold ls-36 leading-height-32">
    Frequently Asked Questions (FAQs)
  </Text>

  <Text size="h3" className="text-size-24 font-semibold leading-snug ls-36 text-black mb-20 mt-20">
    Question?
  </Text>

  <Text size="para" classes="text-size-16 text-black mt-10">
    Answer
  </Text>
</div>

### IMPORTANT:
- Do not use markdown backticks
- Output ONLY JSX
- No explanations
- Maintain exact spacing + indentation
- Follow structure EXACTLY (pixel-perfect)

CONTENT TO PROCESS:
${input}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text.includes("---BLOCK_SEPARATOR---")) {
        const [layoutPart, bodyPart] = text.split("---BLOCK_SEPARATOR---");
        setLayout(layoutPart.trim().replace(/```jsx|```/g, ''));
        setBody(bodyPart.trim().replace(/```jsx|```/g, ''));
      } else {
        setBody(text.replace(/```jsx|```/g, ''));
      }
    } catch (error) {
      console.error("DETAILED ERROR:", error);
      alert(`AI Error: ${error.message}`);
    }
    setLoading(false);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] text-white px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight flex items-center justify-center gap-2">
            TestMu Formatter
          </h1>
          <p className="text-gray-400 mt-3 text-sm sm:text-base">
            Generate clean, structured TestMu style content.
          </p>
        </div>

        {/* Input */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">

          <div className="flex items-center justify-center gap-4">
            <input
              type="password"
              value={apiKey}
              placeholder="Enter Gemini API Key"
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button
              type="button"
              className="cursor-pointer flex items-center py-2 rounded-md px-3 border border-white/10 hover:border-white/50 gap-4 disabled:hover:border-white/10 transition disabled:cursor-not-allowed"
              onClick={() => setApiKey('')}
              title="Clear"
              disabled={!apiKey}
            >
              <span className="text-red-400">Clear</span>
            </button>
          </div>

          <div className=" relative flex justify-center gap-4">
            <textarea
            value={input}
              placeholder="Paste Google Doc Content Here..."
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 h-40 sm:h-52 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            {input && (
              <div claassName="absolute top-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                className=" cursor-pointer flex items-center py-2 rounded-md px-3 border border-white/10 hover:border-white/50 gap-4 disabled:hover:border-white/10 transition disabled:cursor-not-allowed"
                onClick={() => setInput('')}
              >
                <span className="text-red-400">Clear</span>
              </button>
              </div>
            )}
          </div>

          <button
            onClick={generateContent}
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {loading ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              "Generate code blocks"
            )}
          </button>
        </div>

        {/* Output */}
        {(layout || body) && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">

            <Block
              title="Layout Block"
              content={layout}
              onCopy={() => copyToClipboard(layout, 'layout')}
              copied={copied === 'layout'}
            />

            <Block
              title="Body Content"
              content={body}
              onCopy={() => copyToClipboard(body, 'body')}
              copied={copied === 'body'}
            />

          </div>
        )}
      </div>
    </div>
  );
};

const Block = ({ title, content, onCopy, copied }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col">

    <div className="flex justify-between items-center px-4 py-3 border-b border-white/10">
      <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
      <button
        onClick={onCopy}
        className="flex items-center gap-2 text-xs sm:text-sm bg-black/40 px-3 py-1.5 rounded-md hover:bg-black/60 transition"
      >
        {copied ? <span className="text-green-400">✔</span> : <span>📋</span>}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>

    <pre className="p-4 text-xs sm:text-sm text-indigo-300 overflow-x-auto whitespace-pre-wrap break-words flex-1">
      {content}
    </pre>
  </div>
);

export default TestMuAIPower;