---
### **ch5 코드 종합 설명**

이 코드는 MongoDB의 가장 강력한 데이터 분석 도구인 **Aggregation Framework(집계 프레임워크)**에 대해 다룹니다. 단순한 데이터 조회(`find()`)를 넘어, 흩어져 있는 대용량 데이터를 가공, 변환, 요약하여 의미 있는 통계와 인사이트를 추출하는 방법을 배웁니다. 마치 데이터 공장의 컨베이어 벨트처럼, 여러 단계를 파이프라인으로 연결하여 복잡한 데이터 처리 작업을 체계적으로 수행할 수 있습니다.
---

### **Part 1: Aggregation Framework의 개념과 기본 구조**

왜 집계 프레임워크가 필요하며, 어떤 원리로 동작하는지 이해합니다.

#### **1. 코드, 문법 및 개별 설명**

```javascript
// 기본 파이프라인 예제
db.sales.aggregate([
  { $match: { region: "Asia" } }, // 1단계: 'Asia' 지역 데이터만 필터링
  { $group: { _id: "$product", totalSales: { $sum: "$amount" } } }, // 2단계: 제품(product)별로 그룹화하여 판매액(amount)의 합계 계산
  { $sort: { totalSales: -1 } }, // 3단계: 계산된 총 판매액(totalSales)을 기준으로 내림차순 정렬
]);
```

#### **2. 해당 설명**

Aggregation Framework는 여러 개의 **'스테이지(Stage)'**를 배열(`[]`) 안에 순서대로 넣어 구성합니다. 데이터는 첫 번째 스테이지부터 시작하여 각 단계를 거치면서 점차적으로 변환되고, 최종 스테이지의 결과가 사용자에게 반환됩니다. 이 데이터의 흐름을 **'파이프라인(Pipeline)'**이라고 부릅니다.

- **파이프라인**: 데이터가 흘러가는 파이프. 각 연결 지점(스테이지)에서 데이터가 가공됩니다.
- **스테이지**: `$match`, `$group`처럼 `$`로 시작하는 연산자들로, 파이프라인의 각 처리 단계를 의미합니다. **스테이지의 순서가 결과에 직접적인 영향을 미치므로 매우 중요합니다.**
- **연산자**: `$sum`, `$avg`처럼 스테이지 내에서 구체적인 계산을 담당하는 함수들입니다.

이 방식은 복잡한 데이터 처리 로직을 작고 관리하기 쉬운 단계로 나눌 수 있어 코드의 가독성과 재사용성을 높여줍니다.

#### **3. 응용 가능한 예제**

**"온라인 강의 플랫폼에서 '데이터 과학' 카테고리의 강의 중, 평점(rating)이 4.5 이상인 강의들만 골라 수강생 수(studentCount)가 많은 순으로 상위 5개만 보고 싶은 경우"**

```javascript
db.courses.aggregate([
  // 1단계: '데이터 과학' 카테고리이면서 평점이 4.5 이상인 강의 필터링
  { $match: { category: "데이터 과학", rating: { $gte: 4.5 } } },
  // 2단계: 수강생 수가 많은 순으로 정렬
  { $sort: { studentCount: -1 } },
  // 3단계: 상위 5개 강의만 선택
  { $limit: 5 },
  // 4단계: 강의 제목, 수강생 수, 평점만 결과로 보여주기
  { $project: { _id: 0, title: 1, studentCount: 1, rating: 1 } },
]);
```

#### **4. 심화 내용 (파이프라인 최적화)**

Aggregation 파이프라인의 성능은 **스테이지 순서**에 크게 좌우됩니다. 가장 중요한 원칙은 **처리할 데이터의 양을 최대한 빨리, 최대한 많이 줄이는 것**입니다.

- **`$match`는 가능한 한 파이프라인의 맨 앞에 두세요.** 인덱스를 활용하여 초기에 데이터 양을 대폭 줄이면, 후속 스테이지들의 작업 부하가 크게 감소합니다.
- **`$sort`가 `$limit`보다 앞에 와야 합니다.** 전체 데이터를 먼저 정렬한 후 상위 N개를 잘라내야 정확한 결과를 얻을 수 있습니다.

#### **5. 추가하고 싶은 내용**

