# Firebase Setup (Auth + Firestore)

## 1. Firebase Projekt vorbereiten
- Firebase Projekt erstellen.
- Firestore Database aktivieren (Native Mode).
- Authentication aktivieren.
- Sign-in Methode: `Email/Password` aktivieren.

## 2. Firestore Rules deployen
Im Projektordner:

```bash
firebase login
firebase use --add
firebase deploy --only firestore:rules
```

Die verwendeten Regeln stehen in `firestore.rules` und erzwingen:
- nur authentifizierte Zugriffe
- Zugriff nur auf Dokumente mit `ownerUid == request.auth.uid`

## 3. App konfigurieren
In der Sync-Seite:
- `Firebase Project ID`
- `Firebase Web API Key`

Dann:
- `Account erstellen` oder `Login`
- optional `Auto-Sync bei Änderungen` aktiv lassen
- `Cloud speichern (Firebase)` / `Cloud laden (Firebase)` nutzen

## 4. Gespeicherte Daten
- Profil (inkl. Team/Solo)
- Teile-Inventar + Part-Meta (Level/Mod)
- Fahrer-Stages
- Manuelle Setups pro Strecke
- Community-Knowledge
- Fortschritts-Zusammenfassung

## Hinweise
- Das Dokument liegt unter `playerProfiles/{uid}_{profileId}`.
- Bei abgelaufenem Token wird automatisch per Refresh Token erneuert.
