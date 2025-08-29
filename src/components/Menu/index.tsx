import {
  useState,
  type AnchorHTMLAttributes,
} from 'react'
import Link, { type LinkProps } from 'next/link'
import {
  FaExternalLinkAlt,
  FaLinkedin,
  FaGithub,
} from 'react-icons/fa'

const OPACITY = {
  off: 0,
  on: 0.95,
}
const BORDER_RADIUS = 7

import type { MenuProps } from './types'

export function Menu({
  isVisible = false,
}: MenuProps) {
  return (
    <nav
      style={{
        marginLeft: 10,
        backgroundColor: 'var(--menu-heavy)',
        backgroundImage: 'linear-gradient(to right, var(--menu-heavy), var(--menu-medium), var(--menu-heavy))',
        borderRadius: BORDER_RADIUS,
        opacity: isVisible ? OPACITY.on : OPACITY.off,
        transition: 'opacity 0.25s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        width: isVisible ? 'auto' : 0,
        height: isVisible ? 'auto' : 0,
        overflow: 'hidden',
      }}
    >
      <MenuItem href='/?' as ='/'>Home</MenuItem>
      <MenuItem
        href='/resume'
      >
        Resume
      </MenuItem>
      <MenuItem
        href='https://completecodesolutions.com'
        openInNewTab={true}
      >
        Complete Code<br />Solutions
      </MenuItem>

      <hr
        style={{
          border: 'none',
          borderTop: '1px solid var(--background)',
          opacity: 0.5,
          margin: '0',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          padding: '10px 20px',
        }}
      >
        <MenuItem
          href='https://linkedin.com/in/mattrabe'
          openInNewTab={true}
          type='icon'
        >
          <FaLinkedin style= {{ display: 'block' }} />
        </MenuItem>
        <MenuItem
          href='https://github.com/mattrabe'
          openInNewTab={true}
          type='icon'
        >
          <FaGithub style= {{ display: 'block' }} />
        </MenuItem>
      </div>
    </nav>
  )
}

function MenuItem({
  children,
  openInNewTab = false,
  style,
  type = 'link',
  ...props
}: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  openInNewTab?: boolean
  type?: 'link' | 'icon'
}) {
  const [
    isHovered,
    setIsHovered,
  ] = useState(false)

  return (
    <Link
      onClick={event => { event.stopPropagation() }} // Must stop event propagation to avoid header closing
      onTouchStart={event => { event.stopPropagation() }} // Must stop event propagation to avoid header closing
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      {...props}
      style={{
        color: 'var(--background)',
        textDecoration: 'none',
        fontWeight: 500,
        ...(type === 'icon' && {
          fontSize: 17,
          padding: '5px',
        }) || {
          fontSize: 16,
          padding: '10px 20px',
        },
        borderRadius: BORDER_RADIUS,
        backgroundColor: isHovered ? 'var(--menu-heavy)' : 'transparent',
        textAlign: 'center',
        ...style,
      }}
    >
      {children}
      {openInNewTab && type === 'link' && (
        <FaExternalLinkAlt
          size={10}
          style={{ marginLeft: 5 }}
        />
      )}
    </Link>
  )
}
