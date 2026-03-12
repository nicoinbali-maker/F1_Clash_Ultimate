# iOS Build Setup

Hinweis: Eine APK kann nicht auf iOS laufen. Fuer iOS wird eine native App (IPA) aus dem iOS-Projekt gebaut.

## Bereits im Projekt vorbereitet

- iOS-Plattform ist hinzugefuegt (`ios/` Ordner vorhanden)
- Capacitor iOS ist als Abhaengigkeit installiert
- npm Skripte vorhanden:
  - `npm run cap:sync:ios`
  - `npm run ios:open`

## Build auf macOS

1. Xcode aus dem App Store installieren.
2. CocoaPods installieren:
   - `sudo gem install cocoapods`
3. Im Projektverzeichnis:
   - `npm install`
   - `npm run cap:sync:ios`
   - `npm run ios:open`
4. In Xcode:
   - Signing Team setzen
   - Bundle Identifier pruefen
   - Zielgeraet oder Simulator waehlen
   - Build/Run starten

## Ausgabe

- TestFlight/App Store: Archiv in Xcode erstellen und hochladen.
- Ad-hoc/Enterprise: IPA ueber Xcode Export erzeugen.
