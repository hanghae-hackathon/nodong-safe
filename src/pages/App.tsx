import { FormEventHandler } from 'react'
import './App.css'
import { treaty } from '@elysiajs/eden'
import { App as Server } from '../app'

const server = treaty<Server>('localhost')

function App() {
  const createSession: FormEventHandler<HTMLFormElement> = async evt => {
    evt.preventDefault()

    const formData = new FormData(evt.target as HTMLFormElement)

    if (!formData.has('image')) return

    await server.sessions.index.post({ image: formData.get('image') as File })

    console.log('send')
  }

  return (
    <section>
      <main>
        <form encType={'multipart/form-data'} onSubmit={createSession}>
          <input type={'file'} name={'image'} />
          <br />
          <button type={'submit'}>세션 생성</button>
        </form>
      </main>
    </section>
  )
}

export default App
