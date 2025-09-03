import Link from 'next/link'
import { FaExternalLinkAlt } from 'react-icons/fa'

export function Resume(props: {
  height: string,
  width: string,
}) {
  return (
    <>
      <div
        className='show-on-mobile'
        style={{
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <p>It looks like you&apos;re on mobile, which means my resume will be best viewed in Google Docs.</p>

        <Link
  //        href='https://docs.google.com/document/d/e/2PACX-1vSXxS4coPbUnZBDiMXB88Jl1yNbrLgec4havyzQhaE6jRJ5_n5f9Q91guy_OnslUDaEHeh93Y7MGAqf/pub?embedded=true'
          href='https://docs.google.com/document/d/1aMJ1se0rFbErJs9vFdZ8uDyWZTO6TwweKHZlMlGuy5Q/view'
          target='_blank'
          rel='noopener noreferrer'
        >
          Open in Google Docs
          <FaExternalLinkAlt
            size={10}
            style={{ marginLeft: 5 }}
          />
        </Link>
      </div>

      <iframe
        className='hide-on-mobile'
  //      src='https://docs.google.com/document/d/e/2PACX-1vSXxS4coPbUnZBDiMXB88Jl1yNbrLgec4havyzQhaE6jRJ5_n5f9Q91guy_OnslUDaEHeh93Y7MGAqf/pub?embedded=true'
        src='https://docs.google.com/document/d/1aMJ1se0rFbErJs9vFdZ8uDyWZTO6TwweKHZlMlGuy5Q/view?embedded=true'
        style={{
          backgroundColor: '#ccc',
          borderTop: 'none',
          borderBottom: 'none',
          borderLeft: 'solid 1px #ccc',
          borderRight: 'solid 1px #ccc',
        }}
        height={props.height}
        width={props.width}
        rel='preload'
      ></iframe>
    </>
  )
}
