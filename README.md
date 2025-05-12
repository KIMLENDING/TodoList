# Todo List Application

## 프로젝트 설명

이 프로젝트는 사용자들이 할 일을 관리하고, 루틴을 설정하며, 날짜별로 Todo를 시각적으로 확인할 수 있는 ToDo List 웹 애플리케이션입니다. 주요 기능으로는 Todo 생성, 진행 상황 확인, 루틴 관리, 달력 기반 Todo 확인 등이 있으며, **Next.js**와 **Convex**, **Clerk**, **Vercel**, **TypeScript** 등의 최신 기술을 사용해 개발되었습니다.

### 아키텍처 개요

- **프론트엔드**: Next.js 14 App Router 아키텍처를 채택하여 서버 컴포넌트와 클라이언트 컴포넌트의 장점을 모두 활용
- **백엔드 및 데이터베이스**: Convex를 활용한 서버리스 백엔드로, 실시간 데이터 동기화 구현
- **인증**: Clerk을 통한 안전한 사용자 인증 및 관리
- **스토리지**: Convex Storage를 활용한 파일 업로드 및 관리 시스템

## 주요 기능

### 1. 홈 페이지

- **검색**:
  - Convex 백엔드의 검색 인덱스를 활용한 실시간 검색 기능
  - `search_title`, `search_Description`, `search_Completed` 인덱스 활용
  - 디바운싱 처리를 통한 최적화된 검색 경험
- **상황판**:
  - Progress 컴포넌트를 활용한 진행 상태 시각화
  - 동적 데이터 집계를 통한 실시간 상태 업데이트
  - 애니메이션 효과로 상태 변화 시각화
- **필터링**:
  - 우선순위(상/중/하)와 카테고리에 따른 동적 필터링
  - 복합 필터링 지원으로 다양한 조건 조합 가능
- **날짜 선택**:
  - Date-fns 및 React Day Picker를 활용한 날짜 범위 선택
  - 유연한 기간 필터링 지원

### 2. 루틴 페이지

- **대제목/소제목 구조**:
  - 계층적 데이터 구조를 통한 루틴 관리
  - 중첩된 객체 배열을 활용한 복잡한 계층 구조 구현
  - 데이터베이스 스키마에 `routines` 테이블과 중첩된 `routineItmes` 설계
- **드래그 앤 드롭(DnD)**:
  - React Beautiful DnD 라이브러리 활용
  - 다중 컨텍스트 드래그 앤 드롭 구현 (대제목 간 이동, 소제목 간 이동)
  - 배치 처리를 통한 데이터 업데이트 최적화
  - indexDB 필드를 활용한 정렬 순서 유지
- **00시에 루틴 상태 초기화**:
  - Convex 서버리스 함수를 활용한 자동화된 루틴 초기화
  - updateAt 타임스탬프 기반 상태 관리
  - 타임존(UTC +9) 고려한 시간 계산 로직 구현

### 3. Todo 목록 페이지

- **Todo 카드**:
  - 컴포넌트 기반 카드 디자인으로 정보 시각화
  - Radix UI 기반 UI 컴포넌트 활용
  - 동적 데이터 표시와 조건부 렌더링
  - 첨부 파일 미리보기 및 관리 기능
- **상태 변경 버튼**:
  - Convex mutation을 활용한 실시간 상태 업데이트
  - 낙관적 UI 업데이트(Optimistic Updates) 구현
  - 각 상태별 시각적 피드백 제공
- **애니메이션**:
  - React Intersection Observer를 사용한 뷰포트 기반 애니메이션
  - CSS 트랜지션과 TailwindCSS Animate 활용
  - 성능 최적화를 위한 지연 로딩 및 애니메이션 제어

### 4. Todo 생성 페이지

