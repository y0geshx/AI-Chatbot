import { fetchImageGeneration } from './api'
import type { HandlerPayload, Provider } from '@/types/provider'
import type { Message } from '@/types/message'

export const handlePrompt: Provider['handlePrompt'] = async(payload, signal?: AbortSignal) => {
  if (payload.botId === 'stable-diffusion')
    return handleReplicateGenerate('db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf', payload)
  if (payload.botId === 'midjourney-diffusion')
    return handleReplicateGenerate('436b051ebd8f68d23e83d22de5e198e0995357afef113768c20f0b6fcef23c8b', payload)
}

const handleReplicateGenerate = async(modelVersion: string, payload: HandlerPayload) => {
  const prompt = payload.prompt
  const response = await fetchImageGeneration({
    token: payload.globalSettings.token as string,
    method: 'POST',
    body: {
      version: modelVersion,
      input: {
        prompt,
      },
    },
  })
  if (!response.ok) {
    const responseJson = await response.json()
    const errMessage = responseJson.detail || response.statusText || 'Unknown error'
    throw new Error(errMessage, {
      cause: {
        code: response.status,
        message: errMessage,
      },
    })
  }
  const resJson = await response.json()

  return waitImageWithPrediction(resJson, payload.globalSettings.token as string)
}

interface Prediction {
  id: string
  input: {
    prompt: string
  }
  output: string[] | null
  status: 'starting' | 'succeeded' | 'failed'
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const waitImageWithPrediction = async(prediction: Prediction, token: string) => {
  let currentPrediction = prediction
  while (currentPrediction.status !== 'succeeded' && currentPrediction.status !== 'failed') {
    await sleep(1000)
    const response = await fetchImageGeneration({
      predictionId: currentPrediction.id,
      token,
    })
    if (!response.ok) {
      const responseJson = await response.json()
      const errMessage = responseJson.error?.message || 'Unknown error'
      throw new Error(errMessage)
    }
    prediction = await response.json()
    currentPrediction = prediction
    // console.log('currentPrediction', prediction)
  }
  if (!currentPrediction.output || currentPrediction.output.length === 0)
    throw new Error('No output')
  return currentPrediction.output[0]
}
