<<<<<<< HEAD
import asyncio
import os
import edge_tts

PHRASES = [
    "TOMBOLAAAA! Stasera comando io!",
    "È uscita la tombola… e no, non è un fake!",
    "Tombola! Mani in alto e portafogli aperti!",
    "Signore e signori… TOMBOLA!",
    "Chiudete tutto: è TOMBOLA!",
    "Tombola! La fortuna ha fatto tappa qui.",
    "E quando meno te l’aspetti… TOMBOLA!",
    "Tombola secca, senza VAR!",
    "Avete sentito? TOMBOLAAA!",
    "Questa non è una smorfia: è TOMBOLA!"
]

VOICE = "it-IT-ElsaNeural"
OUTPUT_DIR = "public/sounds/tombola"

async def generate(index, text):
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    filename = os.path.join(OUTPUT_DIR, f"{index}.mp3")
    # Add emphasis with SSML or rate/pitch tweaks
    # Simple tweak: increase rate slightly for excitement, maybe pitch?
    # Edge-TTS lib supports rate and pitch in Communicate args directly or SSML.
    # We'll use simple rate/volume.
    
    communicate = edge_tts.Communicate(text, VOICE, rate="+10%", volume="+20%", pitch="+5Hz")
    await communicate.save(filename)
    print(f"Generato: {filename} -> '{text}'")

async def main():
    print("Generazione frasi Tombola...")
    tasks = []
    for i, phrase in enumerate(PHRASES):
        tasks.append(generate(i, phrase))
    
    await asyncio.gather(*tasks)
    print("Fatto!")

if __name__ == "__main__":
    asyncio.run(main())
=======
import asyncio
import os
import edge_tts

PHRASES = [
    "TOMBOLAAAA! Stasera comando io!",
    "È uscita la tombola… e no, non è un fake!",
    "Tombola! Mani in alto e portafogli aperti!",
    "Signore e signori… TOMBOLA!",
    "Chiudete tutto: è TOMBOLA!",
    "Tombola! La fortuna ha fatto tappa qui.",
    "E quando meno te l’aspetti… TOMBOLA!",
    "Tombola secca, senza VAR!",
    "Avete sentito? TOMBOLAAA!",
    "Questa non è una smorfia: è TOMBOLA!"
]

VOICE = "it-IT-ElsaNeural"
OUTPUT_DIR = "public/sounds/tombola"

async def generate(index, text):
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    filename = os.path.join(OUTPUT_DIR, f"{index}.mp3")
    # Add emphasis with SSML or rate/pitch tweaks
    # Simple tweak: increase rate slightly for excitement, maybe pitch?
    # Edge-TTS lib supports rate and pitch in Communicate args directly or SSML.
    # We'll use simple rate/volume.
    
    communicate = edge_tts.Communicate(text, VOICE, rate="+10%", volume="+20%", pitch="+5Hz")
    await communicate.save(filename)
    print(f"Generato: {filename} -> '{text}'")

async def main():
    print("Generazione frasi Tombola...")
    tasks = []
    for i, phrase in enumerate(PHRASES):
        tasks.append(generate(i, phrase))
    
    await asyncio.gather(*tasks)
    print("Fatto!")

if __name__ == "__main__":
    asyncio.run(main())
>>>>>>> a8de275 (inizio)
