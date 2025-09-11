// 더미 데이터 만들기
db.users.insertMany([
  {
    name: "Kim",
    age: 28,
    city: "Seoul",
    gender: "남성",
    email: "kim@gmail.com",
    tags: ["sports", "music"],
    orders: [1001, 1002, 1003, 1004, 1005],
    reviews: ["Good", "Excellent", "Superb"],
    score: 85,
    status: "active",
  },
  {
    name: "Lee",
    age: 22,
    city: "Busan",
    gender: "여성",
    email: "lee@yahoo.com",
    tags: ["travel", "food"],
    orders: [2001, 2002, 2003],
    reviews: ["Average", "Nice"],
    score: 75,
    status: "inactive",
    location: "Korea",
  },
  {
    name: "John Park",
    age: 35,
    city: "Seoul",
    gender: "남성",
    email: "john.park@gmail.com",
    tags: ["music", "sports", "travel"],
    orders: [3001, 3002, 3003, 3004],
    reviews: ["Amazing", "Loved it", "Great service"],
    score: 90,
    status: "active",
  },
  {
    name: "David",
    age: 40,
    city: "Incheon",
    gender: "남성",
    email: "david@hotmail.com",
    tags: ["reading", "travel"],
    orders: [4001, 4002],
    reviews: ["Okay", "Could be better"],
    score: 60,
    status: "inactive",
  },
  {
    name: "Alice Kim",
    age: 30,
    city: "Seoul",
    gender: "여성",
    email: "alice.kim@gmail.com",
    tags: ["sports", "fashion"],
    orders: [5001, 5002, 5003, 5004, 5005, 5006],
    reviews: ["Nice", "Awesome", "Fantastic"],
    score: 95,
    status: "active",
  },
  {
    name: "Chris",
    age: 25,
    city: "Daegu",
    gender: "남성",
    email: "chris@gmail.com",
    tags: ["movies", "gaming"],
    orders: [6001, 6002, 6003],
    reviews: ["Great", "Loved it"],
    score: 88,
    status: "active",
    points: 120,
  },
  {
    name: "Emma",
    age: 20,
    city: "Jeju",
    gender: "여성",
    email: "emma@naver.com",
    tags: ["fashion", "beauty"],
    orders: [7001],
    reviews: ["Good"],
    score: 70,
    status: "inactive",
  },
]);

// ✅ 1. 나이가 25 이상인 사용자 찾기
db.users.find();
db.users.find({ age: { $gte: 25 } });

// ✅ 2. 이름이 "Kim"인 사용자 찾기

db.users.find({ name: "Kim" });

// ✅ 3. 나이가 30 또는 40인 사용자 찾기

db.users.find(
  // 조건
  { age: { $in: [30, 40] } },
  // 프로젝션, 보고 싶은 열 선택.
  { _id: 0, name: 1, email: 1, age: 1 }
);

// ✅ 4. 나이가 30 이상이고, 도시가 "Seoul"인 사용자 찾기

db.users.find({ age: { $gte: 30 }, city: "Seoul" });

// ✅ 5. 이름이 "John"으로 시작하는 사용자 찾기

db.users.find({ name: { $regex: "^John" } });

// ✅ 6. 나이가 20~40 사이인 사용자 찾기

db.users.find({ age: { $gte: 20, $lte: 40 } });

// ✅ 7. 태그에 "sports"가 포함된 사용자 찾기

db.users.find({ tags: "sports" });
또는;
db.users.find({ tags: { $in: ["sports"] } });

// ✅ 8. 배열 크기가 3인 사용자 찾기

db.users.find({ tags: { $size: 3 } });

// ✅ 9. reviews 배열에서 마지막 2개만 가져오기

db.users.find({}, { reviews: { $slice: -2 } });

// ✅ 10. 성별이 "남성"이고 나이가 30 이상인 사용자 찾기

db.users.find({ gender: "남성", age: { $gte: 30 } });

// ✅ 11. location 필드가 없는 사용자 찾기

db.users.find({ location: { $exists: false } });

// ✅ 12. 이름이 "Lee"가 아닌 사용자 찾기

db.users.find({ name: { $ne: "Lee" } });

// ✅ 13. orders 배열의 첫 번째 요소만 가져오기

db.users.find({}, { orders: { $slice: 1 } });

// ✅ 14. 태그에 "music" 또는 "travel"이 포함된 사용자 찾기

db.users.find({ tags: { $in: ["music", "travel"] } });

// ✅ 15. 이메일이 특정 도메인("@gmail.com")을 포함하는 사용자 찾기

db.users.find({ email: { $regex: "@gmail\\.com$" } });

// ✅ 16. 특정 텍스트(예: "MongoDB")를 포함하는 사용자 찾기
db.users.find();
db.users.find({ $text: { $search: "kim lee" } });
db.users.createIndex({ name: "text", email: "text" });
// index 조회,
db.users.getIndexes();
// index 삭제,
db.users.dropIndex("name_text_description_text");

// ⚠️ 주의: text index가 설정되어 있어야 사용 가능

// ✅ 17. score 값이 80 이상인 사용자 찾기

db.users.find({ score: { $gte: 80 } });

// ✅ 18. status 값이 "active"인 사용자 찾기

db.users.find({ status: "active" });

// ✅ 19. points 필드가 존재하는 사용자 찾기

db.users.find({ points: { $exists: true } });

// ✅ 20. orders 배열의 크기가 5 이상인 사용자 찾기

db.users.find({ orders: { $size: 5 } });

// 커서 예시.
db.users.find({ score: { $gte: 80 } }).forEach(function (user) {
  print("Name: " + user.name + ", Score: " + user.score);
});

// 2
// 'active' 상태인 사용자를 찾는 커서를 생성합니다.
const activeUsersCursor = db.users.find({ status: "active" });

let count = 0;
// 커서에 다음 문서가 있고, 카운트가 2보다 작은 동안 반복합니다.
while (activeUsersCursor.hasNext() && count < 2) {
  const user = activeUsersCursor.next(); // 다음 문서를 가져옵니다.
  printjson(user);
  count++;
}
