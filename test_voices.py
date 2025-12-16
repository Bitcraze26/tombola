import asyncio
import edge_tts

TEXT = "Benvenuti alla Tombola Napoletana. Numero 90, la Paura!"

async def _main():
    # Example 1: Diego (Male - Neural)
    communicate = edge_tts.Communicate(TEXT, "it-IT-DiegoNeural")
    await communicate.save("campione_diego.mp3")
    print("Generato: campione_diego.mp3")

    # Example 2: Elsa (Female - Neural)
    communicate = edge_tts.Communicate(TEXT, "it-IT-ElsaNeural")
    await communicate.save("campione_elsa.mp3")
    print("Generato: campione_elsa.mp3")

if __name__ == "__main__":
    asyncio.run(_main())
