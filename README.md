# 풋살계엄령 (Toss 스타일 달력)

토스형 달력 UI의 **웹 앱**과 **Android 네이티브 앱** 프로젝트입니다.

**배포 순서 가이드**: Git → GitHub → Vercel → Android APK는 **[DEPLOY.md](./DEPLOY.md)** 를 보세요.

- **웹**: Vite + React, 토스형 달력 UI (현재 월: 2026년 3월)
- **Android**: Kotlin 네이티브 앱, 동일한 토스 스타일 달력 → APK 빌드 가능
- **배포**: 웹은 GitHub 푸시 후 Vercel에서 실서버 배포 (DB 없음, 프론트만)

---

## 프로젝트 구조

```
toss-calendar-app/
├── web/                 # Vercel 배포용 웹 (Vite + React)
│   ├── src/
│   │   ├── components/  # TossCalendar 컴포넌트
│   │   └── ...
│   ├── package.json
│   └── vercel.json
├── android/             # Android 네이티브 (Kotlin)
│   ├── app/
│   │   └── src/main/
│   ├── build.gradle.kts
│   └── settings.gradle.kts
├── .gitignore
└── README.md
```

---

## 웹 (Vercel 배포)

1. **로컬 실행**
   ```bash
   cd web
   npm install
   npm run dev
   ```

2. **빌드**
   ```bash
   cd web
   npm run build
   ```
   결과물: `web/dist/`

3. **Vercel 배포**
   - GitHub에 이 저장소 푸시
   - [Vercel](https://vercel.com)에서 New Project → 저장소 선택
   - **Root Directory**를 `web`으로 설정
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Deploy 후 실서버 URL에서 달력 확인

---

## Android 앱 (APK 빌드)

1. **환경**
   - Android Studio 또는 JDK 17 + Android SDK
   - `ANDROID_HOME` 설정 권장

2. **Gradle Wrapper 생성 (최초 1회)**  
   Android Studio로 `android` 폴더를 열면 자동 생성됩니다. 또는:
   ```bash
   cd android
   gradle wrapper
   ```

3. **디버그 APK 빌드**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   APK 위치: `android/app/build/outputs/apk/debug/app-debug.apk`

4. **릴리즈 APK (서명 필요)**
   - `app/build.gradle.kts`에 signingConfig 설정 후:
   ```bash
   ./gradlew assembleRelease
   ```

---

## Git & GitHub

```bash
cd d:\Cursor\toss-calendar-app
git init
git add .
git commit -m "Initial: Toss calendar web + Android native"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/toss-calendar-app.git
git push -u origin main
```

이후 Vercel에서 위 저장소 연결 후 Root Directory만 `web`으로 지정하면 됩니다.
