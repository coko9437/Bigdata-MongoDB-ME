// 1. MongoDB 빅데이터 추출 방법
// 2. Aggregation Framework 개념
// 3. Aggregation Framework 사용

// 1. $match(필터링)
// 2. $group(그룹화)
// 3. $sort(정렬)
// 4. $limit(개수 제한)
// 5. $skip(데이터 건너뛰기)
// 6. $project(필드 선택 및 변환)
// 7. $unwind(배열 데이터 펼치기)
// 8. $lookup(조인 연산)
// 9. $addFields(새로운 필드 추가)
// 10. $out(결과 저장)
// 11. $count(문서 개수)
// 12. $facet(멀티 파이프라인 실행)
// 13. $bucket(범위별 그룹화)
// 14. $merge(기존 컬렉션에 병합)
// 15. $sample(랜덤 샘플링)
// 16. $geoNear(지리적 거리 기반 검색)
// 17. $text(텍스트 검색)
// 18. $replaceRoot(새로운 루트 문서 설정)
// 19. $redact(데이터 필터링)
// 20. $setWindowFields(윈도우 함수 활용)

// 1__ MongoDB 빅데이터 추출 방법

// ✅ 개념
// MongoDB에서 빅데이터를 추출하는 방법에는 다음과 같은 기술이 사용됩니다:

// Cursor Pagination: limit & skip을 활용하여 데이터를 나누어 조회
// Batch Processing: 대량 데이터 처리를 위해 batchSize() 활용
// Streaming Processing: Change Streams를 활용한 실시간 데이터 분석
// Aggregation Framework: 데이터를 그룹화, 필터링, 변환하여 효율적으로 추출

// 2__ Aggregation Framework 개념

// ✅ 개념
// MongoDB의 Aggregation Framework는 SQL의 GROUP BY와
// 유사한 데이터 변환 및 분석 기능을 제공
// Pipeline 방식으로 데이터를 단계별로 처리하여 결과를 반환
// 빅데이터 분석, 로그 처리, 대시보드 생성 등에 활용됨

// ✅ 구성 요소
// Stage(단계): 각 단계에서 데이터를 변환($match, $group, $sort 등)
// Pipeline(파이프라인): 여러 개의 Stage가 연결되어 데이터 흐름을 형성
// Operators(연산자): 각 Stage에서 사용되는 연산자($sum, $avg, $min 등
// )

// 3__ Aggregation Framework 사용법

// 📌 기본 문법

// db.collection.aggregate([
//     { Stage_1 },
//     { Stage_2 },
//     { Stage_3 }
// ])

// 📌 예제
// Asia 지역에서 판매된 제품별로 총 판매 금액을 계산하여,
//     판매 금액(totalSales)이 가장 높은 제품부터
// 내림차순으로 정렬됩니다.

db.sales.insertMany([
  {
    product: "Laptop",
    region: "Asia",
    amount: 1200,
    date: ISODate("2024-02-01"),
  },
  {
    product: "Laptop",
    region: "Europe",
    amount: 1500,
    date: ISODate("2024-02-02"),
  },
  {
    product: "Laptop",
    region: "Asia",
    amount: 800,
    date: ISODate("2024-02-03"),
  },
  {
    product: "Phone",
    region: "Asia",
    amount: 600,
    date: ISODate("2024-02-01"),
  },
  {
    product: "Phone",
    region: "America",
    amount: 700,
    date: ISODate("2024-02-02"),
  },
  {
    product: "Tablet",
    region: "Asia",
    amount: 900,
    date: ISODate("2024-02-03"),
  },
  {
    product: "Tablet",
    region: "Europe",
    amount: 1100,
    date: ISODate("2024-02-04"),
  },
  {
    product: "Tablet",
    region: "Asia",
    amount: 500,
    date: ISODate("2024-02-05"),
  },
  {
    product: "Monitor",
    region: "Asia",
    amount: 300,
    date: ISODate("2024-02-06"),
  },
  {
    product: "Monitor",
    region: "Europe",
    amount: 400,
    date: ISODate("2024-02-07"),
  },
]);

db.sales.aggregate([
  { $match: { region: "Asia" } },
  { $group: { _id: "$product", totalSales: { $sum: "$amount" } } },
  { $sort: { totalSales: -1 } },
]);

