import type { AnnotationProps } from '@/components/Brain/Annotation'

export type GetAnnotationsReturn = Pick<AnnotationProps, 'id' | 'position' | 'size' | 'fontSize' | 'expandedFontSize' | 'label' | 'content' | 'isAutoShow' | 'expandedPosition' | 'expandedScale' | 'expandedCameraPosition'>[]
