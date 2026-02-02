# ⚡ WordFlow App

App Android de fixação de vocabulário inglês usando repetição espaçada científica.

## Stack
- **Frontend:** React Native + Expo SDK 54 + TypeScript + Expo Router
- **Backend:** Supabase (PostgreSQL + Edge Functions + Auth)
- **Push:** Expo Push Notifications
- **Áudio:** Google Cloud TTS (OGG_OPUS)

## Setup Rápido

```bash
# 1. Extrair o projeto
tar xzf wordflow-app.tar.gz
cd wordflow-app

# 2. Instalar dependências
npm install

# 3. Rodar no Expo Go
npx expo start

# 4. Escanear QR Code no app Expo Go (Android)
```

## Estrutura

```
wordflow-app/
├── app/                    # Expo Router (telas)
│   ├── _layout.tsx         # Root layout + Auth context
│   ├── index.tsx           # Redirect
│   ├── auth/               # Login + Register
│   ├── onboarding/         # Caderno → Avaliação → Resultado → Preferências
│   └── (tabs)/             # Home + Progress + Notebooks + Settings
├── services/               # Supabase client + Auth + Session
├── hooks/                  # useAuth
├── constants/              # Colors + Config
├── types/                  # TypeScript types
├── components/             # Componentes reutilizáveis (a criar)
├── app.json                # Config Expo
├── eas.json                # Config EAS Build
└── package.json
```

## Fluxo de Navegação

```
App Abre
├── Não logado → auth/login
│   ├── Login (email/senha)
│   └── Register → onboarding/
│       ├── choose-notebook (escolher caderno)
│       ├── assessment (avaliação nível = CADERNO PADRÃO)
│       ├── result (nível detectado)
│       └── preferences (horário + finaliza)
└── Logado → (tabs)/
    ├── home (sessão de frases - PRINCIPAL)
    ├── progress (dashboard métricas)
    ├── notebooks (trocar caderno)
    └── settings (config + logout)
```

## Supabase (já configurado)
- URL: `https://iashlxsgjxzlquxliqab.supabase.co`
- Banco populado: 607 frases padrão + 303 temáticas (7 cadernos)
- Edge Functions deployadas

## Próximos Passos

### Edge Functions a criar (backend):
1. `iniciar-sessao-app` - Cria sessão e retorna frases
2. `responder-frase-app` - Processa resposta e retorna feedback
3. `enviar-push` - Envia push via Expo Push API

### Features a implementar:
- [ ] Player de áudio (pronúncia)
- [ ] Push notifications (registrar token + cron)
- [ ] Animações nas transições
- [ ] Gráficos no dashboard
- [ ] Build EAS + publicar Google Play

## Build Android

```bash
# Preview (APK para testar)
eas build --platform android --profile preview

# Produção (AAB para Google Play)
eas build --platform android --profile production
```
