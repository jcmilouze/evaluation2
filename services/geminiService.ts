
import { GoogleGenAI } from "@google/genai";
import { type EvaluationData, type EvaluationCriterion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to show this error to the user.
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateComment = async (evaluation: EvaluationData, criteria: EvaluationCriterion[]): Promise<string> => {
  if (!API_KEY) {
    return "Error: API key is not configured. Cannot generate comment.";
  }

  const evaluatedCriteria = criteria.filter(c => evaluation[c.id] !== null);

  if (evaluatedCriteria.length === 0) {
    return "Aucune compétence n'a été évaluée. Veuillez sélectionner des niveaux pour générer un commentaire.";
  }

  const evaluationSummary = evaluatedCriteria.map(criterion =>
    `- ${criterion.title}: ${evaluation[criterion.id]}`
  ).join('\n');

  const prompt = `
    En tant qu'assistant expert pour un enseignant, tu dois rédiger un commentaire d'évaluation pour un élève. Le ton doit être professionnel, juste et direct.

    **Instructions clés :**
    1.  **Synthèse :** Rédige un commentaire concis de 2 à 3 phrases maximum.
    2.  **Ton intransigeant :** Sois particulièrement ferme, clair et sans compromis concernant les compétences évaluées 'Insuffisant' ou 'Fragile', surtout pour ce qui est de l'attitude et du comportement (Discipline, Comportements sociaux). Le commentaire doit refléter l'exigence du monde professionnel et ne pas minimiser les difficultés. Une amélioration est attendue.
    3.  **Constructif :** Le commentaire doit identifier clairement les points à améliorer et, si possible, reconnaître les points forts.
    4.  **Format :** Ne commence jamais par "Basé sur l'évaluation," ou une formule similaire. Le commentaire doit être rédigé en français.

    Voici la synthèse de l'évaluation de l'élève :
    ${evaluationSummary}

    **Exemple de ton attendu pour une évaluation faible en comportement :**
    "Le manque de discipline et les bavardages constants de Dylan perturbent le bon déroulement du cours. Une amélioration significative de son comportement est attendue de manière urgente pour lui permettre de progresser."

    **Exemple pour une évaluation mixte :**
    "Léa montre de l'entraide envers ses camarades, mais son manque de ponctualité et d'organisation freine sa progression. Il est impératif qu'elle devienne plus autonome et rigoureuse."

    Génère maintenant le commentaire final pour l'évaluation fournie.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate comment from Gemini API.");
  }
};