- **Todo 생성**:
  - 제목, 설명, 기간, 카테고리, 우선순위, 태그, 첨부 파일을 입력할 수 있으며, 제목은 필수 항목
  - React Hook Form과 Zod 스키마를 활용한 폼 유효성 검사
  - 직관적인 UI와 즉각적인 사용자 피드백 제공
  - 파일 첨부 기능과 실시간 미리보기 지원

### 5. 캘린더 페이지

- **달력 시각화**:
  - CSS Grid 기반 12개월 달력 레이아웃 구현
  - 데이터 집계를 통한 색상 그라데이션 매핑
  - Date-fns 라이브러리를 활용한 날짜 계산 및 포맷팅
- **반응형 디자인**:
  - 다양한 화면 크기에 최적화된 그리드 레이아웃
  - 모바일 친화적 인터페이스와 제스처 지원
- **Todo 상호작용**:
  - 날짜별 Todo 데이터 필터링 및 표시
  - 모달 기반 상세 정보 표시
  - 상태 변경 기능 통합

## 기술적 구현 세부사항

### 데이터 모델 및 스키마 설계

- **Convex 데이터 모델링**:
  - 유연한 스키마 정의로 복잡한 Todo 객체 구조 지원
  - 중첩된 필드와 조건부 타입 활용으로 다양한 데이터 포맷 처리
  - 검색 인덱스를 활용한 효율적인 쿼리 최적화

```typescript
// 효율적인 검색을 위한 인덱스 설정
.searchIndex('search_title', { searchField: 'todoTitle' })
.searchIndex('search_Description', { searchField: 'todoDescription' })
.searchIndex('search_Completed', { searchField: 'isCompleted' })
```

- **루틴 데이터 구조**:
  - 계층적 구조를 위한 중첩 객체 배열 패턴 적용
  - 고유 식별자(dndId)로 드래그 앤 드롭 작업 추적
  - 정렬 순서를 유지하기 위한 indexDB 필드 활용

```typescript
routines: defineTable({
  // ...
  dndId: v.string(), // 클라이언트에서 dnd를 위한 아이디
  indexDB: v.number(), // 정렬 순서 유지를 위한 인덱스
  routineItmes: v.optional(
    v.array(
      v.object({
        dndId: v.string(), // 하위 항목 식별자
        indexDB: v.number(), // 하위 항목 정렬 순서
        // ...기타 필드
      })
    )
  ),
});
```

- **Todo 데이터 구조**:
  - 스키마 기반의 강력한 타입 정의
  - 첨부 파일과 메타데이터를 위한 중첩 객체 설계
  - 상태 관리를 위한 타임스탬프 추적

```typescript
todos: defineTable({
  // 사용자 정보 필드
  user: v.id("users"),
  author: v.string(),
  authorId: v.string(),
  authorImageUrl: v.string(),

  // Todo 컨텐츠 필드
  todoTitle: v.string(),
  todoDescription: v.optional(v.string()),

  // 일정 및 상태 관리 필드
  dueDate: v.optional(
    v.object({ from: v.optional(v.number()), to: v.optional(v.number()) })
  ),
  isCompleted: v.string(),
  completedAt: v.optional(v.number()),

  // 분류 및 태깅
  priority: v.optional(v.string()),
  category: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),

  // 첨부 파일 관리
  attachments: v.optional(
    v.object({
      // 첨부 파일 관련 필드들
    })
  ),
});
```

### 프론트엔드 컴포넌트 아키텍처

- **컴포넌트 계층 구조**:

  - 기능별 책임 분리를 통한 모듈화된 컴포넌트 설계
  - 재사용 가능한 UI 컴포넌트와 비즈니스 로직 분리
  - Compound 컴포넌트 패턴을 활용한 유연한 UI 구성

- **상태 관리 전략**:
  - 로컬 상태와 전역 상태의 명확한 분리
  - Zustand를 활용한 경량화된 전역 상태 관리
  - React Hook Form과 Zod를 조합한 강력한 폼 검증 시스템

