import React from 'react'

export function wrapHtml<P = void>(jsx: (props?: P) => React.JSX.Element) {
  return (props?: P) => () => (
    <html lang="ko">
      <head>
        <title>Echo</title>
      </head>
      <body>
        <div id={'root'}>{jsx(props)}</div>
      </body>
    </html>
  )
}
