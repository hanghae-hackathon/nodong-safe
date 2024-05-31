# 안전한 근로 계약을 위한 근로 계약서 검토 AI

## Description

본인의 근로계약서를 업로드하면, 몇 초만에 당신의 계약 상태를 점검 해줍니다!

## 화면 기획

https://www.figma.com/design/9fRigTXnACQud4qYz0wYAG/Untitled?node-id=0-1&t=5DWsodp22NzPsCBq-1

## 유저 스토리

1. 앱에 접속하여 근로 계약서를 업로드 한다.
2. Nodo AI가 "안녕하세요. 반갑습니다! 현재 근로 계약 상황에 대해 더 자세하게 설명해주세요."라고 채팅을 보냄.
3. 사용자가 상담을 이어간다. Nodo가 대답해준다.
4. 특정 시점에 채팅창 아래에 ('근처 노무 법인 조회하기') 라는 버튼이 떠오른다.
5. 누르면 법무법인 마커가 표시된 지도가 나온다.
6. 상담 내용은 MongoDB에 저장된다.

## Schema 설계

```ts
interface Session {
  _id: ObjectId
  image: Blob
  conversations: {
    who: ObjectId | 'Bot'
    content: string
    createdAt: Date
  }[]
  createdAt: Date
}
```

## API 설계

prefix: /api

### 세션 열기

#### 요청

```
POST /sessions
Content-Type: multipart/form-data

who: string(ObjectId)
image: blob
```

#### 응답

```
Status: 201 Created
Content-Type: application/json

{
  session_id: string
  openingMent: string // "안녕하세요. 반갑습니다! 현재 근로 계약 상황에 대해 더 자세하게 설명해주세요."
}
```

### 대화 보내기 / 받기

#### 요청

```
POST /sessions/:session_id
Content-Type: application/json

{
  who: string(ObjectId)
  content: string
}
```

#### 응답

```
Status: 201 OK
Content-Type: application/json

{
  response: string
  createdAt: Date
}
```

### 노무 법인 위치 요청

#### 요청

```
GET /companies?query=선릉역

```

#### 응답

```
{
  companies: {
    pros: string
    call: string
    address: string
  }
}
```

## Route 설계

prefix: /pages

/로 들어오면 /chat으로 redirection

- /chat: 채팅 화면
- /map: 지도 화면
