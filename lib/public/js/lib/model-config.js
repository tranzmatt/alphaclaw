import { h } from "https://esm.sh/preact";
import htm from "https://esm.sh/htm";

const html = htm.bind(h);

export const getModelProvider = (modelKey) => String(modelKey || "").split("/")[0] || "";

export const getAuthProviderFromModelProvider = (provider) =>
  provider === "openai-codex" ? "openai" : provider;

export const kFeaturedModelDefs = [
  {
    label: "Opus 4.6",
    preferredKeys: ["anthropic/claude-opus-4-6", "anthropic/claude-opus-4-5"],
  },
  {
    label: "Sonnet 4.6",
    preferredKeys: ["anthropic/claude-sonnet-4-6", "anthropic/claude-sonnet-4-5"],
  },
  {
    label: "Codex 5.3",
    preferredKeys: ["openai-codex/gpt-5.3-codex", "openai-codex/gpt-5.2-codex"],
  },
  {
    label: "Gemini 3",
    preferredKeys: ["google/gemini-3-pro-preview", "google/gemini-3-flash-preview"],
  },
];

export const getFeaturedModels = (allModels) => {
  const picked = [];
  const used = new Set();
  kFeaturedModelDefs.forEach((def) => {
    const found = def.preferredKeys
      .map((key) => allModels.find((model) => model.key === key))
      .find(Boolean);
    if (!found || used.has(found.key)) return;
    picked.push({ ...found, featuredLabel: def.label });
    used.add(found.key);
  });
  return picked;
};

export const kProviderAuthFields = {
  anthropic: [
    {
      key: "ANTHROPIC_API_KEY",
      label: "Anthropic API Key",
      hint: html`From${" "}
        <a
          href="https://console.anthropic.com"
          target="_blank"
          class="hover:underline"
          style="color: var(--accent-link)"
          >console.anthropic.com</a
        >${" "}— recommended`,
      placeholder: "sk-ant-...",
    },
    {
      key: "ANTHROPIC_TOKEN",
      label: "Anthropic Setup Token",
      hint: "From claude setup-token (uses your Claude subscription)",
      placeholder: "Token...",
    },
  ],
  openai: [
    {
      key: "OPENAI_API_KEY",
      label: "OpenAI API Key",
      hint: html`From${" "}
        <a
          href="https://platform.openai.com"
          target="_blank"
          class="hover:underline"
          style="color: var(--accent-link)"
          >platform.openai.com</a
        >`,
      placeholder: "sk-...",
    },
  ],
  google: [
    {
      key: "GEMINI_API_KEY",
      label: "Gemini API Key",
      hint: html`From${" "}
        <a
          href="https://aistudio.google.com"
          target="_blank"
          class="hover:underline"
          style="color: var(--accent-link)"
          >aistudio.google.com</a
        >`,
      placeholder: "AI...",
    },
  ],
};

export const kProviderLabels = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  google: "Gemini",
};

export const kProviderOrder = ["anthropic", "openai", "google"];

export const getVisibleAiFieldKeys = (provider) => {
  const authProvider = getAuthProviderFromModelProvider(provider);
  const fields = kProviderAuthFields[authProvider] || [];
  return new Set(fields.map((field) => field.key));
};

export const kAllAiAuthFields = Object.values(kProviderAuthFields)
  .flat()
  .filter((field, idx, arr) => arr.findIndex((item) => item.key === field.key) === idx);
