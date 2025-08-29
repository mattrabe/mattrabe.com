import type { ImageProps } from 'next/image'

export type HeadshotProps = Omit<ImageProps, 'src' | 'alt'> & {
  type?: 'ai' | 'real',
}
