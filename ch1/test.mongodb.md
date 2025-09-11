**"Part별 주제 나누기 + 각 Part 안에 [코드/설명] → [상세설명] → [응용] → [심화] → [추가] 순서"**

---

### **ch1 코드 종합 설명**

VSCode MongoDB Playground의 기본 템플릿 코드입니다. 이 코드를 통해 MongoDB의 가장 기본적인 데이터 **선택, 삽입, 조회, 집계** 방법을 배울 수 있습니다.

---

### **Part 1: 데이터베이스 선택**

작업을 수행할 데이터베이스를 지정하는 단계입니다.

#### **1. 코드, 문법 및 개별 설명**

```
javascript
// Select the database to use.
use("mongodbVSCodePlaygroundDB");

```

: 앞으로의 모든 작업을 `mongodbVSCodePlaygroundDB` 라는 이름의 데이터베이스에서 수행하도록 지정합니다.

#### **2. 해당 설명**

`use("데이터베이스이름")` 명령어는 SQL의 `USE database;` 와 유사한 역할을 합니다. 앞으로 실행될 모든 명령어(데이터 삽입, 조회 등)의 기본 작업 공간을 설정하는 것입니다. 만약 해당 이름의 데이터베이스가 존재하지 않더라도 오류가 발생하지 않으며, 이후 첫 데이터가 삽입되는 시점에 자동으로 생성됩니다.

#### **3. 응용 가능한 예제**

다른 프로젝트를 위해 새로운 데이터베이스를 사용하고 싶을 때, 간단히 `use` 명령어를 다시 사용하면 됩니다.

```javascript
// 'myBlog' 라는 이름의 데이터베이스로 작업 공간을 변경합니다.
use("myBlog");
```

#### **4. 심화 내용**

현재 내가 어떤 데이터베이스를 사용하고 있는지 확인하고 싶을 때는 `db` 라고만 입력하고 실행하면 됩니다. 현재 선택된 데이터베이스의 이름을 반환해 줍니다.

```javascript
// 현재 사용 중인 데이터베이스의 이름을 출력합니다.
db;
```

#### **5. 추가하고 싶은 내용**

VSCode Playground나 `mongosh` 같은 대화형 쉘 환경에서는 `use` 명령어가 매우 유용합니다. 하지만 실제 애플리케이션 코드(Node.js, Python 등)에서는 데이터베이스에 연결할 때 연결 문자열(Connection String)에 데이터베이스 이름을 명시하는 방식을 주로 사용합니다.

---

### **Part 2: 데이터 삽입**

컬렉션에 새로운 데이터를 저장하는 단계입니다.

#### **1. 코드, 문법 및 개별 설명**

```javascript
// Insert a few documents into the sales collection.
db.getCollection("sales").insertMany([
  { item: "abc", price: 10 /* ... */ },
  { item: "jkl", price: 20 /* ... */ },
  // ... 6 more documents
]);
```

: `sales` 컬렉션에 8개의 판매 기록 문서(document)를 한 번에 삽입합니다.

#### **2. 해당 설명**

- `db.getCollection("sales")`: 현재 데이터베이스(`mongodbVSCodePlaygroundDB`) 내에서 `sales` 라는 이름의 컬렉션(Collection)을 선택합니다. 컬렉션은 관계형 데이터베이스의 '테이블'과 비슷한 개념입니다.
- `.insertMany([...])`: 배열(`[...]`) 안에 있는 여러 개의 문서(`{...}`)를 한 번에 삽입하는 명령어입니다. 문서는 'key-value' 쌍으로 이루어진 데이터 단위이며, 관계형 데이터베이스의 '행(row)'과 유사합니다.

#### **3. 응용 가능한 예제**

새로운 판매 기록이 하나 발생했을 때, `.insertOne()`을 사용해 하나의 문서만 추가할 수 있습니다.

```javascript
// 새로운 'pqr' 아이템 판매 기록 하나를 'sales' 컬렉션에 추가합니다.
db.getCollection("sales").insertOne({
  item: "pqr",
  price: 15,
  quantity: 3,
  date: new Date(), // new Date()는 현재 시간을 기록합니다.
});
```

