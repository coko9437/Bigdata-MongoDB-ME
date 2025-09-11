//  인덱스 (Index) 정리 및 예제
// _에서는 인덱스를 활용하여 데이터를 빠르게 검색하고
// 쿼리 성능을 최적화할 수 있습니다.

// 아래는 _ 인덱스의 개념, 기본 문법, 예제 및 실무 활용
// 사례를 정리한 내용입니다.

// 1_인덱스 생성 및 조회
// 📌 인덱스란?
// 인덱스는 데이터베이스에서 검색 속도를 높이기 위해
// 사용되는 자료 구조입니다.
// 인덱스를 사용하면 특정 필드에서 검색할 때
// O(n) → O(log n) 으로 속도가 향상됩니다.
// 기본적으로 _id 필드에 자동 인덱스가 생성됩니다.


// 🔍 세부 분석
// O(n) (선형 탐색, Linear Search)

// 인덱스가 없는 경우, _는 전체 컬렉션을 하나씩
// 탐색(Full Collection Scan)해야 함.

// 컬렉션의 크기가 커질수록 탐색 시간이 선형적으로 증가함.
// 예를 들어, db.users.find({ age: 30 })을 실행하면,
// 인덱스가 없을 경우 모든 문서를 검사(Full Scan) 해야 함.

// O(log n) (이진 탐색, Binary Search)

// 인덱스를 생성하면 _는 B-Tree 구조를 사용하여 검색 속도를 개선.
// 데이터를 정렬된 트리 구조로 유지하므로 로그(log) 복잡도로 빠르게 탐색 가능.
// 예를 들어,
// db.users.find({ age: 30 })을 실행할 때,
// 인덱스가 존재하면 트리 기반 탐색을 수행하여 검색 속도가 O(log n)으로 감소.


// 📌 Big-O 표기법이란?
// 알고리즘의 시간 복잡도(Time Complexity) 나
// 공간 복잡도(Space Complexity) 를 나타내는 표준 표기법입니다.

// 입력 크기 n에 대해 실행 시간이 어떻게 증가하는지를 분석하는 데 사용됩니다.
// O(n) 은 특정 알고리즘이 입력 크기 n에 비례하는 실행 시간을 가진다는 의미입니다.

// 🔹 예제: O(n) 시간 복잡도를 가지는 알고리즘

// def print_numbers(n):
//     for i in range(n):  # n번 반복
//         print(i)
// 위 함수는 n번 반복되므로, 실행 시간은 O(n) 입니다.

// ✅ 예제
// 1_인덱스 없이 검색 (O(n))
// _

// db.users.find({ age: 30 })
// users 컬렉션에 1,000,000개 문서가 있다면, 최악의 경우 1,000,000번 비교해야 함.
// 즉, 실행 시간이 데이터 개수(n)에 비례하여 증가함 → O(n)

// 2_ 인덱스를 사용한 검색 (O(log n))
// _

// db.users.createIndex({ age: 1 })  // age 필드에 오름차순(1) 인덱스 생성
// db.users.find({ age: 30 })
// B-Tree 기반 인덱스를 사용하면, 1,000,000개의 문서에서도 로그(log) 시간에
// 탐색 가능.
// 예를 들어, log2(1,000,000) ≈ 20이므로,
// 약 20번만 비교하면 원하는 데이터를 찾을 수 있음.
// 즉, 실행 시간이 O(log n)으로 향상됨.


db.users.insertMany([
  { name: "Alice", age: 29, city: "Seoul", email: "alice@gmail.com", joinedAt: ISODate("2023-05-10T10:30:00Z") },
  { name: "Bob", age: 35, city: "Busan", email: "bob@yahoo.com", joinedAt: ISODate("2021-11-20T08:15:00Z") },
  { name: "Charlie", age: 40, city: "Incheon", email: "charlie@hotmail.com", joinedAt: ISODate("2020-09-15T13:45:00Z") }
])

// 인덱스 생성
db.users.createIndex({ age: 1 }) // 단일 키 인덱스
db.users.createIndex({ age: 1, city: 1 }) // 복합 인덱스
db.users.createIndex({ email: 1 }, { unique: true }) // 유니크 인덱스


