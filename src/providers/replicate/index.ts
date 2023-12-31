import { handlePrompt } from './handler'
import type { Provider } from '@/types/provider'

const providerReplicate = () => {
  const provider: Provider = {
    id: 'provider-replicate',
    icon: 'i-carbon-replicate', // @unocss-include
    name: 'Replicate',
    globalSettings: [
      {
        key: 'token',
        name: 'Replicate API token',
        type: 'api-key',
      },
    ],
    bots: [
      {
        id: 'stable-diffusion',
        type: 'image_generation',
        name: 'Stable Diffusion',
        settings: [],
      },
      {
        id: 'midjourney-diffusion',
        type: 'image_generation',
        name: 'Midjourney',
        settings: [],
      },
    ],
    supportCallMethod: 'backend',
    handlePrompt,
  }
  return provider
}

export default providerReplicate
