import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { PipecatClient } from '@pipecat-ai/client-js'
import { PipecatClientProvider, PipecatClientAudio } from '@pipecat-ai/client-react'
import { WebSocketTransport, ProtobufFrameSerializer } from '@pipecat-ai/websocket-transport'

const transport = new WebSocketTransport({
  wsUrl: 'ws://10.144.80.125:8000/ws',
  serializer: new ProtobufFrameSerializer(),
  recorderSampleRate: 16000,
  playerSampleRate: 16000,     
})

const client = new PipecatClient({
  transport: transport,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PipecatClientProvider client={client}>
      <App />
      <PipecatClientAudio />
    </PipecatClientProvider>
  </React.StrictMode>,
)