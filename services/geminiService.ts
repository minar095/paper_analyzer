import { GoogleGenAI } from "@google/genai";

interface ImagePart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzePapers = async (imageParts: ImagePart[]): Promise<string> => {
  // FIX: Use a more powerful model for complex analysis.
  const model = 'gemini-2.5-pro';

  const textPrompt = `
You are an expert academic researcher and reviewer specializing in EEG signal processing, neuroscience, and deep learning. Your task is to conduct a rigorous and comprehensive analysis of the research papers provided as images.

**Instructions:**

Please structure your response in clear, well-formatted markdown with the following sections:

**1. Comprehensive Comparison of Papers**
Create a detailed markdown table that compares the core aspects of each paper. The table should include these columns:
- **Paper Title & Authors**: The full title and primary authors.
- **Core Methodology**: The main techniques, algorithms, or models used (e.g., CNN-LSTM, Variational Autoencoder, ESBN).
- **Stated Accuracy / Key Results**: Quantitative results, accuracy metrics, or significant findings reported in the abstract or introduction.
- **Key Contribution / Novelty**: The unique contribution or novel aspect the paper claims to introduce.

**2. Research Field Viability Analysis**
Based on the collective evidence from these papers, provide a scholarly analysis of the current state of this research field (EEG source localization, epilepsy detection, etc.). Address the following:
- Is this a mature or still-developing field?
- What are the major recurring challenges mentioned or implied in the papers?
- Is this a promising area for new researchers to make significant contributions? Justify your answer.

**3. Strategic Path to a Q1 Publication**
Identify potential research gaps and propose novel directions that could realistically lead to a publication in a Q1 journal. Be specific. Suggest things like:
- Unexplored hybrid models.
- Application of novel architectures from other domains (e.g., Transformers, Graph Neural Networks) to EEG problems.
- Novel datasets or evaluation paradigms.
- Addressing limitations of the presented papers.

**4. Novel Model Proposal for Societal Impact**
Propose a new, innovative model or framework that could significantly advance the field and have a tangible societal benefit (e.g., making EEG-based diagnosis more accessible, affordable, or accurate in clinical settings). Describe:
- **Model Name/Concept**: Give it a catchy, descriptive name.
- **Core Architecture**: A high-level description of its components and how they interact.
- **Justification**: Explain why this model would be superior to existing approaches and how it addresses a critical need.
- **Publication Potential**: Briefly explain why this work would be highly attractive to a top-tier journal or conference.

Provide a thorough, critical, and insightful response befitting an expert in the field.
`;

  // FIX: Removed deprecated GenerateContentRequest type and corrected contents structure for a single multi-modal request.
  const request = {
    model,
    contents: {
      parts: [{ text: textPrompt }, ...imageParts],
    },
  };

  try {
    const response = await ai.models.generateContent(request);
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};
