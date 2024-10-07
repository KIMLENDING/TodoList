# Todo List Application

## 프로젝트 설명

이 프로젝트는 사용자들이 할 일을 관리하고, 루틴을 설정하며, 날짜별로 Todo를 시각적으로 확인할 수 있는 ToDo List 웹 애플리케이션입니다. 주요 기능으로는 Todo 생성, 진행 상황 확인, 루틴 관리, 달력 기반 Todo 확인 등이 있으며, **Next.js**와 **Convex**, **Clerk**, **Vercel**, **TypeScript** 등의 최신 기술을 사용해 개발되었습니다.

## 주요 기능

### 1. 홈 페이지

- **검색**: 입력한 검색어에 맞는 Todo 목록을 필터링해 보여줍니다.
- **상황판**: 모든 Todo의 진행 상태(진행, 완료, 실패)를 그래프로 시각화하여 보여줍니다.
- **필터링**: 카테고리와 우선순위를 기준으로 Todo를 필터링하여 원하는 작업을 빠르게 찾을 수 있습니다.
- **날짜 선택**: 선택한 기간에 생성된 Todo를 보여줍니다.

### 2. 루틴 페이지

- **대제목/소제목 구조**: 대제목(시간대)으로 루틴을 나누고, 그 안에서 소제목(해야 할 행동)을 정의할 수 있습니다.
- **드래그 앤 드롭(DnD)**: 대제목 안에서 소제목을 이동하거나, 대제목끼리 순서를 변경할 수 있습니다.

### 3. Todo 목록 페이지

- **Todo 카드**: 각 Todo 카드는 제목, 진행도, 첨부 파일, 생성일자, 카테고리, 우선순위를 보여줍니다.
- **상태 변경 버튼**: Todo의 상태를 진행, 완료, 실패 중 하나로 변경할 수 있습니다.
- **애니메이션**: 처음 렌더링될 때 카드들이 좌우로 흔들리는 애니메이션이 적용되며, 화면에 보이는 순간 애니메이션이 작동하도록 설계되었습니다.

### 4. Todo 생성 페이지

- **Todo 생성**: 제목, 설명, 기간, 카테고리, 우선순위, 태그, 첨부 파일을 입력할 수 있으며, 제목은 필수 항목입니다.

### 5. 캘린더 페이지

- **달력 기반 시각화**: 12개월의 달력을 카드 형식으로 보여주며, 각 날짜별로 작성된 Todo가 색깔(진한 초록에서 연한 초록으로 변화)로 표시됩니다.
- **Todo 보기**: 각 날짜를 클릭하면 그날 생성된 Todo를 확인할 수 있습니다.

## 기술 스택

- **프론트엔드**: Next.js, React, TypeScript
- **상태 관리**: Zustand
- **유저 인증**: Clerk
- **백엔드**: Convex
- **애니메이션**: TailwindCSS 및 Radix UI
- **배포**: Vercel
- **기타**: React Beautiful DnD, React Hook Form, Day.js, Date-fns, Zod, Lucide Icons

## env.local

```
`convex`

CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

`Clerk`

CLERK_JWT_ISSUER_DOMAIN=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL='/sign-in'
NEXT_PUBLIC_CLERK_SIGN_UP_URL='/sign-up'
```