// ✅ 인덱스 생성

db.users.createIndex({ age: 1 })  // 오름차순 (Ascending)
db.users.createIndex({ age: -1 }) // 내림차순 (Descending)


// ➤ 설명: age 필드에 오름차순/내림차순 인덱스를 생성.

// ✅ 현재 컬렉션의 인덱스 조회

db.users.getIndexes()
// ➤ 출력 예제:

on

[
  { "v": 2, "key": { "_id": 1 }, "name": "_id_" },
  { "v": 2, "key": { "age": 1 }, "name": "age_1" }
]
// ➤ 설명: _id 필드는 기본 인덱스, age 필드는 사용자가 생성한 인덱스.

// ✅ 인덱스 삭제

db.users.dropIndex("age_1")

// ➤ 설명: age_1 인덱스를 삭제.

// ✅ 모든 인덱스 삭제

db.users.dropIndexes()

// ➤ 설명: 컬렉션의 모든 인덱스를 삭제.


// 2_Single-key Index & Compound Index

// 📌 1. 단일 키 인덱스 (Single-key Index)
// 하나의 필드에 대한 인덱스
// 특정 컬럼의 조회 속도를 높이기 위해 사용

db.users.createIndex({ name: 1 })

// 실무 활용 사례:
// ✅ name 필드를 자주 검색하는 경우 (db.users.find({ name: "Alice" }))

// 📌 2. 복합 인덱스 (Compound Index)
// 두 개 이상의 필드에 대해 인덱스 생성
// AND 조건 검색이 빠르게 처리됨.
// 정렬 조건에도 영향을 줌 (sort()에서 인덱스를 활용 가능)

db.users.createIndex({ age: 1, city: 1 })
// 실무 활용 사례:
// ✅ age와 city 두 가지 조건을 동시에 검색할 경우
(db.users.find({ age: 30, city: "Seoul" }))

// 3_Non-Unique Index & Unique Index

// 📌 1. 일반 인덱스 (Non-Unique Index)
// 기본적으로 중복을 허용하는 인덱스

db.users.createIndex({ email: 1 })

// ✅ email 필드를 검색할 때 빠르게 찾을 수 있음.


// 📌 2. 고유 인덱스 (Unique Index)
// 중복을 허용하지 않는 인덱스.
// email처럼 중복되면 안 되는 데이터를 저장할 때 사용.

db.users.createIndex({ email: 1 }, { unique: true })

// ✅ 중복된 email 삽입 시 오류 발생

on

{
  "errmsg": "E11000 duplicate key error collection",
  "code": 11000
}

// 4_Sparse Index
// 📌 정의
// 필드가 존재하는 경우에만 인덱스를 생성
// (필드가 없는 문서는 인덱스에서 제외됨)
// NULL 값이 많은 경우 유용함 ($exists: false 검색이 빠름)


db.customers.insertMany([
  { name: "David", email: "david@example.com", location: "Seoul" },
  { name: "Emma", email: "emma@example.com" },
  { name: "Frank", email: "frank@example.com", location: "Busan" }
])

// Sparse Index 생성 (location 필드가 존재하는 경우만 인덱스 생성)
db.customers.createIndex({ location: 1 }, { sparse: true })



db.users.createIndex({ location: 1 }, { sparse: true })


// ✅ location 필드가 존재하는 문서에서만 인덱스를 생성.
// ✅ location이 없는 문서는 인덱스에 포함되지 않아 공간 절약 가능.


// 5_Partial Index
// 📌 정의
// 특정 조건을 만족하는 문서에 대해서만 인덱스를 생성.
// 저장 공간 절약 & 쿼리 속도 최적화

db.users.createIndex({ age: 1 }, { partialFilterExpression: { age: { $gte: 30 } } })
// ✅ age >= 30인 문서에 대해서만 인덱스를 생성.

db.employees.insertMany([
  { name: "Grace", age: 45, role: "Manager" },
  { name: "Henry", age: 25, role: "Intern" },
  { name: "Ivy", age: 50, role: "Manager" }
])

// 40세 이상 직원만 인덱스 포함
db.employees.createIndex({ age: 1 }, { partialFilterExpression: { age: { $gte: 40 } } })