```typescript
// Zustand를 이용한 루틴 상태 관리 예시
const useRoutineStore = create<RoutineStore>()((set) => ({
  mockData: [],
  setMockData: (data) => set({ mockData: data }),
  handleDelet2: (mockId) =>
    set((state) => {
      const newMockData = state.mockData.filter(
        (r: Routines) => r.dndId !== mockId
      );
      return { mockData: newMockData };
    }),
  // ...다른 상태 관리 함수들
}));
```

- **복잡한 UI 패턴 구현**:
  - 드래그 앤 드롭 인터페이스를 위한 다차원 배열 관리
  - 스크롤 동작과 뷰포트 변화에 대응하는 반응형 레이아웃
  - 계층형 데이터 시각화를 위한 중첩 컴포넌트 설계

```typescript
// 2차원 배열로 데이터 구조화하는 예시
const chunkedMockData = chunkArray(mockData, windowSize.width, maxItemsPerRow);

// 레이아웃 구조에 맞게 컴포넌트 렌더링
{chunkedMockData.map((chunk, chunkIndex) => (
  <Droppable key={`row-${chunkIndex}`} droppableId={`row-${chunkIndex}`} type="GROUP">
    {(provided) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {chunk.map((item, index) => (
          <Draggable key={item.dndId} draggableId={item.dndId} index={index}>
            {/* 아이템 렌더링 로직 */}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
))}
```

### 반응형 디자인과 애니메이션

- **뷰포트 기반 애니메이션**:
  - Intersection Observer API를 활용한 성능 최적화
  - 조건부 애니메이션으로 시각적 계층 구조 강화

```typescript
const { ref, inView } = useInView({
    threshold: 0.2, // 20% 노출 시 활성화
    triggerOnce: true, // 최초 한 번만 실행
});

// 뷰포트 기반 애니메이션 적용
<section ref={ref} className={cn(
    'reveal', {
        'animate-rotate': index! % 2 !== 0 && inView,
        'animate-rotateAlt': index! % 2 === 0 && inView,
    }
)}>
```

- **유틸리티 기반 스타일링**:
  - TailwindCSS와 Class Variance Authority를 활용한 일관된 디자인 시스템
  - clsx와 tailwind-merge를 통한 조건부 클래스 관리

```typescript
// 유틸리티 함수를 통한 조건부 클래스 관리
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- **다이나믹 UI 트랜지션**:
  - 사용자 상호작용에 응답하는 부드러운 애니메이션
  - 컴포넌트 상태 전환을 위한 시각적 피드백
  - 애니메이션 타이밍과 이징 함수의 세밀한 제어

```typescript
// 타일 애니메이션 예시 (캘린더 컴포넌트)
const handleLoadIn = () => {
    setTimeout(() => {
        setLoadIn(false);
    }, 1200);
};

useEffect(() => {
    handleLoadIn();
}, []);

// 애니메이션 클래스 적용
<div className={cn(
    "tile",
    {
        "animate-revealSm": !loadIn,
        "opacity-0": loadIn,
        "bg-gradient-to-b from-amber-400 to-amber-600": hasEvents,
    }
)}>
```

### 최적화 기법

- **비동기 데이터 처리**:

  - 지연 로딩 및 디바운싱 기법으로 불필요한 API 호출 감소
  - 낙관적 UI 업데이트로 사용자 인터페이스 반응성 향상

- **성능 최적화**:
  - 메모이제이션을 통한 불필요한 렌더링 방지
  - 가상화(virtualization) 기법으로 대량 데이터 처리 최적화
  - 레이아웃 스래싱 방지를 위한 useLayoutEffect 활용

```typescript
// useLayoutEffect를 사용한 DOM 측정 최적화
useLayoutEffect(() => {
  const initialSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  setWindowSize(initialSize);
  // ...
}, []);
```

- **배치 처리 최적화**:
  - 루틴 상태 변경 시 배치 처리를 통한 성능 향상
  - 드래그 앤 드롭 이벤트 최적화를 위한 requestAnimationFrame 활용

```typescript
// requestAnimationFrame을 활용한 드래그 앤 드롭 최적화
useEffect(() => {
  const animation = requestAnimationFrame(() => setEnabled(true));
  return () => {
    cancelAnimationFrame(animation);
    setEnabled(false);
  };
}, []);
```

- **조건부 렌더링 최적화**:
  - 조기 리턴 패턴을 통한 불필요한 렌더링 방지
  - 컴포넌트 초기화 상태 관리로 렌더링 사이클 제어
  - 조건부 스타일링을 통한 레이아웃 계산 최소화

```typescript
// 초기화 완료 후에만 컴포넌트 렌더링
if (!initialized) {
  return null;
}

