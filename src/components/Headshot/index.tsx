import Image from 'next/image'

import headshotAi from '../../../public/images/headshot-ai.png'
//import headshotReal from '../../../public/images/headshot-real.jpg'

import type { HeadshotProps } from './types'

export function Headshot({
  style,
  // type = 'ai',
  ...props
}: HeadshotProps) {
  return (
    <div
      style={{
        width: props.width,
        height: props.height,
        transition: 'opacity 0.42s ease-in-out, width 0.42s ease-in-out, height 0.42s ease-in-out',
        zIndex: 100,
      }}
    >
      <Image
        src={headshotAi}
        alt='Matt Rabe'
        {...props}
        priority={true}
        style={{
          borderRadius: '50%',
          objectFit: 'cover',
          ...style,
          transition: 'opacity 0.42s ease-in-out, width 0.42s ease-in-out, height 0.42s ease-in-out',
        }}
      />
      {/*
      <Image
        src={headshotReal}
        alt='Matt Rabe'
        {...props}
        style={{
          position: 'absolute',
          left: 0,
          borderRadius: '50%',
          objectFit: 'cover',
          ...style,
          opacity: (type === 'real' && (style?.opacity || 1)) || 0,
        }}
      />
      */}
    </div>
  )
}
