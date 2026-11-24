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

공식 주소(DNS/HTTPS 연결 완료): https://wanju.jobnomdeul.com/

기존 GitHub Pages 주소: https://jobnomdeul.github.io/wanju-web/

Pages source는 `main` 브랜치의 `/`입니다. `.nojekyll`로 정적 파일을 그대로 게시합니다. 변경 파일을 main에 push한 후 Pages 빌드 성공과 실제 URL을 확인합니다. 앱 소스, 내부 문서, 비밀 키를 이 저장소에 추가하지 않습니다.

## 도메인 연결

1. 구매한 도메인의 소유권을 GitHub에서 확인합니다. [공식 도메인 확인 안내](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
2. [GitHub 공식 DNS 안내](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)에 따라 DNS와 이 저장소의 Pages Custom domain을 `wanju.jobnomdeul.com`으로 설정합니다. 저장소의 `CNAME`에도 이 호스트명을 유지합니다. 루트 `jobnomdeul.com`은 팀 웹사이트용이며 완주 주소로 사용하지 않습니다.
3. canonical·OG·사이트맵·404·문의 화면의 주소는 `https://wanju.jobnomdeul.com/`으로 준비돼 있습니다. 향후 주소 변경 시 `python3 scripts/set-site-url.py https://실제도메인/`을 실행합니다. 이 파일 변경만으로 DNS·Pages 설정·실제 배포 완료를 뜻하지 않습니다.
4. 인증서 발급 후 Enforce HTTPS를 활성화하고 새 주소의 모든 리소스와 기존 Pages 주소의 리디렉션을 확인합니다.

모든 앱 리소스 경로는 상대 경로이므로 프로젝트 하위 경로와 도메인 루트에서 모두 동작합니다. 도메인 구매·DNS 변경은 위 스크립트가 수행하지 않습니다.

## 장면 구성과 조작

- 5개 화면 탭: 키보드 방향키·Home·End 지원
- 남은 시간·앱 둘러보기·잠금화면·친구 응원·출시 안내의 다섯 장면
- 소수점 10자리 카운터, 제공 캐릭터 프로필과 구체적인 친구·공부 기록
- 계획 체크·주간 날짜 선택·집중 타이머·주간 기록
- 원본 캐릭터 25종의 가로 스티커 띠와 별도 스티커 메시지
- CSS 원근·금속 테두리·조명·그림자로 만든 일반 휴대폰 내부의 화면
- 데스크톱 바깥 휠은 일정량을 넘기면 다음 장면, 폰 내부는 자체 목록 스크롤
- 모바일·긴 화면·키보드는 자연 스크롤과 CSS proximity snap, 헤더로 장면 직접 이동
- 모바일 메뉴, 스킵 링크, 포커스 표시, OS reduced-motion/reduced-transparency 자동 반영
- 소개 웹 체험은 서버 전송·분석 도구·가입·쿠키·영구 저장 없음

원본 캐릭터와 로고는 완주의 제공 자산입니다. 이 저장소의 공개는 해당 이미지의 재사용 허가를 의미하지 않습니다. 실제 앱 출시 및 접근성 인증을 의미하는 체험이 아닙니다.

## 운영자 진입

`/admin/`은 소개 웹의 가상 체험과 별도인 실제 운영자 클라이언트입니다. Supabase의 역할과 2단계 인증이 있어야 운영 데이터를 읽거나 변경할 수 있습니다. 공개 정적 파일에는 URL과 공개 키만 있고 서비스 키는 없습니다. [운영 사이트 안내](../admin/README.md)를 따릅니다.

서체와 투명 스티커는 로컬 자산으로 제공하며 Google Fonts에 런타임 요청하지 않습니다. 글꼴 라이선스는 `assets/fonts/OFL.txt`입니다.

## UX10 장면 재구성 · 2026-11-24

반복 설명·개발 경계 FAQ·숫자 정지·투명도 조작 버튼·계산 설명·GitHub/운영자 진입 링크를 소개 경로에서 제거했습니다. 운영 서비스 자체는 기존 주소에서 유지합니다. 가상 데이터의 처리 범위는 개인정보 안내에 둡니다. 잠금화면도 배경·시계·진행 중 공부 카드가 보이는 휴대폰 안에 배치합니다.

공식 Apple/Google 배지는 `assets/app-store.svg`와 `assets/google-play.png`에 원본으로 보관합니다. 실제 스토어 상품 주소가 확정되기 전에는 클릭 시 출시 준비 상태를 표시합니다. 없는 다운로드 링크를 연결하거나 실제로 설치됐다고 표시하지 않습니다. [Apple 배지 안내](https://developer.apple.com/app-store/marketing/guidelines/) · [Google 배지 안내](https://partnermarketinghub.withgoogle.com/brands/google-play/google-play/lockups-icons-badges/).

## UX11 폰 조작과 메뉴

폰 표면을 직접 드래그하면 좌우360도/상하35도로 돌릴 수 있습니다. 별도 회전 버튼은 없습니다. 폰에 초점을 둔 방향키로 각도를 조절하고 Home/Escape 또는 본문 더블클릭으로 원위치로 돌아갑니다. 버튼·입력·프로필 스와이프·스티커 띠는 회전에서 제외합니다. 세로 터치와 내부 휠 스크롤은 유지합니다. 옆면 근처에서 놓으면 가까운 앞/뒷면으로 정착합니다. 측면 전원은 화면 켜기/끄기, 음량·무음 버튼은 폰 안에서만 피드백을 표시합니다. 실제 기기 설정이나 앱 데이터를 바꾸지 않습니다. 상단 메뉴는 개인정보 안내·이용/계정 안내·문의입니다.

UX12에서는 둥근 외곽에 맞춰 이어진 측면52개로 프레임을 교체해 옆면의 분리·틈을 수정했습니다. 정면/뒷면뿐 아니라90도와 중간 각도를 검수합니다.

## UX13 한 대의 폰으로 둘러보기

사이트 전체에서 폰 한 대가 같은 위치에 머뭅니다. 스크롤하면 이야기와 폰 화면이 바뀌고, 폰의 탭이나 기능을 직접 누르면 주변 설명·배경이 그 선택에 맞춰 바뀝니다. 공부 시작, 프로필 전환, 친구 응원과 잠금화면 카드도 연결됩니다. 같은 모델을 유지해 회전·하드웨어 상태가 사라지지 않으며, 가상 계획·타이머·대화는 현재 탭 메모리에서 이어집니다. 모바일에서는 핵심 문구와 폰을 우선 배치합니다.
