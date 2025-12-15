# WeatherApp by KnutsÄnglar (Malmö 3 ChasAcademy)
Chas Project, practising API handling.

# 🌦️ Väderapp

## Om projektet  
Vi har byggt en väderapp med HTML, CSS och JavaScript.  
Appen låter användaren skriva in en stad och se väderinformation som temperatur, väderbeskrivning och en emoji som visar vilket väder det är.  
I den här versionen används påhittad väderdata (mock-data) för att testa appens funktioner innan riktig data kopplas in.



## Vad appen gör  
- Användaren kan skriva in en stad och trycka på Sök eller Enter.  
- Om staden finns visas ett väderkort med stadens namn, temperatur och ikon.  
- Om staden inte finns visas ett rött felmeddelande.  
- Varje väderkort kan stängas genom att klicka på ✖.  
- Det går att söka flera gånger och visa flera väderkort samtidigt.  



## Hur appen är uppbyggd  
- index.html – innehåller strukturen för sidan, rubrik, sökruta och resultat.  
- styles.css – styr färger, layout, typsnitt och utseende.  
- scripts.js – innehåller logiken som gör att sökning och väderkorten fungerar.  
- sun.png – används som logotyp högst upp på sidan.  



## Design  
- Enkel och tydlig design.  
- Bakgrunden har en blå gradient som liknar himlen.  
- Innehållet är centrerat och väderkorten har rundade hörn och skuggor.  
- Knapparna ändrar färg när man håller musen över dem.  
- Loggan (en sol) ligger högst upp och har en lätt flytande animation. 

<img src="./imgs/wireframe.png" width="200px">



## JavaScript  
- Appen använder en lista med fem svenska städer och deras väderdata.  
- När man söker kontrollerar koden om staden finns i listan.  
- Om staden finns skapas ett nytt väderkort med rätt data.  
- Om staden inte finns visas ett felmeddelande.  
- Varje väderkort går att stänga med ett klick.  
- Appen lyssnar även på Enter så man kan söka utan att klicka på knappen.  



## Vad vi har gjort  
- Byggt grunden i HTML.  
- Lagt till färger, layout och logga med CSS.  
- Skrivit JavaScript som visar väderdata och hanterar sökningar.  
- Testat, felsökt och förbättrat funktionerna.  
- Lagt till små detaljer som hover-effekter och animationer.  



## Nästa steg  
- Koppla appen till ett riktigt väder-API med fetch().  
- Visa väder för flera dagar framåt.  
- Göra sidan mer anpassad för mobil.  
- Lägga till mörkt läge (dark mode).  
- Ändra bakgrundsfärg eller ikon beroende på väder.  