// 6_Background Index
// 📌 정의
// 백그라운드에서 실행되는 인덱스
// 기존 데이터에 영향을 주지 않고 인덱스를 생성.

db.users.createIndex({ age: 1 }, { background: true })


db.transactions.insertMany([
  { user: "Alice", amount: 500, date: ISODate("2024-01-01T10:00:00Z") },
  { user: "Bob", amount: 1000, date: ISODate("2024-02-01T12:00:00Z") }
])

// 백그라운드에서 인덱스 생성
db.transactions.createIndex({ date: 1 }, { background: true })



// ✅ 대량 데이터가 있는 프로덕션 환경에서 사용됨.
// ✅ 데이터 삽입/조회 중에도 인덱스 생성 가능.

// 7_Covered Index
// 📌 정의
// 쿼리 실행 시 인덱스에서만 데이터를 가져올 수 있도록 하는 인덱스
// 데이터베이스 디스크 I/O 감소


db.users.createIndex({ name: 1, age: 1 })
db.users.find({ name: "Alice" }, { _id: 0, name: 1, age: 1 })
// ✅ name과 age 필드만 요청하면, 디스크 조회 없이 인덱스에서 직접 가져옴.
// ✅ 쿼리 속도가 빨라짐.


db.products.insertMany([
  { name: "Laptop", price: 1200, category: "Electronics" },
  { name: "Phone", price: 800, category: "Electronics" }
])

// 커버드 인덱스 생성
db.products.createIndex({ name: 1, price: 1 })

// 인덱스만 사용한 검색 (디스크 조회 없음)
db.products.find({ name: "Laptop" }, { _id: 0, name: 1, price: 1 })



// 8_GeoSpatial Index (지리 정보 인덱스)
// 📌 정의
// 위도/경도 좌표 데이터를 빠르게 검색하는 인덱스
// 위치 기반 검색이 필요한 경우 사용됨.

db.locations.insertMany([
  { "name": "Seoul Tower", coordinates: [126.9784, 37.5665] },
  { "name": "Haeundae Beach", coordinates: [129.1611, 35.1587] },
   { "name": "Namsan Park", "coordinates": [126.9921, 37.5512] },
  { "name": "Gyeongbokgung Palace", "coordinates": [126.9769, 37.5796] },
  { "name": "Lotte World", "coordinates": [127.0996, 37.5112] },
  { "name": "Jeju Island", "coordinates": [126.5312, 33.4996] },
  { "name": "Busan Tower", "coordinates": [129.0327, 35.1019] },
  { "name": "Incheon Airport", "coordinates": [126.4512, 37.4602] },
  { "name": "Daegu Tower", "coordinates": [128.5986, 35.8714] },
  { "name": "Gwangalli Beach", "coordinates": [129.1202, 35.1554] },
  { "name": "Daejeon Expo Park", "coordinates": [127.3845, 36.3745] },
  { "name": "Ulsan Grand Park", "coordinates": [129.3151, 35.5438] },
  { "name": "Gimhae International Airport", "coordinates": [128.9532, 35.1796] },
  { "name": "Seoraksan National Park", "coordinates": [128.4657, 38.1195] },
  { "name": "Suwon Hwaseong Fortress", "coordinates": [127.0093, 37.2851] }
])


// 지리 공간 인덱스 생성
// 구와 같은 둥근 표면의 위치 데이터를 빠르고 효율적으로 검색하기 위해 인덱스
// 2dsphere 인덱스는 
// 위도와 경도 좌표를 실제 지구처럼 둥근 구체(Sphere) 위의 점으로 계산하여 데이터를 관리합니다. 평면 지도가 아닌 지구본 위에 위치 정보를 저장하고 검색하는 것과 같습니다.
//이를 통해 지구의 곡률로 인한 거리 왜곡 없이 정확한 계산이 가능해집니다.

// 도서관의 '주제별 지도'
//도서관에 전 세계 지도책만 모아놓은 서가가 있다고 상상해 보세요.

// 인덱스 없을 때: 
// "서울 시청 근처 1km 안에 있는 도서관"을 찾으려면, 
// 모든 지도책을 하나씩 꺼내 서울 시청을 찾고 실제 거리를 계산해야 합니다.

