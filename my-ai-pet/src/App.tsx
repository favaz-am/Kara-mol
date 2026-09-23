import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { usePipecatClient, usePipecatClientMicControl } from '@pipecat-ai/client-react'
import KaraModel from './KaraModel'
import './index.css'

export default function App() {
  const [activeApp, setActiveApp] = useState('Desktop')
  const [isConnected, setIsConnected] = useState(false)
  
  const client = usePipecatClient()
  const { enableMic } = usePipecatClientMicControl()
  
  // High-speed refs to avoid React re-render lag
  const ringRef = useRef<HTMLDivElement>(null)
  const isBotSpeaking = useRef(false)

  // 1. Manage the connection state
  useEffect(() => {
    if (!client) return

    const handleStateChange = (state: string) => {
      const connected = state === 'connected' || state === 'ready'
      setIsConnected(connected)
      
      // Set initial ring state when connecting/disconnecting
      if (ringRef.current) {
        ringRef.current.className = connected ? 'detroit-ring idle' : 'detroit-ring sleeping'
      }
    }
    
    client.on('transportStateChanged', handleStateChange)
    
    return () => {
      client.off('transportStateChanged', handleStateChange)
    }
  }, [client])

  // 2. DETROIT RING LOGIC & PIPECAT EVENTS
  useEffect(() => {
    if (!client) return
    
    const onBotStart = () => {
      isBotSpeaking.current = true
      if (ringRef.current) ringRef.current.className = 'detroit-ring speaking' // Blue
    }
    
    const onBotStop = () => {
      isBotSpeaking.current = false
      if (ringRef.current) ringRef.current.className = 'detroit-ring idle' // Dim Idle
    }
    
    const onLocalAudioLevel = (level: number) => {
      // Don't interrupt the blue ring if the AI is currently talking
      if (isBotSpeaking.current || !ringRef.current) return

      // If user volume crosses threshold, turn ring yellow
      if (level > 0.02) {
        ringRef.current.className = 'detroit-ring listening' // Yellow
      } else {
        if (ringRef.current.className !== 'detroit-ring idle') {
          ringRef.current.className = 'detroit-ring idle' 
        }
      }
    }

    client.on('botStartedSpeaking', onBotStart)
    client.on('botStoppedSpeaking', onBotStop)
    client.on('localAudioLevel', onLocalAudioLevel) 

    return () => {
      client.off('botStartedSpeaking', onBotStart)
      client.off('botStoppedSpeaking', onBotStop)
      client.off('localAudioLevel', onLocalAudioLevel)
    }
  }, [client])

  // 3. Track the active application
  useEffect(() => {
    const electron = (window as any).ipcRenderer
    if (electron && electron.on) {
      electron.on('main-process-message', (_event: any, appName: string) => {
        setActiveApp(appName)
      })
    }
  }, [])

  // 4. Handle connection
  const toggleConnection = async () => {
    if (!client) return 
    try {
      if (isConnected) {
        await client.disconnect()
      } else {
        await client.connect()
        enableMic(true) 
      }
    } catch (err) {
      console.error("Connection error:", err)
      if (ringRef.current) ringRef.current.className = 'detroit-ring error' // Red on crash
    }
  }

  return (
    <div className="drag-region" style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div 
        className="no-drag" 
        style={{
          width: '180px', 
          height: '220px', 
          borderRadius: '24px',
          backgroundColor: isConnected ? 'rgba(0, 50, 20, 0.85)' : 'rgba(30, 30, 30, 0.85)',
          border: '2px solid rgba(255, 255, 255, 0.2)', 
          backdropFilter: 'blur(8px)', 
          color: '#ffffff',
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', 
          userSelect: 'none', 
          textAlign: 'center', 
          padding: '15px',
          transition: 'background-color 0.4s ease'
        }}
      >
        
        {/* THE DETROIT RING WRAPPER */}
        <div ref={ringRef} className="detroit-ring sleeping" style={{ marginBottom: '8px' }}>
          {/* Circular 3D Viewport Window */}
          <div 
            style={{ 
              width: '90px', 
              height: '90px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              background: '#121212',
              position: 'relative',
              zIndex: 2 
            }}
          >
            <Suspense fallback={null}>
            <Canvas
  camera={{ position: [0, 0, 1.8], fov: 45 }}
  gl={{ alpha: true, antialias: true }}
>
  {/* Soft ambient lighting all around */}
  <ambientLight intensity={2.0} />

  {/* Front key-light placed directly in front of her face */}
  <directionalLight position={[0, 1, 2]} intensity={2.5} />

  {/* Subtle rim light for Detroit sci-fi hair highlights */}
  <directionalLight position={[-2, 2, -1]} intensity={1.5} color="#00e1ff" />

  <KaraModel />
</Canvas>
            </Suspense>
          </div>
        </div>

        <p style={{ margin: '0', fontWeight: 'bold', fontSize: '14px' }}>
          {isConnected ? 'Online' : 'Sleeping'}
        </p>
        <p style={{ margin: '4px 0 10px', fontSize: '10px', color: '#00ffcc' }}>
          Watching: {activeApp}
        </p>

        <button
          onClick={toggleConnection}
          style={{
            padding: '6px 14px', 
            borderRadius: '12px', 
            border: 'none',
            backgroundColor: '#ffffff', 
            color: '#000000', 
            cursor: 'pointer',
            fontSize: '12px', 
            fontWeight: 'bold', 
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isConnected ? 'Disconnect' : 'Wake Up'}
        </button>
      </div>
    </div>
  )
}