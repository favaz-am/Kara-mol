import asyncio
import websockets

async def test():
    async with websockets.connect("ws://localhost:8000/ws") as ws:
        await ws.send("hello server")
        response = await ws.recv()
        print("Got back:", response)

asyncio.run(test())