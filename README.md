# 완주 소개 웹사이트

수능 여정·계획·집중·친구 응원을 소개하는 반응형 정적 웹사이트입니다. 앱은 출시 준비 중이며 체험의 날짜·기록·인물은 모두 가상 데이터입니다.

## 실행

빌드나 패키지 설치 없이 HTML/CSS/JavaScript로 실행합니다.

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

`http://127.0.0.1:8080`에서 확인합니다. 문법 검사는 `node --check app.js`로 실행합니다.

## 배포

공개 웹 전용 저장소: https://github.com/jobnomdeul/wanju-web

GitHub Pages: https://jobnomdeul.github.io/wanju-web/

Pages source는 `main` 브랜치의 `/`입니다. `.nojekyll`로 정적 파일을 그대로 게시합니다. 변경 파일을 main에 push한 후 Pages 빌드 성공과 실제 URL을 확인합니다. 앱 소스, 내부 문서, 비밀 키를 이 저장소에 추가하지 않습니다.

## 향후 도메인 연결

1. 구매한 도메인의 소유권을 GitHub에서 확인합니다. [공식 도메인 확인 안내](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
2. [GitHub 공식 DNS 안내](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)에 따라 DNS와 이 저장소의 Pages Custom domain을 설정합니다. 현재는 도메인이 없으므로 CNAME을 생성하지 않았습니다.
3. 확인된 새 주소로 `python3 scripts/set-site-url.py https://실제도메인/`을 실행해 canonical·OG·사이트맵·404 주소를 갱신합니다. 필요 시 Pages 설정이 생성한 CNAME을 커밋에 유지합니다.
4. 인증서 발급 후 Enforce HTTPS를 활성화하고 새 주소의 모든 리소스와 기존 Pages 주소의 리디렉션을 확인합니다.

모든 앱 리소스 경로는 상대 경로이므로 프로젝트 하위 경로와 도메인 루트에서 모두 동작합니다. 도메인 구매·DNS 변경은 위 스크립트가 수행하지 않습니다.

## 체험과 접근성

- 5개 화면 탭: 키보드 방향키·Home·End 지원
- 365일 가상 여정: 소수점 10자리 카운터, 표시 멈춤, 요청 시 현재 값 읽기
- 계획 체크·주간 날짜 선택·집중 타이머·주간 기록
- 원본 캐릭터 25종의 가로 스티커 띠와 별도 스티커 메시지
- 모바일 메뉴, FAQ, 스킵 링크, 포커스 표시, reduced-motion 지원
- 서버 전송·분석 도구·가입·쿠키·영구 저장 없음

원본 캐릭터와 로고는 완주의 제공 자산입니다. 이 저장소의 공개는 해당 이미지의 재사용 허가를 의미하지 않습니다. 실제 앱 출시 및 접근성 인증을 의미하는 체험이 아닙니다.
