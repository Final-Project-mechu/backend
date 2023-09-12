# 🍖 Together eat!
<p align="center">
<img width="300" alt="image" src="https://github.com/Final-Project-mechu/backend/assets/25074165/a923cc2f-4acd-492e-b732-075fd6bf6d8b">
</p>

## 📑목차
> 1. 서비스 소개</br>
> 2. 팀원 소개</br>
> 3. 핵심 기능</br>
> 4. Project Architecture</br>
> 5. Tech Stack</br>
> 6. Library</br>
> 7. ERD</br>
> 8. API</br>

<br>
<br>
<br>

## ✍🏻 서비스 소개

이 프로젝트는 Nest.js, MySQL, TypeORM을 활용하여 개인의 선호도를 반영한 음식점 추천 서비스를 구현하는 것을 목표로 합니다. <br>
사용자의 선호도와 평가를 기반으로, 맞춤형 음식점을 랜덤으로 추천하여 사용자에게 다양하고 개인화된 음식점 경험을 제공합니다.

<br>
<br>

## ⛅️ 팀원 소개

  - 김세령(팀장)([https://github.com/eshika90](https://github.com/eshika90))
  - 오준석(부팀장)([https://github.com/KORjunseok](https://github.com/KORjunseok))
  - 이서원([https://github.com/rymile](https://github.com/rymile))
  - 최하영([https://github.com/rammakasty](https://github.com/rammakasty))
  - 함형진([https://github.com/HyungJin0114](https://github.com/HyungJin0114))

<br>
<br>
    
## 🌿 핵심 기능 <br>
<br>
  <summary>🍕 음식 랜덤 뽑기</summary>
  <br>
    - 선호도 조사와 유저의 메뉴추첨, 찜하기 등의 활동을 통해 가중치가 데이터에 반영됩니다.  <br>
  <br>
  <br>
      <summary>🌭 사용자 위치기반 맛집 추천 </summary>
  <br>
    - 선호도 조사와 유저의 음식 선택 가중치를 적용된 수치가 확률로 환산되어 음식이 추천되게 됩니다. (카카오맵 API 사용) <br>
  <br>



## ❄️ Project Architecture

<p align="center">
<img width="1500" height="600 alt="image" src="https://github.com/Final-Project-mechu/backend/assets/25074165/bba06c9b-aee5-4a20-8715-a0b312467ccc">
</p>


## 🛠 Tech Stack

- Nest.js
- MySQL
- RDS
- EC2
- S3
- Route 53
- Certificate Manager
- Load Balancer
- https



## 🌧 Library

|       library       |                         description                         |
| :-----------------: | :---------------------------------------------------------: |
|       dotenv        |            보안적으로 문제가 있는 데이터 숨기기             |
|        cors         |            CORS보안 정책을 해결하기 위하여 사용.            |
|       bcrypt        |         해시함수를 사용하여 암호화 하기 위해 사용.          |
|       express       |       빠르고 개방적인 개발을 위해 웹 프레임워크 사용.       |
|    jsonwebtoken     |                    JWT Token 위해 사용.                     |
|       logger        |                에러 로그 관리하기 위해 사용.                |
|       mysql2        |           Node.js에서 MySQL을 사용하기 위해 사용.           |          |
|       multer        |                         파일 업로드                         |
|      multer-s3      |                      S3에 파일 업로드                       |
|      Nodemailer     |        이메일 인증번호를 통한 확인 모듈                     |
|      Typeorm        |     TypeScript와 JavaScript를 위한 데이터베이스 ORM        |
|      Nodemailer     |        이메일 인증번호를 통한 확인 모듈                     |



## 📋 ERD
### [erd](https://www.erdcloud.com/d/NCvcJMym5hyi5PSAS)
<p align="center">
<img width="1000" height="600" alt="image" src="https://github.com/Final-Project-mechu/backend/assets/25074165/a19cf5d4-d6e7-45d5-81c1-7787fe64be52">
</p>

## 📋 API
# [api](https://2team.gitbook.io/jumechu/)
