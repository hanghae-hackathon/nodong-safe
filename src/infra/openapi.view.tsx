import { wrapHtml } from '../shared/wrap.html.tsx'

export const OpenapiView = wrapHtml<{ response: string }>(props => (
  <main style={{ padding: '16px' }}>
    <form method={'post'}>
      <textarea id={'chat-input'}></textarea>
      <button>chat</button>
      <hr />
      <div id={'content-box'}>{props?.response}</div>
    </form>
  </main>
))