// ✅ 설명

// $match → region: "Asia" 필터링
// $group → product별 totalSales 계산
// $sort → 총 판매량 기준 내림차순 정렬

// 4__ 많이 사용하는 문법

// 번호	문법	설명	실무 활용

// 1__	$match	특정 조건으로 데이터 필터링	특정 연도 주문 내역 조회
// 2__	$group	데이터를 그룹화하여 집계	상품별 총 판매량 계산
// 3__	$sort	정렬	가장 많이 판매된 제품 순 정렬
// 4__	$limit	개수 제한	최근 10개 주문 가져오기
// 5__	$skip	데이터 건너뛰기	페이지네이션 구현
// 6__	$project	특정 필드만 선택하여 출력	불필요한 필드 제거
// 7__	$unwind	배열 데이터를 개별 문서로 변환	주문 내역 펼치기
// unwind ** 의 의미는 "풀다", "펼치다" 라는 뜻
// 8__	$lookup	다른 컬렉션과 조인	사용자와 주문 정보 연결
// 9__	$addFields	새로운 필드 추가	총 가격 계산 필드 추가
// 🔟	$out	결과를 새로운 컬렉션에 저장	데이터 백업 및 분석

// ✅ 1. $match(필터링)
db.sales.aggregate([{ $match: { product: "Tablet" } }]);

// ✅ 실무 활용 사례: 특정 카테고리 상품만 조회

// ✅ 2. $group(그룹화)

db.sales.aggregate([
  { $group: { _id: "$product", totalSales: { $sum: "$amount" } } },
]);

// ✅ 실무 활용 사례: 제품별 총 판매량 계산

// ✅ 3. $sort(정렬)

db.sales.aggregate([{ $sort: { amount: -1 } }]);

// ✅ 실무 활용 사례: 매출이 높은 순으로 정렬

// ✅ 4. $limit(개수 제한)

db.sales.aggregate([{ $limit: 5 }]);

// ✅ 실무 활용 사례: 최근 10개 주문 가져오기

// ✅ 5. $skip(데이터 건너뛰기)

db.sales.aggregate([{ $skip: 3 }, { $limit: 3 }]);

// ✅ 실무 활용 사례: 페이지네이션 구현

// ✅ 6. $project(필드 선택 및 변환)

db.sales.aggregate([{ $project: { _id: 0, product: 1, amount: 1 } }]);

// ✅ 실무 활용 사례: 필요한 필드만 선택하여 출력

// ===================================================================
// 1
db.orders.insertMany([
  {
    _id: 1,
    userId: 101,
    items: ["apple", "banana"],
    price: 2,
    quantity: 3,
  },
  {
    _id: 2,
    userId: 102,
    items: ["orange", "grape"],
    price: 5,
    quantity: 1,
  },
]);

// 2
db.users.insertMany([
  {
    _id: 101,
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    _id: 102,
    name: "Jane Smith",
    email: "jane.smith@example.com",
  },
]);

// ✅ 7. $unwind (배열 데이터 펼치기)

db.orders.aggregate([{ $unwind: "$items" }]);

// 출력 예시,
// [
//   {
//     "_id": 1,
//     "userId": 101,
//     "items": "apple",
//     "price": 2,
//     "quantity": 3
//   },
//   {
//     "_id": 1,
//     "userId": 101,
//     "items": "banana",
//     "price": 2,
//     "quantity": 3
//   },
//   {
//     "_id": 2,
//     "userId": 102,
//     "items": "orange",
//     "price": 5,
//     "quantity": 1
//   },
//   {
//     "_id": 2,
//     "userId": 102,
//     "items": "grape",
//     "price": 5,
//     "quantity": 1
//   }
// ]

// ✅ 실무 활용 사례: 주문 내역을 개별 상품별로 변환

// ✅ 8. $lookup (조인 연산)

db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      //orders 로컬 필드
      localField: "userId",
      // users의 필드
      foreignField: "_id",
      // 출력하는 화면에, 새로운 필드로,userInfo
      // userInfo , 에 users 내용이 들어옴.
      as: "userInfo",
    },
  },
]);

