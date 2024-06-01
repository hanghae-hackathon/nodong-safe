import { FormEventHandler, useState } from 'react'

function App() {
  const [conversations, setConversations] = useState<
    {
      me: boolean
      content: string
    }[]
  >([])

  const createSession: FormEventHandler<HTMLFormElement> = async evt => {
    evt.preventDefault()

    const formData = new FormData(evt.target as HTMLFormElement)

    if (!formData.has('image')) return

    const response = await fetch('http://localhost/sessions', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) return

    const data = await response.json()

    window.sessionStorage.setItem('session_id', data.session_id)

    setConversations([
      {
        me: false,
        content: data.openingMent,
      },
    ])

    console.log('send')
  }

  const sendMessage: FormEventHandler<HTMLFormElement> = async evt => {
    evt.preventDefault()

    const formData = new FormData(evt.target as HTMLFormElement)

    if (!formData.has('content')) return
    if (!window.sessionStorage.getItem('session_id')) return

    setConversations(conversation => [
      ...conversation,
      {
        me: true,
        content: formData.get('content') as string,
      },
    ])

    const response = await fetch(
      `http://localhost/sessions/${window.sessionStorage.getItem('session_id')}`,
      {
        method: 'POST',
        body: formData,
      },
    )

    if (!response.ok) return

    const data = await response.json()

    setConversations(conversation => [
      ...conversation,
      {
        me: false,
        content: data.response.toString(),
      },
    ])
  }

  return (
    <section>
      <header>
        <h1>데모 앱</h1>
      </header>
      <main>
        <form encType={'multipart/form-data'} onSubmit={createSession}>
          <input type={'file'} name={'image'} />
          <br />
          <button type={'submit'}>세션 생성</button>
        </form>
        <hr />
        <form onSubmit={sendMessage}>
          <input
            type={'hidden'}
            name={'author'}
            value={'6659d2ffeb7bdd1c17afdea5'}
          />
          <textarea name={'content'}></textarea>
          <button type={'submit'}>제출</button>
        </form>
        <div>
          {conversations.map(conversation => (
            <div style={{ marginBottom: '16px' }}>
              <div>{conversation.me ? '나' : 'Nodo.AI'}</div>
              <div>{conversation.content}</div>
            </div>
          ))}
        </div>
      </main>
    </section>
  )
}

export default App
