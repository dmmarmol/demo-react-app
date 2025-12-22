import type React from 'react'

declare global {
  namespace JSX {
    /* eslint-disable @typescript-eslint/no-empty-object-type */
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}