Aggregation Framework는 데이터베이스 서버 내에서 모든 연산을 수행합니다. 따라서 대용량의 데이터를 애플리케이션으로 가져와서 처리하는 것보다 네트워크 비용이 훨씬 적고 처리 속도도 빠릅니다. 빅데이터 분석 시 반드시 사용해야 하는 이유입니다.

---

### **Part 2: 기본 파이프라인 스테이지 (필터링, 그룹화, 정렬, 제한)**

데이터를 다룰 때 가장 기본적이면서도 핵심적인 스테이지들을 익힙니다.

#### **1. 코드, 문법 및 개별 설명**

```javascript
// 1. $match (필터링)
db.sales.aggregate([{ $match: { product: "Tablet" } }]);
// : 'product' 필드가 "Tablet"인 문서들만 다음 스테이지로 전달합니다. SQL의 WHERE 절과 같습니다.

// 2. $group (그룹화)
db.sales.aggregate([
  { $group: { _id: "$product", totalSales: { $sum: "$amount" } } },
]);
// : '$product' 필드의 고유한 값들을 기준으로 문서들을 그룹화하고, 각 그룹별로 '$amount'의 합계를 계산하여 'totalSales'라는 새 필드에 저장합니다.

// 3. $sort (정렬)
db.sales.aggregate([{ $sort: { amount: -1 } }]);
// : 'amount' 필드를 기준으로 내림차순(-1)으로 문서를 정렬합니다. 오름차순은 1입니다.

// 4. $limit, $skip (개수 제한 및 건너뛰기)
db.sales.aggregate([{ $skip: 3 }, { $limit: 3 }]);
// : 처음 3개의 문서를 건너뛰고, 그 다음부터 3개의 문서만 선택합니다. 페이지네이션(Paging) 구현의 핵심입니다.

// 5. $project (필드 선택)
db.sales.aggregate([{ $project: { _id: 0, product: 1, amount: 1 } }]);
// : 결과 문서에 'product'와 'amount' 필드만 포함시키고(1), '_id' 필드는 제외(0)합니다.
```

#### **2. 해당 설명**

- **`$match`**: 파이프라인의 시작점. 처리할 데이터의 범위를 좁히는 역할을 합니다.
- **`$group`**: Aggregation의 꽃. 데이터를 요약하고 통계를 낼 때 사용합니다. `_id` 필드에 그룹화할 기준 필드를 지정하고, 나머지 필드에는 `$sum`, `$avg`, `$max`, `$min`, `$push` 등의 집계 연산자를 사용합니다.
- **`$sort`**: 결과를 원하는 순서로 나열합니다.
- **`$skip` & `$limit`**: 대량의 결과를 페이지 단위로 나눠서 보여줄 때 함께 사용됩니다.
- **`$project`**: 결과의 형태(모양)를 재구성합니다. 필드를 선택, 제외하거나, 기존 필드를 조합하여 새로운 필드를 만들 수도 있습니다.

#### **3. 응용 가능한 예제**

- **`$match` 실무 활용**: "최근 한 달 동안 '탈퇴' 상태로 변경된 비활성 사용자 목록 조회"
  ```javascript
  db.users.aggregate([
    {
      $match: {
        status: "inactive",
        statusChangedAt: {
          $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
  ]);
  ```
- **`$group` 실무 활용**: "국가별 사용자 수와 평균 연령 계산"
  ```javascript
  db.users.aggregate([
    {
      $group: {
        _id: "$country",
        userCount: { $sum: 1 },
        avgAge: { $avg: "$age" },
      },
    },
  ]);
  ```
- **`$limit` & `$skip` 실무 활용**: "블로그 게시글 목록 3페이지 보기 (한 페이지에 10개씩)"
  ```javascript
  const page = 3;
  const pageSize = 10;
  db.posts.aggregate([
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * pageSize },
    { $limit: pageSize },
  ]);
  ```

#### **4. 심화 내용 (`$project`의 필드 재구성)**

`$project`는 단순히 필드를 보여주거나 숨기는 것 외에, 새로운 필드를 동적으로 생성하는 강력한 기능이 있습니다.

