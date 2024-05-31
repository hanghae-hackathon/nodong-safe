import React from 'react'

export const genHtml = (factory: () => React.JSX.Element) => () => {
  return (
    <html lang="ko">
      <head>
        <title>Echo</title>
      </head>
      <body>
        <div id={'root'}>{factory()}</div>
      </body>
    </html>
  )
}
