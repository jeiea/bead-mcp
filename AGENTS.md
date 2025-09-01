# AGENTS.md

에이전트가 이 저장소에서 작업 시 참고할 내용입니다.

## 프로젝트 개요

여러 기능을 제공하는 MCP 서버입니다.

## 주요 명령어

### 개발

```bash
# MCP 서버 실행
deno task run

# 테스트 실행
NO_COLOR=1 deno test --allow-all [파일명]

# 코드 포맷팅
deno fmt
```

## 아키텍처

### 핵심 구조

- **MCP 서버**: `src/server.ts`가 메인 진입점으로, ModelContextProtocol SDK를 사용하여 도구들을 등록
- **도구 구현**: 각 도구는 별도 모듈로 분리되어 있으며 테스트 파일 포함
  - `get_default_branch.ts`: Git 저장소의 기본 브랜치 확인
  - `get_provisional_pr_changes.ts`: PR 생성 시 변경사항 미리보기
- **Git 명령 래퍼**: `git_commands.ts`에서 Git 명령어 실행 유틸리티 제공
- **진입점**: `bin/main.ts`에서 서버 시작

### 기술 스택

- **런타임**: Deno (unstable temporal API 사용)

### 테스트

각 모듈은 대응하는 `.test.ts` 파일을 가지며, Deno의 내장 테스트 러너 사용