```javascript
// 'firstName'과 'lastName' 필드를 합쳐 'fullName' 필드 생성하기
db.users.aggregate([
  {
    $project: {
      _id: 0,
      fullName: { $concat: ["$firstName", " ", "$lastName"] }, // 문자열 합치기 연산자
      email: 1,
    },
  },
]);
```

#### **5. 추가하고 싶은 내용**

`$group`에서 `_id`에 `null` 값을 사용하면 전체 문서(컬렉션)를 하나의 그룹으로 묶어 전체 통계를 낼 수 있습니다. 예를 들어, `db.sales.aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$amount" } } }])`는 전체 판매액 총합을 계산합니다.

---

### **Part 3: 데이터 구조 변환 스테이지 (`$unwind`, `$lookup`, `$addFields`)**

문서의 구조를 바꾸거나 여러 컬렉션의 데이터를 결합하는, 한 단계 더 나아간 스테이지들입니다.

#### **1. 코드, 문법 및 개별 설명**

```javascript
// 7. $unwind (배열 펼치기)
db.orders.aggregate([{ $unwind: "$items" }]);
// : 'items' 배열의 각 요소를 별개의 문서로 분리합니다. 'items'가 ["apple", "banana"]인 문서 하나가 'items'가 "apple"인 문서와 "banana"인 문서 두 개로 복제되어 펼쳐집니다.

// 8. $lookup (조인)
db.orders.aggregate([
  {
    $lookup: {
      from: "users", // 조인할 대상 컬렉션
      localField: "userId", // 'orders' 컬렉션의 조인 키
      foreignField: "_id", // 'users' 컬렉션의 조인 키
      as: "userInfo", // 조인된 결과가 저장될 새 필드 이름
    },
  },
]);
// : 'orders' 컬렉션의 'userId'와 'users' 컬렉션의 '_id'를 기준으로 두 컬렉션을 합칩니다(Left Outer Join).

// 9. $addFields (필드 추가)
db.orders.aggregate([
  { $addFields: { totalPrice: { $multiply: ["$price", "$quantity"] } } },
]);
// : 'price'와 'quantity' 필드를 곱한 결과를 'totalPrice'라는 새 필드로 추가합니다. '$project'와 달리 기존 필드를 모두 유지합니다.
```

#### **2. 해당 설명**

- **`$unwind`**: 배열 형태의 데이터를 다룰 때 필수적입니다. 태그, 주문 상품 목록, 로그 기록 등 배열의 각 항목을 개별적으로 분석하고 싶을 때 사용합니다.
- **`$lookup`**: 관계형 데이터베이스(RDBMS)의 `JOIN`과 같은 역할을 합니다. 정규화된 여러 컬렉션의 데이터를 합쳐서 한 번에 조회할 수 있게 해줍니다.
- **`$addFields`**: 기존 문서 구조를 유지하면서 계산된 필드나 고정 값을 추가하고 싶을 때 유용합니다. `$project`는 명시된 필드만 남기지만, `$addFields`는 모든 필드를 보존하며 새 필드만 덧붙입니다.

#### **3. 응용 가능한 예제**

- **`$unwind` 실무 활용**: "가장 많이 사용된 블로그 게시물 태그 Top 10 찾기"
  ```javascript
  db.posts.aggregate([
    { $unwind: "$tags" }, // 1. tags 배열을 펼침
    { $group: { _id: "$tags", count: { $sum: 1 } } }, // 2. 태그별로 개수를 셈
    { $sort: { count: -1 } }, // 3. 개수가 많은 순으로 정렬
    { $limit: 10 }, // 4. 상위 10개만 선택
  ]);
  ```
- **`$lookup` + `$unwind`**: `$lookup`의 결과(`as` 필드)는 항상 배열입니다. 조인된 결과가 단 하나인 것이 확실하다면, `$unwind`를 바로 뒤에 붙여 배열을 풀어주는 패턴이 자주 사용됩니다.
  ```javascript
  db.orders.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" }, // userInfo 배열을 풀어서 객체로 만듦
  ]);
  ```

#### **4. 심화 내용 (`$lookup` 성능)**

`$lookup`은 매우 강력하지만 성능 저하의 원인이 될 수 있습니다. 특히 조인 대상 컬렉션(`from`)의 조인 키 필드(`foreignField`)에 **인덱스가 없으면** 매번 풀 스캔을 수행하여 매우 느려집니다. `$lookup`을 사용하기 전, `foreignField`에 인덱스가 있는지 반드시 확인해야 합니다.

