
import type { AnnotationProps } from '../Annotation'

export const annotations: Pick<AnnotationProps, 'position' | 'size' | 'label'>[] = [
  {
    position: [ 0.1, 0.1, 0.7 ],
    size: 0.04,
    label: 'TypeScript',
  },
  {
    position: [ 0.15, 0.3, 0.65 ],
    size: 0.03,
    label: 'node.js',
  },
  {
    position: [ 0.2, 0.4, 0.4 ],
    size: 0.03,
    label: 'Express',
  },
  {
    position: [ 0.05, 0, 0.65 ],
    size: 0.02,
    label: 'SQL',
  },
  {
    position: [ 0.3, 0.3, 0.4 ],
    size: 0.02,
    label: 'AWS',
  },
  {
    position: [ 0.25, 0.3, 0.5 ],
    size: 0.03,
    label: 'Docker',
  },
  {
    position: [ 0.28, 0.2, 0.55 ],
    size: 0.03,
    label: 'CI/CD',
  },
  {
    position: [ 0.4, 0.2, 0.3 ],
    size: 0.02,
    label: 'REST',
  },
  {
    position: [ 0, 0.35, 0.6 ],
    size: 0.03,
    label: 'AI',
  },
  {
    position: [ -0.1, 0.3, 0.6 ],
    size: 0.03,
    label: 'React',
  },
  {
    position: [ -0.1, 0.35, 0.55 ],
    size: 0.04,
    label: 'React Native',
  },
  {
    position: [ -0.4, 0.3, 0.3 ],
    size: 0.02,
    label: 'Vue.js',
  },
  {
    position: [ 0.2, 0.1, -0.65 ],
    size: 0.03,
    label: 'PHP',
  },
  {
    position: [ 0.22, 0.15, -0.6 ],
    size: 0.04,
    label: 'Laravel',
  },
  {
    position: [ 0, 0.15, -0.6 ],
    size: 0.04,
    label: 'Filament',
  },
  {
    position: [ -0.05, 0.15, 0.65 ],
    size: 0.05,
    label: 'Problem Solving',
  },
  {
    position: [ -0.02, 0, 0.5 ],
    size: 0.02,
    label: 'Aneurysm',
  },
  {
    position: [ -0.2, 0.15, 0.65 ],
    size: 0.05,
    label: 'Music',
  },
  {
    position: [ -0.35, 0.15, 0.5 ],
    size: 0.03,
    label: 'Guitar',
  },
  {
    position: [ -0.15, 0.05, 0.65 ],
    size: 0.03,
    label: 'Drums',
  },
  {
    position: [ -0.125, 0.2, 0.65 ],
    size: 0.04,
    label: 'Harmonies',
  },
] as const