// 드래그 앤 드롭 활성화 전에는 렌더링하지 않음
if (!enabled) {
  return null;
}
```

### 사용자 경험(UX) 최적화

- **로딩 상태 관리**:
  - 직관적인 로딩 인디케이터를 통한 사용자 피드백 제공
  - 스켈레톤 UI와 점진적 로딩으로 인지된 성능 향상
  - 비동기 작업 상태에 따른 UI 상태 전환

```typescript
// 로딩 상태에 따른 버튼 변화 예시
<Button type="submit" disabled={isLoading}>
    {isLoading ? (
        <div className="flex items-center font-medium">
            Creating...
            <Loader size={20} className="animate-spin ml-2" />
        </div>
    ) : 'Create Todo'}
</Button>
```

- **오류 처리 및 복구 전략**:
  - 사용자 친화적인 오류 메시지 및 복구 옵션 제공
  - 폼 유효성 검사 피드백으로 사용자 입력 가이드
  - 네트워크 오류 시 자동 재시도 및 상태 복구 매커니즘

```typescript
// 폼 유효성 검사 및 오류 메시지 예시
<FormField
    control={form.control}
    name="todoTitle"
    render={({ field }) => (
        <FormItem>
            <FormLabel>제목</FormLabel>
            <FormControl>
                <Input placeholder="제목" {...field} />
            </FormControl>
            <FormMessage className="text-red-300" />
        </FormItem>
    )}
/>
```

## 기술 스택

### 프론트엔드

- **프레임워크**: Next.js 14 (App Router), React 18, TypeScript
- **UI/스타일링**:
  - TailwindCSS - 유틸리티 기반 CSS 프레임워크
  - Radix UI - 접근성 높은 UI 컴포넌트 라이브러리
  - Lucide Icons - 아이콘 시스템
  - Class Variance Authority (CVA) - 컴포넌트 스타일 변형 관리
- **상태 관리**:
  - Zustand - 가볍고 효율적인 상태 관리 라이브러리
- **폼 관리 및 유효성 검사**:
  - React Hook Form - 성능 중심의 폼 관리
  - Zod - 스키마 기반 유효성 검사
- **날짜/시간 처리**:
  - Date-fns - 날짜 조작 및 형식화
  - Day.js - 경량 날짜 처리 라이브러리
  - React Day Picker - 날짜 선택 컴포넌트
- **애니메이션 및 UI 인터랙션**:
  - React Beautiful DnD - 드래그 앤 드롭 기능
  - React Intersection Observer - 요소 가시성 감지
  - TailwindCSS Animate - 애니메이션 유틸리티

### 백엔드

- **데이터베이스 및 API**:
  - Convex - 서버리스 백엔드 솔루션
  - Schema 기반 데이터 모델링
  - 실시간 데이터 동기화
  - 파일 스토리지 시스템
- **인증 및 권한 관리**:
  - Clerk - 사용자 인증 및 세션 관리
  - Svix - 웹훅 처리

### 개발 도구 및 배포

- **배포 플랫폼**: Vercel - 자동화된 CI/CD 파이프라인
- **유틸리티 라이브러리**:
  - UUID - 고유 식별자 생성
  - CLSX/Tailwind-merge - 조건부 클래스 관리

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
