// 📌 MongoDB 데이터 모델링 & 설계 개념 정리 및 활용법
// MongoDB는 NoSQL 데이터베이스로 유연한 스키마 설계를 제공하며,
//     데이터 구조를 다양한 패턴으로 설계할 수 있습니다.

// 아래에서는 MongoDB 데이터 모델링과 설계의 주요 개념,
//     기준, 패턴 및 Validator를 설명하고,
//         자주 사용되는 Top 20 문법을 실전 예제와 함께 정리하겠습니다.

// 📌 목차
// 1. MongoDB 데이터 모델링
// 2. MongoDB 설계의 주요 특징
// 3. MongoDB 설계 기준
// 4. MongoDB 설계 패턴
// 5. Validator 사용법

// 1__ ⃣ MongoDB 데이터 모델링
// 📌 개념 및 정의
// MongoDB는 비정형 데이터 모델을 지원하며
// ON 형식의 문서를 기반으로 합니다.

// 전통적인 관계형 데이터베이스(RDBMS)와
// 달리 ** 테이블 대신 컬렉션(Collection)과 문서(Document) ** 를 사용합니다.

// ✅ 특징
// 스키마가 유연함 → 필드 추가, 삭제가 자유로움
// 임베디드 문서 지원 → 관련 데이터를 하나의 문서 안에 저장 가능
// 수직적 / 수평적 확장 가능 → Sharding 지원
// 강력한 인덱스 기능 → 복합 인덱스, GeoSpatial 인덱스, TTL 인덱스 등

// 2__ ⃣ MongoDB 설계의 주요 특징

// ✅ 설계 특징
// 문서 지향(Document - Oriented)

// ON 형식으로 데이터를 저장하여 관계형 데이터베이스보다 유연한 구조 제공
// 중첩된 데이터(Nested Data) 지원
// 데이터 정규화(Normalization)와 비정규화(Denormalization) 선택 가능
// 동적 스키마(Dynamic Schema)
// 각 문서가 서로 다른 구조를 가질 수 있음
// 대규모 데이터 처리
// Sharding을 통한 수평 확장 가능
// 고성능 인덱스
// 다양한 유형의 인덱스 제공(복합 인덱스, 부분 인덱스, Geo 인덱스 등)

// 3__ ⃣ MongoDB 설계 기준

// ✅ 설계 시 고려할 사항
// 읽기 성능 vs.쓰기 성능
// 읽기 성능을 높이려면 정규화(Normalization)
// 쓰기 성능을 높이려면 비정규화(Denormalization)
// 데이터 중복 최소화
// 관계형 DB처럼 정규화할 것인지, 빠른 조회를 위해 중복 저장할 것인지 결정
// 쿼리 성능 최적화
// 자주 조회되는 필드는 인덱스를 추가하여 성능 향상 가능
// Sharding(수평 분산) 고려
// 대량 데이터를 다룰 경우 Sharding을 고려하여 데이터 파티셔닝 수행
// 데이터 무결성 유지
// Validator 및 Transactions를 활용하여 데이터 정합성 유지

// 4__ ⃣ MongoDB 설계 패턴

// ✅ 설계 패턴 종류

// 임베디드 문서(Embedded Document)
// 부모 - 자식 관계를 하나의 문서 내에 저장
// 조회 성능 향상(Join이 필요 없음)

// {
//     name: "Alice",
//         address: { city: "Seoul", zip: "12345" }
// }

// 참조 관계(Reference)
// 부모 - 자식 관계를 서로 다른 컬렉션에 저장
// 데이터 중복 최소화

// { userId: ObjectId("12345"), name: "Alice" }
// { userId: ObjectId("12345"), orderId: "A001", amount: 100 }

// 정규화(Normalization)
// 관계형 데이터베이스와 유사한 방식

// 비정규화(Denormalization)
// 읽기 성능 최적화(데이터 중복 허용)

// ================================================================
// 5__ ⃣ Validator 사용법

// ✅ 유효성 검사 (Schema Validation)
// MongoDB에서는 Validator를 활용하여 컬렉션의 스키마를 검증할 수 있음.

// 단일 필드 유효성 검사

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email"],
      properties: {
        name: { bsonType: "string", description: "필수 필드" },
        age: { bsonType: "int", minimum: 18, description: "18세 이상" },
        email: {
          bsonType: "string",
          pattern: "^.*@.*\\..*$",
          description: "유효한 이메일",
        },
      },
    },
  },
});

// ==================================================================================
// ✅ 1. 컬렉션 스키마 검증 설정 확인
// 🔹 컬렉션의 유효성 검증 규칙 확인

db.getCollectionInfos({ name: "users" });

// ✅ users 컬렉션의 스키마 검증 규칙(validator)이 올바르게 설정되었는지 확인 가능.

// ✅ 2. 샘플 데이터 삽입 및 검증 테스트
// 🔹 (1) 올바른 데이터 삽입

db.users.insertOne({
  name: "Alice",
  email: "alice@example.com",
  age: 25,
});
db.users.find();

// ✅ 유효한 데이터이므로 정상적으로 삽입되어야 함.

// 🔹 (2) 유효하지 않은 데이터 삽입 테스트

db.users.insertOne({
  name: "Bob",
  email: "bobexample.com", // "@" 없음 (유효하지 않은 이메일)
  age: 30,
});

// ❌ 이메일 필드가 패턴을 충족하지 않아 삽입이 실패해야 함.

db.users.insertOne({
  email: "charlie@example.com", // name 필드 없음
  age: 22,
});

// ❌ name 필드가 없어서 삽입이 거부되어야 함.

db.users.insertOne({
  name: "David",
  email: "david@example.com",
  age: 16, // 18세 미만
});

// ❌ age 필드가 18 미만이므로 삽입이 실패해야 함.

// ✅ 3. 컬렉션의 유효성 검증 오류 로그 확인

db.runCommand({ collMod: "users", validationAction: "error" });

// ✅ 현재 컬렉션의 검증 정책을 조회하여 오류 발생 여부 확인 가능.

// ✅ 4. 컬렉션 유효성 검증 제거 (임시)
// 🔹 Schema Validation을 해제하고 데이터 삽입 허용

db.runCommand({
  collMod: "users",
  validator: {},
});
// ✅ 모든 유효성 검증을 제거하여 임시로 데이터 삽입 허용.