---

### **Part 4: 고급 집계 및 출력 스테이지**

한 번에 여러 분석을 수행하거나, 결과를 다른 곳에 저장하고, 특정 조건에 따라 데이터를 분류하는 고급 기법들입니다.

#### **1. 코드, 문법 및 개별 설명**

```javascript
// 10. $out (결과를 새 컬렉션에 저장)
db.orders.aggregate([ ... , { $out: "sales_summary" }]);
// : 파이프라인의 최종 결과를 'sales_summary'라는 새 컬렉션에 저장합니다. 기존에 컬렉션이 있다면 덮어씁니다.

// 11. $count (문서 개수 세기)
db.salesB.aggregate([
  { $match: { status: "completed" } },
  { $count: "completedOrders" },
]);
// : 파이프라인의 이전 단계를 통과한 문서의 총 개수를 'completedOrders'라는 필드에 담아 반환합니다.

// 12. $facet (다중 파이프라인 동시 실행)
db.salesB.aggregate([
  {
    $facet: {
      totalSales: [ /* 파이프라인 1 */ ],
      topProducts: [ /* 파이프라인 2 */ ],
    },
  },
]);
// : 하나의 입력 데이터에 대해 여러 개의 독립적인 파이프라인을 동시에 실행하고, 각 결과를 별개의 필드로 묶어 반환합니다.

// 13. $bucket (범위별 그룹화)
db.salesB.aggregate([
  {
    $bucket: {
      groupBy: "$amount",
      boundaries: [30000, 60000, 120000],
      default: "Other",
      output: { /* ... */ }
    }
  }
]);
// : 숫자 필드('amount')를 지정된 경계값('boundaries') 기준으로 구간을 나누어 그룹화합니다. 가격대, 연령대별 분석에 유용합니다.
```

#### **2. 해당 설명**

- **`$out`**: 집계 결과가 매우 크거나, 나중에 재사용해야 할 때 유용합니다. 무거운 집계 작업을 매번 실행하는 대신, 주기적으로 `$out`으로 결과를 저장해두고 빠르게 조회할 수 있습니다.
- **`$count`**: `...group({_id:null, count:{$sum:1}})`의 단축형입니다. 단순히 개수만 필요할 때 더 간결하게 사용할 수 있습니다.
- **`$facet`**: 대시보드를 만들 때 최고의 효율을 보여줍니다. '총 매출', '카테고리별 매출', '인기 상품 Top 5' 등을 각각 다른 쿼리로 요청할 필요 없이, 단 한 번의 쿼리로 모든 정보를 얻을 수 있습니다.
- **`$bucket`**: 연속적인 숫자 데이터를 이산적인 구간(카테고리)으로 만들어 분석할 때 사용합니다. '3만원 미만', '3~6만원', '6~12만원', '12만원 이상' 등으로 자동으로 묶어줍니다.

#### **3. 응용 가능한 예제**

- **`$out` 실무 활용**: "매일 자정에 어제의 사용자 활동 로그를 분석하여 'daily_user_activity_report' 컬렉션에 통계 저장하기 (백그라운드 배치 작업)"
- **`$facet` 실무 활용**: "영화 평점 사이트에서 한 영화에 대한 정보 요약 페이지 구성"
  ```javascript
  db.reviews.aggregate([
    { $match: { movieId: 123 } },
    {
      $facet: {
        averageRating: [
          { $group: { _id: null, avgRating: { $avg: "$rating" } } },
        ],
        ratingsByStar: [
          {
            $bucket: {
              groupBy: "$rating",
              boundaries: [1, 2, 3, 4, 5, 6],
              output: { count: { $sum: 1 } },
            },
          },
        ],
        latestReviews: [{ $sort: { createdAt: -1 } }, { $limit: 5 }],
      },
    },
  ]);
  ```

#### **4. 심화 내용 (`$merge` vs `$out`)**

