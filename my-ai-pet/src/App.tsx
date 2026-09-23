import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { usePipecatClient, usePipecatClientMicControl } from '@pipecat-ai/client-react'
import KaraModel from './KaraModel'
import './index.css'

export default function App() {
  const [activeApp, setActiveApp] = useState('Desktop')
  const [isConnected, setIsConnected] = useState(false)
  
  const client = usePipecatClient()
  const { enableMic } = usePipecatClientMicControl()

  // 1. Manage the Pipecat connection state
  useEffect(() => {
    if (!client) return

    const handleStateChange = (state: string) => {
      setIsConnected(state === 'connected' || state === 'ready')
    }
    
    client.on('transportStateChanged', handleStateChange)
    
    return () => {
      client.off('transportStateChanged', handleStateChange)
    }
  }, [client])

  // 2. Track the active desktop application
  useEffect(() => {
    const electron = (window as any).ipcRenderer
    if (electron && electron.on) {
      electron.on('main-process-message', (_event: any, appName: string) => {
        setActiveApp(appName)
      })
    }
  }, [])

  // 3. Handle Connect/Disconnect
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
    }
  }

  return (
    <div className="drag-region" style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* CONDITIONAL RENDER: If disconnected, show iOS Glass UI. If connected, show Borderless 3D Model */}
      {!isConnected ? (
        
        /* --- STATE 1: THE iOS WAKE-UP UI --- */
        <div 
          className="no-drag"
          style={{
            padding: '24px 40px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            color: '#fff',
            textAlign: 'center'
          }}
        >
          <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '500', letterSpacing: '1px' }}>
            KARA MOL
          </h2>
          <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
            Watching: {activeApp}
          </p>

          <button
            onClick={toggleConnection}
            style={{
              padding: '12px 28px', 
              borderRadius: '20px', 
              border: 'none',
              background: 'linear-gradient(135deg, #007AFF 0%, #0056b3 100%)',
              color: '#ffffff', 
              cursor: 'pointer',
              fontSize: '14px', 
              fontWeight: '600', 
              boxShadow: '0 4px 15px rgba(0, 122, 255, 0.4)',
              transition: 'transform 0.1s ease'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Wake Up
          </button>
        </div>

      ) : (

        /* --- STATE 2: THE BORDERLESS 3D MODEL --- */
        <div className="no-drag" style={{ width: '100%', height: '100%', position: 'relative' }}>
          
          {/* Subtle close/sleep button floating in the top right corner */}
          <button
            onClick={toggleConnection}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '6px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              fontSize: '10px',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            Sleep
          </button>

          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 2.5], fov: 45 }}
              gl={{ alpha: true, antialias: true }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={1.5} />
              <directionalLight position={[0, 1, 2]} intensity={2.5} />
              <directionalLight position={[-2, 2, -1]} intensity={1.5} color="#00e1ff" />
              <KaraModel />
            </Canvas>
          </Suspense>

        </div>
      )}

    </div>
  )
}