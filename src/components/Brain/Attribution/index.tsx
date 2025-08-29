//'use client'

import { Html } from '@react-three/drei'

export function Attribution() {
  return (
    <Html
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        textAlign: 'right',
        color: 'var(--foreground)',
        fontSize: 12,
      }}
    >
      <p>&quot;Brain Areas&quot; (<a href='https://skfb.ly/AFry' target='_blank'>https://skfb.ly/AFry</a>) by Versal is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).</p>

      <p>see this for how I must attribute: <a href='https://creativecommons.org/licenses/by/4.0/#ref-appropriate-credit' target='_blank'>https://creativecommons.org/licenses/by/4.0/#ref-appropriate-credit</a></p>
    </Html>
  )
}