`$out`은 대상 컬렉션을 완전히 덮어쓰지만, `$merge`(Part 5에서 설명)는 더 유연합니다. `$merge`는 집계 결과를 기존 컬렉션에 병합하면서, ID가 일치하는 문서는 업데이트하고, 없는 문서는 새로 삽입하는 등 다양한 동작을 지정할 수 있습니다. 실시간으로 누적 데이터를 갱신할 때 매우 유용합니다.

---

_이어서 Part 5와 6에서 나머지 고급 스테이지들을 설명하겠습니다._

---

### **Part 5: 특수 목적 및 고급 스테이지**

위치 기반 검색, 텍스트 검색, 랜덤 샘플링 등 특정 도메인 문제를 해결하는 데 특화된 스테이지들입니다.

#### **1. 코드, 문법 및 개별 설명**

```javascript
// 14. $merge (결과를 기존 컬렉션에 병합)
db.salesB.aggregate([ ... , { $merge: "sales_summary" }]);
// : 파이프라인 결과를 'sales_summary' 컬렉션에 병합합니다. _id가 같으면 덮어쓰고, 없으면 새로 삽입합니다. (기본 동작)

// 15. $sample (랜덤 샘플링)
db.salesB.aggregate([{ $sample: { size: 1 } }]);
// : 컬렉션에서 무작위로 1개의 문서를 추출합니다.

// 16. $geoNear (지리 공간 검색)
db.locations.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [126.9784, 37.5665] }, // 기준점
      distanceField: "distance", // 거리가 저장될 필드
      maxDistance: 5000,         // 최대 반경 (미터)
      spherical: true,           // 구체 거리 계산 여부
    },
  },
]);
// : 'near' 좌표에서 가장 가까운 순서대로 문서를 정렬하고, 각 문서와의 거리를 'distance' 필드에 추가합니다. 반드시 파이프라인의 첫 번째 스테이지여야 하며, 2dsphere 인덱스가 필요합니다.

// 17. $text (텍스트 검색)
db.products.aggregate([{ $match: { $text: { $search: "laptop" } } }]);
// : 'text' 인덱스가 생성된 필드에서 "laptop"이라는 키워드로 전문 검색(Full-Text Search)을 수행합니다. $match 스테이지 안에서 사용됩니다.
```

#### **2. 해당 설명**

- **`$merge`**: `$out`의 발전된 형태로, 데이터를 덮어쓰는 대신 '업데이트 또는 삽입(upsert)' 로직을 수행합니다. 일일 통계를 매일 누적하거나, 변경된 정보만 갱신하는 시나리오에 적합합니다.
- **`$sample`**: 데이터의 분포를 대략적으로 확인하거나, 테스트용 데이터를 무작위로 뽑거나, AI 모델 학습용 데이터셋을 만들 때 유용합니다.
- **`$geoNear`**: 위치 기반 서비스의 핵심입니다. '내 주변 1km 이내 카페 찾기'와 같은 기능을 구현합니다. 거리순으로 자동 정렬되는 특징이 있습니다.
- **`$text`**: 단순한 문자열 일치가 아닌, 단어의 어근 분석, 불용어 처리 등을 포함하는 고기능 텍스트 검색을 제공합니다. 블로그 본문, 상품 설명 등 긴 텍스트에서 검색 기능을 구현할 때 사용합니다.

#### **3. 응용 가능한 예제**

- **`$merge` 실무 활용**: "시간대별 API 요청 수를 집계하여 'api_usage_hourly' 컬렉션에 지속적으로 업데이트"
  ```javascript
  // 1시간마다 이 쿼리를 실행한다고 가정
  db.logs.aggregate([
    {
      $match: {
        timestamp: {
          /* 최근 1시간 */
        },
      },
    },
    {
      $group: {
        _id: { apiName: "$apiName", hour: { $hour: "$timestamp" } },
        count: { $sum: 1 },
      },
    },
    {
      $merge: {
        into: "api_usage_hourly",
        on: "_id", // _id 필드(apiName, hour)가 같으면
        whenMatched: "merge", // 문서를 병합 (count 필드를 더함)
        whenNotMatched: "insert", // 없으면 새로 삽입
      },
    },
  ]);
  ```
