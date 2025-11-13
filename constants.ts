
import { type EvaluationCriterion, type RatingLabel, type Class } from './types';
import { ShieldAlertIcon, MessageCircleIcon, LightbulbIcon, UsersIcon, HeartHandshakeIcon } from './components/Icons';

export const INITIAL_CLASSES: Class[] = [
  { 
    id: 'bac-pro-mcv-1', 
    name: 'Bac Pro MCV',
    students: [
      { id: 1, name: 'BEVILACQUA Dylan' },
      { id: 2, name: 'MARTIN Léa' },
      { id: 3, name: 'BERNARD Hugo' },
      { id: 4, name: 'DUBOIS Chloé' },
      { id: 5, name: 'ROBERT Manon' },
      { id: 6, name: 'RICHARD Louis' },
      { id: 7, name: 'PETIT Camille' },
      { id: 8, name: 'DURAND Nicolas' },
      { id: 9, name: 'LEROY Emma' },
      { id: 10, name: 'MOREAU Lucas' },
    ]
  },
];

export const EVALUATION_CRITERIA: EvaluationCriterion[] = [
  {
    id: 'discipline',
    title: 'Discipline et engagement en classe',
    description: 'Respecte l\'interdiction du téléphone portable • Maintient le silence quand demandé • Évite les bavardages inappropriés • Arrive ponctuellement et s\'installe correctement • Apporte le matériel complet nécessaire',
    icon: ShieldAlertIcon,
    weight: 1.5,
  },
  {
    id: 'participation',
    title: 'Participation et communication',
    description: 'Prend la parole spontanément dans les échanges • Formule des interventions pertinentes • Respecte le tour de parole • S\'exprime de manière audible et compréhensible • Maintient une posture d\'écoute appropriée',
    icon: MessageCircleIcon,
    weight: 1,
  },
  {
    id: 'autonomie',
    title: 'Autonomie et organisation',
    description: 'Travaille de manière indépendante • Respecte scrupuleusement les consignes données • Gère efficacement son temps • Prépare spontanément son matériel • Organise efficacement son espace de travail',
    icon: LightbulbIcon,
    weight: 1,
  },
  {
    id: 'comportement_social',
    title: 'Comportements sociaux et professionnels',
    description: 'Adopte une attitude polie et respectueuse • Collabore efficacement lors des travaux en équipe • Fait preuve d\'entraide et de solidarité • S\'implique dans les projets liés aux métiers du commerce • Valorise sa formation MCV',
    icon: UsersIcon,
    weight: 1.5,
  },
  {
    id: 'perseverance',
    title: 'Adaptabilité et persévérance',
    description: 'Fait preuve de persévérance face aux difficultés • S\'adapte aux changements de consignes • Contrôle ses emotions et réactions • Maintient une régularité dans ses efforts • Manifeste une volonté de progresser',
    icon: HeartHandshakeIcon,
    weight: 1,
  },
];

export const RATINGS: RatingLabel[] = ['Insuffisant', 'Fragile', 'Satisfaisant', 'Très bonne maîtrise'];

export const RATING_COLORS: Record<RatingLabel, string> = {
  'Insuffisant': 'bg-red-100 text-red-800 border-red-300',
  'Fragile': 'bg-orange-100 text-orange-800 border-orange-300',
  'Satisfaisant': 'bg-blue-100 text-blue-800 border-blue-300',
  'Très bonne maîtrise': 'bg-green-100 text-green-800 border-green-300',
};

export const RATING_POINTS: Record<RatingLabel, number> = {
    'Insuffisant': 0,
    'Fragile': 1,
    'Satisfaisant': 2,
    'Très bonne maîtrise': 3,
};
