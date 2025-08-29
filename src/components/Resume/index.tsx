import Link from 'next/link'
import { FaExternalLinkAlt } from 'react-icons/fa'

export function Resume(props: {
  height: string,
  width: string,
}) {
  return (
    <>
      <Link
        href='https://docs.google.com/document/d/1aMJ1se0rFbErJs9vFdZ8uDyWZTO6TwweKHZlMlGuy5Q/view'
        target='_blank'
        rel='noopener noreferrer'
        className='show-on-mobile'
      >
        Open in Google Docs
        <FaExternalLinkAlt
          size={10}
          style={{ marginLeft: 5 }}
        />
      </Link>
      <iframe
        className='hide-on-mobile'
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