- **`$text` 실무 활용**: "쇼핑몰에서 '가볍고 성능 좋은 노트북' 검색하기"
  ```javascript
  db.products.createIndex({ name: "text", description: "text" }); // 이름과 설명에 text 인덱스 생성
  db.products.aggregate([
    // '가볍고'는 무시, '성능'과 '좋은'은 '좋다'로, '노트북'은 그대로 검색
    { $match: { $text: { $search: "가볍고 성능 좋은 노트북" } } },
    { $sort: { score: { $meta: "textScore" } } }, // 검색 관련도 순으로 정렬
  ]);
  ```

---

### **Part 6: 문서 구조 재작성 및 제어 스테이지**

문서의 구조를 동적으로 변경하거나, 특정 조건에 따라 데이터를 필터링하는 고급 스테이지들입니다.

#### **1. 코드, 문법 및 개별 설명**

```javascript
// 18. $replaceRoot (루트 문서 교체)
db.salesB.aggregate([ ... , { $replaceRoot: { newRoot: "$userDetails" } }]);
// : 파이프라인을 통과한 문서의 최상위(root) 구조를 'userDetails' 필드의 내용으로 완전히 교체합니다.

// 19. $redact (조건부 필터링)
db.users2.aggregate([
  {
    $redact: {
      $cond: {
        if: { $eq: ["$role", "admin"] },
        then: "$$KEEP", // 조건을 만족하면 문서를 유지
        else: "$$PRUNE", // 만족하지 않으면 문서를 버림
      },
    },
  },
]);
// : 문서의 필드 값에 따라 문서를 통과시키거나($$KEEP), 버리거나($$PRUNE), 특정 필드만 내리는($$DESCEND) 등 계층적인 접근 제어를 수행합니다.

// 20. $setWindowFields (윈도우 함수)
db.salesB.aggregate([
  {
    $setWindowFields: {
      partitionBy: "$category",    // 파티션(그룹) 기준
      sortBy: { date: 1 },        // 파티션 내 정렬 기준
      output: {
        runningTotal: { // 새 필드 이름
          $sum: "$amount",
          window: { documents: ["unbounded", "current"] } // 윈도우(범위) 설정
        }
      }
    }
  }
]);
// : 그룹 내에서 순서를 기준으로 누적 합계, 이동 평균 등 SQL의 윈도우 함수와 유사한 계산을 수행합니다. $group과 달리 문서를 하나로 합치지 않습니다.
```

#### **2. 해당 설명**

- **`$replaceRoot`**: `$lookup`으로 조인한 하위 문서를 메인 문서로 승격시키고 싶을 때 매우 유용합니다. 불필요한 상위 필드를 모두 제거하고 원하는 객체만 결과로 만들 수 있습니다.
- **`$redact`**: 사용자 역할(role)이나 보안 등급(level)에 따라 접근 가능한 데이터를 동적으로 필터링해야 하는 복잡한 권한 관리 시나리오에 사용됩니다.
- **`$setWindowFields`**: 데이터 분석의 끝판왕. 카테고리별 누적 매출 추이, 최근 7일간의 이동 평균 주가, 전월 대비 매출 성장률 등 순서가 중요한 시계열 데이터 분석에 강력한 기능을 제공합니다.

#### **3. 응용 가능한 예제**

- **`$replaceRoot` 실무 활용**: "특정 주문(`_id: 1`)을 한 사용자의 정보만 깔끔하게 조회하기"
  ```javascript
  db.orders.aggregate([
    { $match: { _id: 1 } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $replaceRoot: { newRoot: "$user" } }, // 주문 정보는 사라지고 사용자 정보만 남음
  ]);
  ```
- **`$setWindowFields` 실무 활용**: "월별 매출 데이터에서, 각 월의 매출이 전월 대비 얼마나 증가/감소했는지 계산하기"
  ```javascript
  db.monthly_sales.aggregate([
    { $sort: { month: 1 } }, // 시간순 정렬
    {
      $setWindowFields: {
        sortBy: { month: 1 },
        output: {
          previousMonthSales: {
            $shift: { output: "$sales", by: -1, default: 0 }, // 이전(-1) 문서의 sales 값을 가져옴
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        month: 1,
        sales: 1,
        growth: { $subtract: ["$sales", "$previousMonthSales"] }, // (이번 달 매출 - 저번 달 매출)
      },
    },
  ]);
  ```
