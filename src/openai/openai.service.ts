import { openai } from './index.ts'
import type OpenAI from 'openai'

export class OpenAiService {
  chat(
    content: string,
    model: string = 'gpt-4o-2024-05-13',
  ): Promise<OpenAI.ChatCompletion> {
    return openai.chat.completions.create({
      messages: [{ role: 'user', content }],
      model,
    })
  }
}
