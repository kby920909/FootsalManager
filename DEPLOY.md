# 풋살계엄령 배포 가이드

Git → GitHub → Vercel → Android APK까지 순서대로 진행하는 방법입니다.

---

## 1. Git으로 GitHub에 올리기 (상세)

이 단계에서는 로컬 프로젝트 폴더를 Git으로 관리하고, GitHub에 올리는 방법을 단계별로 설명합니다.

---

### 1-1. Git이 설치되어 있는지 확인

1. **Windows 키** 누르고 `cmd` 또는 `powershell` 입력 후 **명령 프롬프트** 또는 **PowerShell** 실행
2. 아래 명령 입력 후 엔터:
   ```text
   git --version
   ```
3. **나와야 하는 것**: `git version 2.xx.x` 같은 버전 번호
4. **"git은(는) 인식되지 않습니다"** 나오면:
   - [Git for Windows 다운로드](https://git-scm.com/download/win) 페이지에서 설치 파일 받기
   - 설치 시 **"Git from the command line and also from 3rd-party software"** 옵션 선택 (PATH에 추가됨)
   - 설치 후 **CMD/PowerShell을 다시 열고** `git --version` 다시 입력

---

### 1-2. Git 사용자 이름·이메일 설정 (처음 한 번만)

GitHub에 올릴 때 "누가 올렸는지" 표시되도록 설정합니다. **전역으로 한 번만** 하면 됩니다.

1. CMD 또는 PowerShell에서 아래 두 줄을 **한 줄씩** 입력 (따옴표 안을 본인 정보로 바꾸세요):
   ```powershell
   git config --global user.name "본인이름"
   git config --global user.email "github에_가입한_이메일@example.com"
   ```
2. 예시:
   ```powershell
   git config --global user.name "Hong Gildong"
   git config --global user.email "hong@gmail.com"
   ```
3. GitHub에 로그인할 때 쓰는 이메일과 맞추는 것이 좋습니다.

---

### 1-3. GitHub에서 저장소(Repository) 만들기

1. 브라우저에서 **[https://github.com](https://github.com)** 접속
2. **GitHub 계정이 없으면**:
   - **Sign up**으로 가입 (이메일 또는 다른 소셜 로그인 가능)
3. **로그인한 뒤**:
   - 오른쪽 **위** 검색창 옆에 **+** 버튼 클릭
   - **New repository** 선택
4. **Create a new repository** 화면에서:
   - **Repository name**: `toss-calendar-app` 입력 (다른 이름도 가능, 공백 없이)
   - **Description**: 비워도 됨 (예: "풋살계엄령 웹·앱" 등 입력 가능)
   - **Public** 선택 (무료로 공개 저장소)
   - **"Add a README file"**, **"Add .gitignore"** 등은 **체크하지 않음** (우리가 이미 로컬에 있음)
5. **Create repository** 버튼 클릭
6. 다음 화면이 나오면:
   - **"…or push an existing repository from the command line"** 안에 있는 주소를 복사합니다.
   - 예: `https://github.com/내아이디/toss-calendar-app.git`
   - **내아이디** 부분이 본인 GitHub 사용자 이름입니다. 이 주소는 아래 `git remote add origin`에서 씁니다.

---

### 1-4. 로컬 폴더를 Git 저장소로 만들고 커밋하기

1. **CMD 또는 PowerShell**을 엽니다.
2. 프로젝트가 있는 폴더로 이동합니다:
   ```powershell
   cd d:\Cursor\toss-calendar-app
   ```
   - 프로젝트를 다른 드라이브/경로에 두었다면 그 경로로 바꾸세요 (예: `cd e:\Projects\toss-calendar-app`).
3. 아래 명령을 **순서대로 하나씩** 실행합니다.

---

#### ① `git init` — 이 폴더를 Git 저장소로 만듦

```powershell
git init
```

- **의미**: 이 폴더 안에 `.git` 폴더가 생기고, "앞으로 변경 이력을 Git이 관리한다"는 뜻입니다.
- **한 번만** 하면 됩니다. 이미 `git init`을 한 적 있으면 "Reinitialized existing Git repository"라고 나올 수 있고, 그대로 진행해도 됩니다.

---

#### ② `git add .` — 올릴 파일들을 스테이징

```powershell
git add .
```

- **의미**: 현재 폴더(및 하위 폴더) 안의 **모든 파일**을 "다음 커밋에 포함시킬 목록"에 넣습니다.
- `.gitignore`에 있는 항목(예: `node_modules`, `build` 등)은 자동으로 제외됩니다.

---

#### ③ `git commit -m "메시지"` — 첫 번째 커밋 만들기

```powershell
git commit -m "Initial: 풋살계엄령 웹 + Android"
```

- **의미**: 지금 스테이징된 파일들로 "첫 번째 버전" 하나를 만듭니다. 메시지는 나중에 이 커밋이 뭔지 구분하는 용도입니다.
- **"nothing added to commit"** 나오면: `git add .`가 제대로 안 된 것이므로, 다시 `git add .` 후 `git commit`을 실행하세요.

---

#### ④ `git branch -M main` — 기본 브랜치 이름을 main으로

```powershell
git branch -M main
```

- **의미**: 기본 브랜치 이름을 `main`으로 바꿉니다. GitHub에서 새 저장소를 만들면 보통 `main` 브랜치를 쓰므로 맞춰 주는 단계입니다.

---

#### ⑤ `git remote add origin 주소` — GitHub 저장소 연결

```powershell
git remote add origin https://github.com/내아이디/toss-calendar-app.git
```

- **반드시** `내아이디`와 `toss-calendar-app`을 **1-3에서 만든 본인 저장소 주소**로 바꾸세요.
- 예: GitHub 아이디가 `myid`이고 저장소 이름이 `toss-calendar-app`이면  
  `https://github.com/myid/toss-calendar-app.git`
- **"remote origin already exists"** 나오면: 이미 연결된 상태입니다. 주소를 바꾸고 싶다면:
  ```powershell
  git remote set-url origin https://github.com/내아이디/저장소이름.git
  ```

---

#### ⑥ `git push -u origin main` — GitHub에 올리기

```powershell
git push -u origin main
```

- **의미**: 방금 만든 `main` 브랜치를 GitHub의 `origin`(위에서 연결한 저장소)에 올립니다. `-u`는 "앞으로 `git push`만 쳐도 이 저장소·브랜치로 올리게 하라"는 설정입니다.

---

### 1-5. 푸시할 때 로그인/인증이 나오는 경우

- **브라우저가 뜨는 경우**: GitHub 로그인 화면에서 로그인하면 푸시가 진행됩니다.
- **"Support for password authentication was removed"** 같은 메시지가 나오면: 비밀번호로는 더 이상 푸시가 안 되므로, **Personal Access Token(PAT)**을 써야 합니다.
  1. GitHub 웹에서 **우측 상단 프로필 사진** → **Settings**
  2. 왼쪽 맨 아래 **Developer settings** → **Personal access tokens** → **Tokens (classic)**
  3. **Generate new token (classic)** → Note에 `vercel-deploy` 등 아무 이름 → Expiration 설정 → **repo** 권한 체크 → 생성
  4. 생성된 토큰을 **한 번만** 복사해 두고, 푸시할 때 **비밀번호 대신** 이 토큰을 붙여넣기합니다 (Username은 GitHub 아이디).

푸시가 끝나면 GitHub 저장소 페이지를 새로고침했을 때 `web`, `android` 등 폴더와 파일들이 보이면 **1번 단계는 완료**입니다.

---

## 2. Vercel에 배포하기

### 2-1. Vercel 가입 및 프로젝트 가져오기

1. [Vercel](https://vercel.com) 접속 → **Sign Up** (GitHub 계정으로 로그인 권장)
2. 로그인 후 **Add New...** → **Project**
3. **Import Git Repository**에서 방금 올린 `toss-calendar-app` 선택 후 **Import**

### 2-2. 빌드 설정 (중요)

- **Root Directory**: **Edit** 클릭 → `web` 입력 후 선택 (웹 앱이 `web` 폴더에 있음)
- **Framework Preset**: Vite (자동 감지될 수 있음)
- **Build Command**: `npm run build` (기본값 유지)
- **Output Directory**: `dist` (기본값 유지)
- **Install Command**: `npm install` (기본값 유지)

### 2-3. 배포 실행

- **Deploy** 버튼 클릭
- 1~2분 후 배포 완료되면 **Visit** 로 접속 가능한 URL이 생김 (예: `https://toss-calendar-app-xxx.vercel.app`)

이후 GitHub에 `main` 브랜치를 푸시할 때마다 Vercel이 자동으로 다시 배포합니다.

---

## 3. Android APK 파일 만들기

### 3-1. 필요한 것

- **Android Studio** (권장) 또는 **JDK 17 + Android SDK**가 설치된 환경

### 3-2. Android Studio로 열기 (가장 쉬운 방법)

1. Android Studio 실행
2. **File** → **Open** → `d:\Cursor\toss-calendar-app\android` 폴더 선택
3. **Gradle Sync**가 끝날 때까지 대기 (처음엔 의존성 다운로드로 시간 걸릴 수 있음)
4. 상단 메뉴 **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
5. 빌드 완료 후 **locate** 링크 클릭하거나, 아래 경로에서 APK 확인:

```
d:\Cursor\toss-calendar-app\android\app\build\outputs\apk\debug\app-debug.apk
```

이 파일을 폰에 복사해 설치하면 됩니다.

### 3-3. 터미널(CMD)에서 APK만 빌드하기

Gradle Wrapper가 이미 있거나 Android Studio로 한 번이라도 연 적이 있다면:

```powershell
cd d:\Cursor\toss-calendar-app\android
.\gradlew assembleDebug
```

- `gradlew`가 없다고 나오면: Android Studio로 `android` 폴더를 한 번 열어서 Gradle Sync 후 다시 시도
- APK 위치: `android\app\build\outputs\apk\debug\app-debug.apk`

### 3-4. (선택) 릴리즈 APK – 서명해서 배포용으로 만들기

- 디버그 APK는 테스트용, 스토어/공유용은 **릴리즈 APK + 서명**이 필요합니다.
- Android Studio: **Build** → **Generate Signed Bundle / APK** → **APK** 선택 후 키스토어 생성·설정 후 빌드하면 `app-release.apk`가 생성됩니다.

---

## 요약 체크리스트

| 단계 | 할 일 |
|------|--------|
| 1 | GitHub에 새 저장소 생성 |
| 2 | `git init` → `git add .` → `git commit` → `git remote add origin` → `git push` |
| 3 | Vercel에서 해당 저장소 Import, **Root Directory = `web`** 설정 후 Deploy |
| 4 | Android Studio로 `android` 폴더 열기 → Build APK(s) 또는 터미널에서 `.\gradlew assembleDebug` |
| 5 | `app-debug.apk`를 폰에 복사해 설치 |

이 순서대로 하시면 웹은 Vercel에서, 앱은 APK로 사용할 수 있습니다.