#### **4. 심화 내용**

`insertMany`는 기본적으로 순서대로 실행되다가 중간에 하나라도 에러가 발생하면 그 이후의 데이터는 삽입되지 않고 중단됩니다. 만약 에러가 발생하더라도 멈추지 않고, 성공할 수 있는 데이터는 모두 삽입하고 싶다면 `{ ordered: false }` 옵션을 추가할 수 있습니다.

```javascript
db.getCollection("sales").insertMany(
  [
    { _id: 1, item: "a" }, // 정상 데이터
    { _id: 1, item: "b" }, // 중복 _id로 인해 에러 발생
    { _id: 2, item: "c" }, // 정상 데이터
  ],
  { ordered: false }
); // 이 옵션 덕분에 item 'c'는 정상적으로 삽입됩니다.
```

#### **5. 추가하고 싶은 내용**

MongoDB 문서는 JSON과 매우 유사하지만, `new Date()`와 같이 JSON보다 더 다양한 데이터 타입을 저장할 수 있는 BSON(Binary JSON) 형식을 사용합니다. 날짜, 숫자, 이진 데이터 등을 효율적으로 저장할 수 있습니다.

---

### **Part 3: 데이터 조회 및 카운트**

조건에 맞는 데이터를 찾아 그 개수를 세는 단계입니다.

#### **1. 코드, 문법 및 개별 설명**

```javascript
// Run a find command to view items sold on April 4th, 2014.
const salesOnApril4th = db
  .getCollection("sales")
  .find({
    date: { $gte: new Date("2014-04-04"), $lt: new Date("2014-04-05") },
  })
  .count();
```

: `sales` 컬렉션에서 `date` 필드가 2014년 4월 4일 00시 이후(`$gte`)부터 4월 5일 00시 이전(`$lt`) 사이인 문서를 찾아 그 개수를 셉니다.

```javascript
// Print a message to the output window.
console.log(`${salesOnApril4th} sales occurred in 2014.`);
```

: 위에서 센 개수(`salesOnApril4th`)를 포함한 메시지를 VSCode의 출력(Output) 창에 보여줍니다.

#### **2. 해당 설명**

- `.find({ 조건 })`: 조건에 맞는 모든 문서를 찾는 가장 기본적인 조회 명령어입니다.
- `{ $gte: 값, $lt: 값 }`: '크거나 같다(Greater Than or Equal)', '작다(Less Than)'를 의미하는 비교 연산자입니다. 두 연산자를 함께 사용하면 특정 범위 내의 데이터를 효과적으로 검색할 수 있습니다.
- `.count()`: `find`로 찾은 문서의 개수를 세는 명령어입니다.

#### **3. 응용 가능한 예제**

`item`이 "abc"이고, 판매 수량(`quantity`)이 5개를 초과한 판매 기록을 찾아보겠습니다.

```javascript
// 'item'이 "abc"이고 'quantity'가 5보다 큰 문서를 찾습니다.
db.getCollection("sales").find({
  item: "abc",
  quantity: { $gt: 5 }, // $gt: 크다 (Greater Than)
});
```

#### **4. 심화 내용**

`.count()` 명령어는 현재는 사용이 권장되지 않는(deprecated) 오래된 방식입니다. 최신 MongoDB 버전에서는 더 명확한 명령어를 사용하는 것을 권장합니다.

- `.countDocuments({ 조건 })`: `find`의 조건과 동일한 조건을 넣어 문서 개수를 정확하게 셉니다. (가장 권장)
- `.estimatedDocumentCount()`: 조건 없이 전체 문서 개수를 매우 빠르게 추정합니다. (정확하지 않을 수 있음)

```javascript
// count() 대신 countDocuments() 사용 예시
const salesCount = db.getCollection("sales").countDocuments({
  date: { $gte: new Date("2014-04-04"), $lt: new Date("2014-04-05") },
});
console.log(`${salesCount} sales occurred in 2014.`);
```

#### **5. 추가하고 싶은 내용**

