import type { AnnotationProps } from '@/components/Brain/Annotations/Annotation'

export type GetAnnotationsReturn = Pick<AnnotationProps, 'id' | 'position' | 'size' | 'fontSize' | 'expandedFontSize' | 'label' | 'content' | 'isAutoShow' | 'expandedPosition' | 'expandedScale' | 'expandedCameraPosition'>[]
