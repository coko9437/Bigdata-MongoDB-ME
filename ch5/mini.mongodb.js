// #빅데이터_수집_저장 #미니실습, #몽고디비
// 샘플 데이터 제공.
// 기존 컬렉션을 제거 후, 다시 생성하기.
db.users.insertMany([
  {
    _id: "user1",
    name: "Alice",
    age: 30,
    city: "Seoul",
    email: "alice@example.com",
    joinedAt: ISODate("2023-02-10T10:30:00Z"),
  },
  {
    _id: "user2",
    name: "Bob",
    age: 35,
    city: "Busan",
    email: "bob@example.com",
    joinedAt: ISODate("2022-11-20T08:15:00Z"),
  },
  {
    _id: "user3",
    name: "Charlie",
    age: 40,
    city: "Incheon",
    email: "charlie@example.com",
    joinedAt: ISODate("2021-09-15T13:45:00Z"),
  },
]);

// ✅ **제품 정보 (products)**

db.products.insertMany([
  {
    _id: "prod1",
    name: "Laptop",
    category: "Electronics",
    price: 1200,
    stock: 50,
  },
  {
    _id: "prod2",
    name: "Phone",
    category: "Electronics",
    price: 800,
    stock: 100,
  },
  {
    _id: "prod3",
    name: "Tablet",
    category: "Electronics",
    price: 600,
    stock: 70,
  },
]);

// ✅ 제품 정보를 `$lookup`으로 주문과 연결하여 제품별 판매 분석 가능

// ---

// ✅ **3. 주문 정보 (orders 컬렉션)**

db.orders.insertMany([
  {
    _id: "order1",
    userId: "user1",
    productId: "prod1",
    quantity: 2,
    amount: 2400,
    status: "completed",
    orderDate: ISODate("2024-02-01T12:00:00Z"),
    city: "Seoul",
  },
  {
    _id: "order2",
    userId: "user2",
    productId: "prod2",
    quantity: 1,
    amount: 800,
    status: "completed",
    orderDate: ISODate("2024-01-15T16:00:00Z"),
    city: "Busan",
  },
  {
    _id: "order3",
    userId: "user3",
    productId: "prod3",
    quantity: 3,
    amount: 1800,
    status: "pending",
    orderDate: ISODate("2024-02-10T09:30:00Z"),
    city: "Incheon",
  },
]);

// ✅ 주문 정보를 사용자 정보와 제품 정보와 연계 가능
// ✅ 월별 매출 및 인기 상품 분석 가능

// ---

// ### 4. 리뷰 정보 (reviews)

// 아래는 리뷰 데이터를 명확한 형식으로 수정한 코드입니다.

db.reviews.insertMany([
  {
    _id: "review1",
    userId: "user1",
    productId: "prod1",
    rating: 5,
    comment: "Excellent laptop!",
    createdAt: ISODate("2024-01-05T10:00:00Z"),
  },
  {
    _id: "review2",
    userId: "user2",
    productId: "prod2",
    rating: 4,
    comment: "Good phone, but a bit expensive.",
    createdAt: ISODate("2024-01-10T12:30:00Z"),
  },
  {
    _id: "review3",
    userId: "user3",
    productId: "prod3",
    rating: 3,
    comment: "Decent tablet for the price.",
    createdAt: ISODate("2024-02-02T15:45:00Z"),
  },
]);

// =======================================================================

// ✅ 5. locations 컬렉션 (지리 정보)
// GeoJSON 형식으로 변경)

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

// // 지리적 검색을 위해 2dsphere 인덱스 생성
db.locations.createIndex({ location: "2dsphere" });
db.locations.getIndexes();

// ✅ 지리 데이터 → $geoNear를 활용하여 사용자 위치에서
// 가장 가까운 매장 찾기 가능.

// 1. 최근 (2024-01-01) ~ (2024-03-01) 동안
// 가장 많이 판매된 제품 찾기
// db.orders.aggregate([
// $match,
// $group,
// $sort,
// $limit
// 이용하기
db.orders.aggregate([
  {
    $match: {
      orderDate: {
        $gte: ISODate("2024-01-01T00:00:00Z"),
        $lt: ISODate("2024-03-01T00:00:00Z"),
      },
    },
  }, // 1번째 스테이지,
  {
    $group: {
      _id: "$productId",
      totalSales: {
        $sum: "$quantity",
      },
    },
  }, // 2번째 스테이지,
  {
    $sort: {
      totalSales: -1,
    },
  }, // 3번째 스테이지,
  {
    $limit: 2,
  }, // 4번째 스테이지,
]);

// ✅ 2. 특정 사용자의 총 주문 금액 계산
// db.orders.aggregate([
// $match,
// $group,
// $project
// 이용하기
db.orders.aggregate([
  {
    $match: {
      userId: "user1",
    },
  },
  {
    $group: {
      _id: "$userId",
      totalAmount: { $sum: "$amount" },
      quantity: { $sum: "$quantity" },
    },
  },
  {
    $project: {
      _id: 0,
      userId: "$_id",
      totalAmount: 1,
      quantity: 1,
    },
  },
]);

// ✅ 3. 특정 반경 내 가까운(10km 내외) 매장 찾기 ($geoNear)
// 주의사항, 인덱스 생성, 샘플 데이터에서 생성 명령어 있으니 확인.
db.locations.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [126.9784, 37.5665] },
      distanceField: "distance",
      maxDistance: 10000,
      spherical: true,
    },
  },
]);

// ✅ 4.특정 카테고리("Electronics")의 제품만 필터링하기 ($match)

// db.products.aggregate
// $match
// 이용하기
db.products.aggregate([
  {
    $match: {
      category: "Electronics",
    },
  },
]);

// ✅ 5. 제품별 총 판매량 구하기 ($group)
// db.orders.aggregate([
// $lookup
// $unwind
// $group
// $sort
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "productInfo",
    },
  }, // 1번 스테이지는 외부 컬렉션과 조인 함.
  {
    $unwind: "$productInfo",
  }, // 2번 스테이지, 각 배열 요소를 , 각각의 문서로 변환.
  {
    $group: {
      _id: "$productInfo.name",
      totalSales: { $sum: "$quantity" },
    },
  }, // 3번 스테이지, 그룹 나누기.
  {
    $sort: { totalSales: -1 },
  },
]);

// ✅ 6. 최근 판매된 3개 주문 가져오기 ($sort, $limit)

// db.orders.aggregate([
db.orders.aggregate([{ $sort: { orderDate: -1 } }, { $limit: 3 }]);

// ✅ 7. 특정 사용자(userId: "user1"))의
// 총 주문 금액 구하기

// db.orders.aggregate([
// $match
// $group
// $project
// 이용하기
db.orders.aggregate([
  { $match: { userId: "user1" } },
  { $group: { _id: "$userId", totalAmount: { $sum: "$amount" } } },
  { $project: { _id: 0, userId: "$_id", totalAmount: 1 } },
]);
