# earth_explorer

## Konzept

Das Konzept für das Projekt hat sich im Laufe der Zeit mitentwickelt. Das Idee für das Endergebnis ist eine Art Lernspiel, bei der man mit einem Flugobjekt über die Welt fliegt, sich nach belieben ein Land auswählen und dort eine "Exploration" starten kann. Die Exploration ist dann eine Kombination aus Wissensaneignung mit einem darauf folgendem Quiz für welches es dann Punkte gibt. Da die Erstellen des Quizes nicht im Vordergrund des Projekts stand, ist die Wissenaneignung einfach ein URL-Link auf die Wikipedia-Seite eines Landes.
Damit Länder ausgewählt werden können, war meine Idee für jedes Land ein klickbares Polygon zu erstellen. Leider habe ich es nicht hinbekommen, die Polygone zu zeichnen, obwohl die Daten (Siehe Konsole) eigentlich Stimmen sollten.

## Hürden

- der Umgang mit mehr als einer Szene (Controls oder Kamera überlappen leider noch)
- Zeichnen der Polygone
- Ausrichten von Model und Kamera bei Bewegung
- verstellbarer Sound --> und positional Sound für Flugobjekte

## Weitere Ideen

- Game Loop
  Um die "Playability" zu erhöhen, war die Idee einen Shop zu erstellen bei dem die Punkte, nach einem erfolgreichen Quiz, für neue Flugobjekte und After-Effects ausgegeben werden können.

- Atmosphäre, Wolken, randomisierte Vögelschwärme (damit die Exploration Szene nicht so leer wirkt)

- Maßnahmen gegen Ladezeiten (Ladesequenz, async loading oder sogar partial loading)

## Quellen

Neben der three.js Dokumentation habe ich noch einige anderen Quellen benutzt. Diese werden im Folgenden aufgelistet und sind auch in der jeweiligen Datei nochmal hinterlegt.
Dabei möchte ich zwischen 3 Typen von Quellen unterscheiden:

- Typ 1: Inspiration, aber selbst geschrieben
- Typ 2: Inspiration, umgeschrieben
- Typ 3: Quelle übernommen

Combination of ThreeJS and HTMl elements (Typ 1):
https://jsfiddle.net/9tng8dp0/2/

Inspiration für die Start Szene (Typ 2):
https://www.youtube.com/watch?v=FntV9iEJ0tU (getFresnelMat.js = Typ 3 Quelle)
https://www.youtube.com/watch?v=JxXqPvZNQP4 (3D Text)

Model controls für Exploration Szene (Typ 2):
https://www.youtube.com/watch?v=C3s0UHpwlf8

Bild als displacementMap (Typ 2):
https://sbcode.net/threejs/displacmentmap/

Inspiration für die Länder-Polygon-Idee (Typ 1):
https://www.youtube.com/watch?v=f4zncVufL_I

Erstellen von 3D Mesh aus 2D Polygon(Typ 3):
https://stackoverflow.com/questions/74358515/how-to-draw-polygon-in-three-js-using-vertices

Raycaster zum Klicken von Objekten (Typ 2):
https://www.youtube.com/watch?v=XkZSAkjM4-A