// 출력 예시
// [
//   {
//     "_id": 1,
//     "userId": 101,
//     "items": [
//       "apple",
//       "banana"
//     ],
//     "price": 2,
//     "quantity": 3,
//     "userInfo": [
//       {
//         "_id": 101,
//         "name": "John Doe",
//         "email": "john.doe@example.com"
//       }
//     ]
//   },
//   {
//     "_id": 2,
//     "userId": 102,
//     "items": [
//       "orange",
//       "grape"
//     ],
//     "price": 5,
//     "quantity": 1,
//     "userInfo": [
//       {
//         "_id": 102,
//         "name": "Jane Smith",
//         "email": "jane.smith@example.com"
//       }
//     ]
//   }
// ]

// ✅ 실무 활용 사례: 주문 데이터와 사용자 데이터 연결

// ✅ 9. $addFields (새로운 필드 추가)

db.orders.aggregate([
  { $addFields: { totalPrice: { $multiply: ["$price", "$quantity"] } } },
]);

// 출력 예시
// [
//   {
//     "_id": 1,
//     "userId": 101,
//     "items": [
//       "apple",
//       "banana"
//     ],
//     "price": 2,
//     "quantity": 3,
//     "totalPrice": 6
//   },
//   {
//     "_id": 2,
//     "userId": 102,
//     "items": [
//       "orange",
//       "grape"
//     ],
//     "price": 5,
//     "quantity": 1,
//     "totalPrice": 5
//   }
// ]

// ✅ 실무 활용 사례: 주문 가격 계산 필드 추가

// ✅ 10. $out (결과 저장)

db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items", totalSales: { $sum: "$price" } } },
  { $out: "sales_summary" },
]);

// 출력 예시
db.sales_summary.find();
// [
//   {
//     "_id": "apple",
//     "totalSales": 2
//   },
//   {
//     "_id": "grape",
//     "totalSales": 5
//   },
//   {
//     "_id": "orange",
//     "totalSales": 5
//   },
//   {
//     "_id": "banana",
//     "totalSales": 2
//   }
// ]

// ✅ 실무 활용 사례: 집계된 데이터를 새로운 컬렉션에 저장

db.salesB.insertMany([
  {
    _id: 1,
    product: "Laptop",
    amount: 120000,
    category: "Electronics",
    date: ISODate("2025-02-24T10:00:00Z"),
    status: "completed",
    userId: 101,
  },
  {
    _id: 2,
    product: "Phone",
    amount: 90000,
    category: "Electronics",
    date: ISODate("2025-02-24T11:00:00Z"),
    status: "completed",
    userId: 102,
  },
  {
    _id: 3,
    product: "Tablet",
    amount: 60000,
    category: "Electronics",
    date: ISODate("2025-02-24T12:00:00Z"),
    status: "completed",
    userId: 103,
  },
  {
    _id: 4,
    product: "Headphones",
    amount: 30000,
    category: "Accessories",
    date: ISODate("2025-02-24T13:00:00Z"),
    status: "pending",
    userId: 104,
  },
  {
    _id: 5,
    product: "Monitor",
    amount: 50000,
    category: "Accessories",
    date: ISODate("2025-02-24T14:00:00Z"),
    status: "pending",
    userId: 105,
  },
]);

// ✅ 11. $count (문서 개수 세기)

// 📌 개념
// 특정 조건을 만족하는 문서 개수를 계산

// 📌 문법

db.salesB.aggregate([
  { $match: { status: "completed" } },
  { $count: "completedOrders" },
]);

// 📌 예제 출력

// [
//   {
//     "completedOrders": 3
//   }
// ]

// ✅ 실무 활용 사례

// 특정 조건(status: "completed")을 만족하는 주문 개수를 계산하여
// 대시보드에 표시

// ✅ 12. $facet (멀티 파이프라인 실행)

// 📌 개념
// 여러 개의 집계 연산을 한 번에 실행하는 멀티 파이프라인 기능
// 데이터를 동시에 여러 방식으로 분석 가능

// 📌 문법

db.salesB.aggregate([
  {
    $facet: {
      totalSales: [{ $group: { _id: null, total: { $sum: "$amount" } } }],
      topProducts: [
        { $group: { _id: "$product", sales: { $sum: "$amount" } } },
        { $sort: { sales: -1 } },
        { $limit: 5 },
      ],
    },
  },
]);

// 📌 예제 출력

