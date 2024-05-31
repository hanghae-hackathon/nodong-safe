import { genHtml } from '../shared/gen.html.tsx'

export const EchoView = genHtml(() => {
  return (
    <form method={'post'}>
      <input name={'message'} placeholder={'메세지를 입력하세요'} />
      <button type={'submit'}>제출</button>
    </form>
  )
})
