
import React from 'react';

export type RatingLabel = 'Insuffisant' | 'Fragile' | 'Satisfaisant' | 'Très bonne maîtrise';
export type Rating = RatingLabel | null;

export interface EvaluationCriterion {
  id: string;
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  weight?: number;
}

export interface Student {
  id: number;
  name: string;
}

export interface Class {
  id: string;
  name: string;
  students: Student[];
}

export type EvaluationData = Record<string, Rating>;