// [
//   {
//     "totalSales": [
//       {
//         "_id": null,
//         "total": 350000
//       }
//     ],
//     "topProducts": [
//       {
//         "_id": "Laptop",
//         "sales": 120000
//       },
//       {
//         "_id": "Phone",
//         "sales": 90000
//       },
//       {
//         "_id": "Tablet",
//         "sales": 60000
//       },
//       {
//         "_id": "Monitor",
//         "sales": 50000
//       },
//       {
//         "_id": "Headphones",
//         "sales": 30000
//       }
//     ]
//   }
// ]

// ✅ 실무 활용 사례

// 전체 매출과 인기 상품을 동시에 분석하여 대시보드 생성

// ✅ 13. $bucket (범위별 그룹화)

// 📌 개념
// 특정 필드 값을 범위별로 그룹화하여 통계 분석 가능

// 📌 문법

// boundaries 옵션에 [30000, 60000, 120000]이 지정되어 있으므로:
// 첫 번째 버킷은 30000 이상 60000 미만의 문서를 포함합니다.
// 두 번째 버킷은 60000 이상 120000 미만의 문서를 포함합니다.

db.salesB.aggregate([
  {
    $bucket: {
      groupBy: "$amount",
      boundaries: [30000, 60000, 120000],
      default: "Other",
      output: {
        count: { $sum: 1 },
        products: { $push: "$product" },
      },
    },
  },
]);

// 📌 예제 출력

// [
//   {
//     "_id": 30000,
//     "count": 2,
//     "products": [
//       "Headphones",
//       "Monitor"
//     ]
//   },
//   {
//     "_id": 60000,
//     "count": 2,
//     "products": [
//       "Phone",
//       "Tablet"
//     ]
//   },
//   {
//     "_id": "Other",
//     "count": 1,
//     "products": [
//       "Laptop"
//     ]
//   }
// ]

// ✅ 실무 활용 사례

// 연령대별 사용자 분포 분석

// ✅ 14. $merge (기존 컬렉션에 병합)

// 📌 개념
// Aggregation 결과를 기존 컬렉션에 병합하여 저장
// 새로운 데이터를 insert, 기존 데이터를 update 가능

// 📌 문법

db.salesB.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$product", totalRevenue: { $sum: "$amount" } } },
  { $merge: "sales_summary" },
]);

db.sales_summary.find().pretty();

// 출력 예시
// [
//   {
//     "_id": "apple",
//     "totalSales": 2
//   },
//   {
//     "_id": "grape",
//     "totalSales": 5
//   },
//   {
//     "_id": "orange",
//     "totalSales": 5
//   },
//   {
//     "_id": "banana",
//     "totalSales": 2
//   },
//   {
//     "_id": "Laptop",
//     "totalRevenue": 120000
//   },
//   {
//     "_id": "Phone",
//     "totalRevenue": 90000
//   },
//   {
//     "_id": "Headphones",
//     "totalRevenue": 30000
//   },
//   {
//     "_id": "Tablet",
//     "totalRevenue": 60000
//   },
//   {
//     "_id": "Monitor",
//     "totalRevenue": 50000
//   }
// ]

// ✅ 실무 활용 사례

// 일일 매출 통계를 sales_summary 컬렉션에 업데이트

// ✅ 15. $sample (랜덤 샘플링)

// 📌 개념
// 랜덤하게 일정 개수의 문서를 선택

// 📌 문법

db.salesB.aggregate([{ $sample: { size: 1 } }]);

// ✅ 실무 활용 사례

// AI 모델 학습을 위한 랜덤 샘플링 데이터 추출

// ✅ 16. $geoNear (지리적 거리 기반 검색)

// 📌 개념
// 사용자의 현재 위치에서 가장 가까운 지점을 검색

// 📌 문법

