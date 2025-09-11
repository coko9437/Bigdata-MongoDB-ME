// ✅ 1. 대량 데이터 추가(반복문 사용)
// 먼저, db.products 컬렉션에 100,000개의 샘플 데이터를 삽입합니다.

for (let i = 0; i < 1000000; i++) {
  db.products.insertOne({
    name: "Product_" + i,
    category: i % 5 == 0 ? "Electronics" : "Home",
    price: Math.floor(Math.random() * 5000),
    stock: i % 2 == 0 ? Math.floor(Math.random() * 100) : null, // 일부 null 값 포함
    status: i % 10 == 0 ? "inactive" : "active",
    created_at: new Date(),
  });
}

// ✅ 100,000개의 문서를 생성
// ✅ category, price, stock, status, created_at 등의 필드를 포함
// ✅ stock 필드에 null 값 포함(Sparse Index 테스트용)

// ✅ 2. 인덱스 없이 검색(성능 측정)
// 먼저, 인덱스를 만들지 않고 검색을 실행하여 성능을 측정합니다.

var start = new Date();
db.products.find({ category: "Electronics" }).explain("executionStats");
var end = new Date();
print("인덱스 없이 검색 시간: " + (end - start) + "ms");

// ✅ explain() 사용하여 쿼리 실행 계획 확인
// ✅ executionStats를 통해 실제 실행 시간 비교 가능

// ✅ 3. 다양한 인덱스 생성
// 1_Single - key Index(단일 필드 인덱스)

db.products.createIndex({ category: 1 });
db.products.getIndexes();

// ✅ 단일 필드 인덱스: category 필드에 대해 인덱스를 생성하여 검색 최적화

// 2_Compound Index(복합 인덱스)

db.products.getIndexes();
db.products.dropIndex("category_1");
db.products.createIndex({ category: 1, price: -1 });
// ✅ category와 price를 조합하여 검색 최적화
// ✅ price는 내림차순(-1) 정렬
// 복합 인덱스에서,
// 순서1) category 별로 오름 차순 정렬 후,
// 순서2) price 별로 내림차순 정렬, 예를 들어 높은 가격대에서, 낮은 가격대로 정렬을 110만건정렬,
// 검색 조건 1) lt미만, 3000 미만, 가격이 높은 순에서 부터 찾기 시작하면, 정렬이
// 검색 조건 2) gt초과, 3000 초과, 가격이 높은 순에서 부터 찾기 시작하면, 정렬이, 효율적이다.

var start = new Date();
db.products
  .find({ category: "Electronics", price: { $gt: 3000 } })
  .explain("executionStats");
var end = new Date();
print("복합 인덱스 사용 후 가격 추가 검색 시간: " + (end - start) + "ms");

// 3_Non - Unique Index vs Unique Index

// Non-Unique Index (기본적으로 중복 허용)
db.products.createIndex({ name: 1 });

// Unique Index (중복 방지)
db.products.createIndex({ name: 1 }, { unique: true });
// ✅ 이름 중복 허용(Non - Unique)
// ✅ 이름 중복 방지(Unique Index)

// 4_Sparse Index(NULL 값 제외)

db.products.createIndex({ stock: 1 }, { sparse: true });
// ✅ NULL 값을 가진 문서는 인덱스에서 제외(공간 절약 및 성능 최적화)

// 5_Partial Index(부분 인덱스)

db.products.createIndex(
  { status: 1 },
  { partialFilterExpression: { status: "active" } }
);
// ✅ status = "active"인 문서만 인덱싱(인덱스 크기 최적화 및 쿼리 속도 향상)

// 6_Background Index(백그라운드 생성)

// db.products.createIndex({ created_at: 1 }, { background: true });
// ✅ 백그라운드에서 인덱스를 생성하여 서비스 운영 중에도 성능 저하 없이 적용 가능

// 7_Covered Index(쿼리 시 모든 데이터가 인덱스에서 해결됨)

db.products.createIndex({ name: 1, category: 1, price: 1 });

// ✅ 조회 시 name, category, price만 요청하면 인덱스에서 직접 반환하여 속도 향상

// ✅ 4. 인덱스 적용 후 검색(성능 측정)
db.products.getIndexes();
db.products.dropIndex("name_1_category_1_price_1");
db.products.createIndex({ category: 1, price: -1 });

var start = new Date();
db.products
  .find({
    name: "Product_108",
    category: "Electronics",
  })
  .explain("executionStats");
var end = new Date();
print("인덱스 적용 후 검색 시간: " + (end - start) + "ms");

// ✅ 검색 성능 비교
// ✅ 인덱스 적용 후 executionStats를 통해 속도 확인

// ✅ 5. 인덱스 적용 전후 성능 비교 결과 예시

// 인덱스 없이 검색
// "totalDocsExamined": 100000,
//     "executionTimeMillis": 1200  // 약 1.2초

// 인덱스 적용 후 검색
// "totalDocsExamined": 5000,
//     "executionTimeMillis": 50  // 약 50ms
// ✅ totalDocsExamined 값이 크게 줄어듦 → 쿼리 성능 향상
// ✅ 실행 시간이 1200ms → 50ms로 감소
