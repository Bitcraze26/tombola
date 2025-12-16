import asyncio
import os
import edge_tts

# Voice Selection
VOICE = "it-IT-ElsaNeural"
OUTPUT_DIR = "public/sounds"

# Smorfia Data (Duplicated for script simplicity)
SMORFIA = {
  1: "L'Italia", 2: "'A piccerella", 3: "'A gatta", 4: "'O puorco", 5: "'A mano",
  6: "Chella che guarda 'nterra", 7: "'A scuppetta", 8: "'A Maronna", 9: "'A figliata", 10: "'E fasule",
  11: "'E suricille", 12: "'E surdate", 13: "Sant'Antonio", 14: "'O mbriaco", 15: "'O guaglione",
  16: "'O culo", 17: "'A disgrazia", 18: "'O sango", 19: "'A resata", 20: "'A festa",
  21: "'A femmena annura", 22: "'O pazzo", 23: "'O scemo", 24: "'E guardie", 25: "Natale",
  26: "Nanninella", 27: "'O cantero", 28: "'E zizze", 29: "'O pate d' 'e criature", 30: "'E palle d' 'o tenente",
  31: "'O padrone 'e casa", 32: "'O capitone", 33: "L'anne 'e Cristo", 34: "'A capa", 35: "L'aucielluzzo",
  36: "'E castagnelle", 37: "'O monaco", 38: "'E mmazzate", 39: "'A funa 'n ganna", 40: "'A paposcia",
  41: "'O curtiello", 42: "'O cafè", 43: "'A femmena 'ncopp' 'o balcone", 44: "'E ccancelle", 45: "'O vino buono",
  46: "'E denare", 47: "'O muorto", 48: "'O muorto che parla", 49: "'O piezzo 'e carne", 50: "'O pane",
  51: "'O ciardino", 52: "'A mamma", 53: "'O viecchio", 54: "'O cappiello", 55: "'A museca",
  56: "'A caruta", 57: "'O scartellato", 58: "'O paccotto", 59: "'E pile", 60: "Se lamenta",
  61: "'O cacciatore", 62: "'O muorto acciso", 63: "'A sposa", 64: "'A sciammeria", 65: "'O chianto",
  66: "'E ddoje zetelle", 67: "'O totano int' 'a chitarra", 68: "'A zuppa cotta", 69: "Sott'e 'ncoppa", 70: "'O palazzo",
  71: "L'ommo 'e merda", 72: "'A meraviglia", 73: "'O spitale", 74: "'A grotta", 75: "Pulecenella",
  76: "'A funtana", 77: "'E diavule", 78: "'A bella figliola", 79: "'O mariuolo", 80: "'A vocca",
  81: "'E sciure", 82: "'A tavula 'mbandita", 83: "'O maletiempo", 84: "'A cchiesa", 85: "'E l'aneme 'o priatorio",
  86: "'A puteca", 87: "'E perucchie", 88: "'E caciocavalle", 89: "'A vecchiarella", 90: "'A paura"
}

async def generate_file(num, text):
    filename = os.path.join(OUTPUT_DIR, f"{num}.mp3")
    # Text to speak: "90" (Just the number)
    speak_text = str(num)
    communicate = edge_tts.Communicate(speak_text, VOICE)
    await communicate.save(filename)
    print(f"Generato [{num}/90]: {filename}")

async def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    
    print(f"Iniziando generazione audio con voce: {VOICE}...")
    
    tasks = []
    for num in range(1, 91):
        if num in SMORFIA:
            tasks.append(generate_file(num, SMORFIA[num]))
            
    # Run in chunks to avoid overwhelming connection potentially? 
    # Usually gather is fine for 90 small requests, but let's be safe with strict concurrency limit if needed.
    # For now simple gather.
    await asyncio.gather(*tasks)
    
    print("\nGenerazione Completata! Controlla la cartella public/sounds.")

if __name__ == "__main__":
    asyncio.run(main())