db.locations.insertMany([
  {
    name: "Seoul Tower",
    location: { type: "Point", coordinates: [126.9784, 37.5665] },
  },
  {
    name: "Haeundae Beach",
    location: { type: "Point", coordinates: [129.1611, 35.1587] },
  },
  {
    name: "Namsan Park",
    location: { type: "Point", coordinates: [126.9921, 37.5512] },
  },
  {
    name: "Gyeongbokgung Palace",
    location: { type: "Point", coordinates: [126.9769, 37.5796] },
  },
  {
    name: "Lotte World",
    location: { type: "Point", coordinates: [127.0996, 37.5112] },
  },
  {
    name: "Jeju Island",
    location: { type: "Point", coordinates: [126.5312, 33.4996] },
  },
  {
    name: "Busan Tower",
    location: { type: "Point", coordinates: [129.0327, 35.1019] },
  },
  {
    name: "Incheon Airport",
    location: { type: "Point", coordinates: [126.4512, 37.4602] },
  },
  {
    name: "Daegu Tower",
    location: { type: "Point", coordinates: [128.5986, 35.8714] },
  },
  {
    name: "Gwangalli Beach",
    location: { type: "Point", coordinates: [129.1202, 35.1554] },
  },
  {
    name: "Daejeon Expo Park",
    location: { type: "Point", coordinates: [127.3845, 36.3745] },
  },
  {
    name: "Ulsan Grand Park",
    location: { type: "Point", coordinates: [129.3151, 35.5438] },
  },
  {
    name: "Gimhae International Airport",
    location: { type: "Point", coordinates: [128.9532, 35.1796] },
  },
  {
    name: "Seoraksan National Park",
    location: { type: "Point", coordinates: [128.4657, 38.1195] },
  },
  {
    name: "Suwon Hwaseong Fortress",
    location: { type: "Point", coordinates: [127.0093, 37.2851] },
  },
]);

// 지리적 검색을 위해 2dsphere 인덱스 생성
db.locations.createIndex({ location: "2dsphere" });

db.locations.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [126.9784, 37.5665] },
      distanceField: "distance",
      maxDistance: 5000,
      spherical: true,
    },
  },
]);

// ✅ 실무 활용 사례

// 사용자 위치 기반 가장 가까운 매장 찾기

// ✅ 17. $text (텍스트 검색)
// 📌 개념
// Full-Text Search (전문 검색) 지원
// 빠른 검색을 위해 text 인덱스를 생성해야 함

// 📌 문법
// // 샘플 데이터 삽입: products 컬렉션
db.products.insertMany([
  {
    _id: 1,
    name: "Laptop Pro",
    description: "A powerful laptop for professionals",
    price: 1500,
  },
  {
    _id: 2,
    name: "Laptop Air",
    description: "Lightweight and efficient laptop",
    price: 1200,
  },
  {
    _id: 3,
    name: "Desktop PC",
    description: "High performance desktop computer",
    price: 1000,
  },
  {
    _id: 4,
    name: "Gaming Laptop",
    description: "High-end gaming laptop with advanced graphics",
    price: 2000,
  },
  {
    _id: 5,
    name: "Smartphone",
    description: "Latest model smartphone with great features",
    price: 800,
  },
]);

db.products.createIndex({ description: "text" });

db.products.aggregate([{ $match: { $text: { $search: "laptop" } } }]);

// ✅ 실무 활용 사례

// 검색 엔진 기능 구현

// ✅ 18. $replaceRoot (새로운 루트 문서 설정)

// 📌 개념
// 문서 구조를 변경하여 특정 필드를 루트로 설정

// 📌 문법

// 이 Aggregation 파이프라인은 salesB 컬렉션의 문서와
// users 컬렉션의 문서를 조인(join)하여,
// 관련 사용자 정보를 출력하는 과정입니다.
// 각 단계의 역할은 다음과 같습니다.

// $lookup 단계

// 목적: salesB 문서의 userId 필드와
// users 컬렉션의 _id 필드를 매칭시켜,
// 일치하는 사용자 정보를 가져옵니다.

// 결과: 매칭된 사용자 정보들이 배열(userDetails) 형태로
// salesB 문서에 추가됩니다.

// $unwind 단계

// 목적: $lookup으로 추가된 userDetails 배열을 풀어,
// 배열 내 각 요소를 개별 문서로 변환합니다.

// 결과: 각 문서가 하나의 사용자 정보 객체(userDetails)를 포함하게 됩니다.

// $replaceRoot 단계

// 목적: 현재 문서의 최상위(root)를 userDetails 필드의 값으로 대체합니다.

// 결과: 최종적으로 출력되는 문서는
// 원래 salesB 문서의 구조가 아니라,
// 조인된 users 컬렉션의 사용자 정보만 포함하게 됩니다.