// 2dsphere 인덱스 있을 때: 
// 사서가 지구본 모양의 특별한 '주제별 지도'를 가지고 있습니다. 
// 이 지도에는 각 도서관의 위치가 표시되어 있어, 
// 사서는 서울 시청 위치에 컴퍼스를 대고 
// 원을 그려 그 안에 포함되는 도서관을 즉시 찾아줍니다.

db.locations.createIndex({ coordinates: "2dsphere" })



db.locations.createIndex({ coordinates: "2dsphere" })
// ✅ coordinates 필드에 지리 공간 인덱스 생성.

// ✅ 1. $center (원형 검색)

db.locations.find({
  coordinates: { $geoWithin: { $center: [[126.9784, 37.5665], 1] } }
})

// ✅ 서울타워(평면 지도 기준 원 안에 포함된 모든 장소)
//  좌표 [126.9784, 37.5665]에서 10(degree , 도)= 반경 약 1100km 내 검색.
// 1도 , 약 110 km  

// ✅ 2. $box (사각형 검색)

db.locations.find({
  coordinates: { $geoWithin: { $box: [[126.9, 37.5], [127.1, 37.7]] } }
})
// ✅ 특정 좌표 범위 내 검색.

// ✅ 3. $polygon (다각형 검색)

db.locations.find({
  coordinates: { $geoWithin: { $polygon: [[126.9, 37.5], [127.0, 37.6], [127.1, 37.5]] } }
})
// ✅ 특정 다각형 영역 내 검색.

// ✅ 4. $nearSphere (구형 거리 검색)

db.locations.find({
  coordinates: {
    $nearSphere: {
      $geometry: { type: "Point", coordinates: [126.9784, 37.5665] },
      $maxDistance: 10000  // 10km (단위: 미터)
    }
  }
})
// ✅ 반경 10km 내에 있는 위치 검색.



db.businesses.insertMany([
  { name: "Cafe A", branches: [{ type: "Point", coordinates: [126.9784, 37.5665] }] },
  { name: "Cafe B", branches: [{ type: "Point", coordinates: [129.1611, 35.1587] }] },
  { name: "Cafe C", branches: [{ type: "Point", coordinates: [127.0276, 37.4979] }] },
  { name: "Restaurant D", branches: [{ type: "Point", coordinates: [126.9335, 37.5560] }] },
  { name: "Bar E", branches: [{ type: "Point", coordinates: [127.0396, 37.5013] }] },
  { name: "Bookstore F", branches: [{ type: "Point", coordinates: [126.9781, 37.5700] }] },
  { name: "Gym G", branches: [{ type: "Point", coordinates: [127.0245, 37.5825] }] },
  { name: "Hotel H", branches: [{ type: "Point", coordinates: [129.0653, 35.1798] }] },
  { name: "Cinema I", branches: [{ type: "Point", coordinates: [127.1150, 37.5133] }] },
  { name: "Supermarket J", branches: [{ type: "Point", coordinates: [126.8955, 37.5552] }] }
])

// 지리 공간 인덱스 생성
db.businesses.createIndex({ "branches.coordinates": "2dsphere" })

// 1_1_$nearSphere (구형 거리 검색)



db.locations.find({
  coordinates: {
    $nearSphere: {
      $geometry: { type: "Point", coordinates: [126.9784, 37.5665] },
      $maxDistance: 5000
    }
  }
})
// ✅ 반경 5km 내의 장소 검색.

// 1_2_GeoMetry 인덱스 (places 컬렉션)



db.places.insertMany([
  { name: "Park", location: { type: "Point", coordinates: [126.9784, 37.5665] } },
  { name: "Mall", location: { type: "Point", coordinates: [129.1611, 35.1587] } }
])

// 지리 정보 인덱스 생성
db.places.createIndex({ location: "2dsphere" })

// ✅ GeoON 형식의 좌표 데이터를 빠르게 검색 가능.


// 🔥 실무 활용 사례
// ✅ 전자 상거래 - 빠른 상품 검색 (Covered Index)
// ✅ 위치 기반 앱 - 반경 내 매장 검색 (GeoSpatial Index)
// ✅ SNS - 특정 조건의 사용자 필터링 (Partial Index)