날짜를 비교할 때는 문자열("2014-04-04")이 아닌 `new Date("2014-04-04")`와 같은 날짜 객체(Date Object)를 사용하는 것이 매우 중요합니다. 날짜 객체를 사용해야 시간대와 상관없이 정확한 범위 비교가 가능합니다.

---

### **Part 4: 데이터 집계 (Aggregation)**

단순 조회를 넘어, 데이터를 그룹화하고 계산하여 통계 정보를 얻는 고급 분석 단계입니다.

#### **1. 코드, 문법 및 개별 설명**

```javascript
db.getCollection("sales").aggregate([
  // ... 파이프라인 단계들 ...
]);
```

: `sales` 컬렉션의 데이터를 여러 단계(파이프라인)로 순차적으로 가공하여 의미 있는 분석 결과를 도출합니다.

```javascript
  // Find all of the sales that occurred in 2014.
  {
    $match: {
      date: { $gte: new Date("2014-01-01"), $lt: new Date("2015-01-01") },
    },
  },
```

: **[1단계: `$match`]** 2014년 1월 1일부터 2015년 1월 1일 전까지의, 즉 2014년도 판매 데이터만 필터링하여 다음 단계로 넘깁니다.

```javascript
  // Group the total sales for each product.
  {
    $group: {
      _id: "$item",
      totalSaleAmount: { $sum: { $multiply: ["$price", "$quantity"] } },
    },
  },
```

: **[2단계: `$group`]** 1단계에서 넘어온 데이터를 `item` 필드 값으로 그룹화하고, 각 그룹별로 총 판매 금액(`totalSaleAmount`)을 계산합니다.

#### **2. 해당 설명**

- `.aggregate([...])`: 데이터가 파이프라인을 통과하듯 여러 단계를 거치며 처리되는 강력한 분석 도구입니다. 각 단계는 `{ $연산자: ... }` 형태로 작성됩니다.
- `$match`: `find`처럼 조건에 맞는 문서를 필터링하는 단계입니다.
- `$group`: 문서를 특정 필드(`_id`) 기준으로 그룹화하고, 그룹별로 합계(`$sum`), 평균(`$avg`), 개수(`$count`) 등을 계산할 수 있습니다.
- `$multiply`: 배열로 주어진 숫자 필드들을 곱하는 연산자입니다. 예제에서는 `[ "$price", "$quantity" ]`를 곱해 개별 판매 금액을 계산했습니다.
- `$sum`: `$group` 내에서 사용되어, 그룹화된 문서들의 특정 숫자 값을 모두 더합니다.

#### **3. 응용 가능한 예제**

각 아이템별 평균 판매 수량(`quantity`)을 계산해 보겠습니다.

```javascript
db.getCollection("sales").aggregate([
  // 아이템별로 그룹화
  {
    $group: {
      _id: "$item",
      // 'quantity' 필드의 평균값을 'avgQuantity' 라는 새 필드에 저장
      avgQuantity: { $avg: "$quantity" },
    },
  },
]);
```

#### **4. 심화 내용**

집계 파이프라인에는 더 많은 단계를 추가할 수 있습니다. 예를 들어, 위 `Part 4`의 기본 예제 결과(아이템별 총 판매금액)를 판매 금액이 높은 순으로 정렬하고 싶다면 `$sort` 단계를 추가하면 됩니다.

```javascript
db.getCollection("sales").aggregate([
  {
    $match: {
      date: { $gte: new Date("2014-01-01"), $lt: new Date("2015-01-01") },
    },
  },
  {
    $group: {
      _id: "$item",
      totalSaleAmount: { $sum: { $multiply: ["$price", "$quantity"] } },
    },
  },
  // 3단계 (심화): totalSaleAmount 필드를 기준으로 내림차순(-1) 정렬
  { $sort: { totalSaleAmount: -1 } },
]);
```

#### **5. 추가하고 싶은 내용**

복잡한 집계 파이프라인을 작성하는 것은 때로 어려울 수 있습니다. MongoDB의 GUI 도구인 **MongoDB Compass**에는 'Aggregation Pipeline Builder'라는 기능이 있어, 각 단계를 시각적으로 추가하고 단계별 중간 결과를 바로 확인하며 쿼리를 만들 수 있어 매우 편리합니다.