// 즉, 이 파이프라인은 salesB 컬렉션의 각 문서에 대해,
// 해당 문서의 userId에 맞는 사용자 정보를 가져와
// 사용자 정보만 출력하는 역할을 합니다.

db.salesB.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userDetails",
    },
  },

  { $unwind: "$userDetails" },

  { $replaceRoot: { newRoot: "$userDetails" } },
]);

// 출력 예시
// [
//   {
//     "_id": 101,
//     "name": "John Doe",
//     "email": "john.doe@example.com"
//   },
//   {
//     "_id": 102,
//     "name": "Jane Smith",
//     "email": "jane.smith@example.com"
//   }
// ]

// ✅ 실무 활용 사례

// lookup으로 조인한 데이터를 메인 문서로 변환

// ✅ 19. $redact (데이터 필터링)

// 📌 개념
// 특정 필드를 조건에 따라 표시하거나 제거 가능

// 📌 문법
// // 샘플 데이터 삽입: users2 컬렉션

db.users2.insertMany([
  { _id: 1, name: "Alice", role: "admin", email: "alice@example.com" },
  { _id: 2, name: "Bob", role: "user", email: "bob@example.com" },
  { _id: 3, name: "Charlie", role: "admin", email: "charlie@example.com" },
  { _id: 4, name: "David", role: "user", email: "david@example.com" },
]);

db.users2.aggregate([
  {
    $redact: {
      $cond: {
        if: { $eq: ["$role", "admin"] },
        then: "$$KEEP",
        else: "$$PRUNE",
      },
    },
  },
]);

// 출력_예시
// [
//   {
//     "_id": 1,
//     "name": "Alice",
//     "role": "admin",
//     "email": "alice@example.com"
//   },
//   {
//     "_id": 3,
//     "name": "Charlie",
//     "role": "admin",
//     "email": "charlie@example.com"
//   }
// ]

// ✅ 실무 활용 사례

// 사용자 권한에 따라 필터링된 데이터 제공

// ✅ 20. $setWindowFields (윈도우 함수 활용)

// 📌 개념
// SQL의 window function과 유사한 기능 제공
// 누적 합계 ( "runningTotal": 30000),
//  이동 평균 등을 계산할 때 유용

// 📌 문법

db.salesB.aggregate([
  {
    $setWindowFields: {
      partitionBy: "$category",
      sortBy: { date: 1 },
      output: {
        runningTotal: {
          $sum: "$amount",
          window: { documents: ["unbounded", "current"] },
        },
      },
    },
  },
]);

// 📌 예제 출력
// [
//   {
//     "_id": 4,
//     "product": "Headphones",
//     "amount": 30000,
//     "category": "Accessories",
//     "date": {
//       "$date": "2025-02-24T13:00:00Z"
//     },
//     "status": "pending",
//     "userId": 104,
//     "runningTotal": 30000
//   },
//   {
//     "_id": 5,
//     "product": "Monitor",
//     "amount": 50000,
//     "category": "Accessories",
//     "date": {
//       "$date": "2025-02-24T14:00:00Z"
//     },
//     "status": "pending",
//     "userId": 105,
//     "runningTotal": 80000
//   },
//   {
//     "_id": 1,
//     "product": "Laptop",
//     "amount": 120000,
//     "category": "Electronics",
//     "date": {
//       "$date": "2025-02-24T10:00:00Z"
//     },
//     "status": "completed",
//     "userId": 101,
//     "runningTotal": 120000
//   },
//   {
//     "_id": 2,
//     "product": "Phone",
//     "amount": 90000,
//     "category": "Electronics",
//     "date": {
//       "$date": "2025-02-24T11:00:00Z"
//     },
//     "status": "completed",
//     "userId": 102,
//     "runningTotal": 210000
//   },
//   {
//     "_id": 3,
//     "product": "Tablet",
//     "amount": 60000,
//     "category": "Electronics",
//     "date": {
//       "$date": "2025-02-24T12:00:00Z"
//     },
//     "status": "completed",
//     "userId": 103,
//     "runningTotal": 270000
//   }
// ]

// ✅ 실무 활용 사례

// 매출 데이터의 누적 합계를 계산하여 대시보드 제공
