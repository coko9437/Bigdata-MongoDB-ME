use("test"); // 기본 데이터 베이스, test 사용함. 생략시 기본 test 데이터베이스 사용

//테이블 생성,
// 테이블 생성 후, 데이터 추가하는 기본 문법 :insertOne

//SQL 사용하는 테이블, NOSQL 컬렉션으로 사용함.
// db.[컬렉션명].insertOne({
//     [컬럼명]:[값],
//     name: '홍길동',
//     age: 20,
//     favorite: ['apple', 'banana'],
//})
// 한줄 실행 : ctrl + alt + s
// 전체 실행 : ctrl + alt + r
// 하나 입력
db.users.insertOne({
  name: "홍길동",
  age: 20,
  favorite: ["apple", "banana"],
});

// 조회
// db.[컬렉션명].find({조건})
db.users.find();

//수정
// db.[컬렉션명].updateOne({조건}, {수정할 값})
db.users.updateOne(
  { name: "홍길동" }, // 조건
  { $set: { age: 30 } } // 수정할 값
);

// 삭제
// db.[컬렉션명].deleteOne({조건})
db.users.deleteOne({ name: "홍길동" }); // 조건에 맞는 첫 번째 문서 삭제

// Capped Collection, 컬렉션 = 테이블
// 컬렉션이 용량 초과하게 되면, 오래된 테이터 부터 차례대로 삭제하는 기능.
// db.createCollection('컬렉션명', { capped: true, size: [용량] }
//  용량이 5KB인 컬렉션 생성, 부가 기능으로 용량 초과시 오래된 데이터 삭제
db.createCollection("logs3", { capped: true, size: 5000 }); // 5KB
// 샘플 데이터 추가, 반복문을 이용해서, 샘플로 1000개 추가
for (let i = 0; i < 100000000000; i++) {
  db.logs3.insertOne({
    // 로그 메시지 감싸는 기호는 백틱(`) 사용
    message: `로그 메시지 ${i}`,
    timestamp: new Date(), // 오라클로 표현 sysdate() 같음, 현재 날짜
  });
}
db.logs.find(); // 전체 조회

db.createCollection("logs2", { capped: true, size: 5000 }); // 5KB
for (let i = 1000; i < 2000; i++) {
  db.logs2.insertOne({
    message: `로그 메시지 ${i}`,
    timestamp: new Date(), // 오라클로 표현 sysdate() 같음, 현재 날짜
  });
}

// -- 퀴즈1,
// -- 한 개 문서 삽입, 컬렉션 명 : users2
// -- 이름, 생년월일, 좋아하는 음식 , 등록날짜,
db.users2.insertOne({
  name: "이상용", // 이름, 문자열로 저장
  birth: "1984-12-05", // 생년월일, 문자열로 저장
  favorite: ["돼지국밥", "비빔밥"], // 좋아하는 음식, 배열로 저장
  regdate: new Date(), // 현재 날짜 , 타입 date
});
db.users2.find(); // 전체 조회

// -- 퀴즈2,
// -- 컬렉션 명 : users2, 수정해보기,
// -- 항목들 중, 수정2 문자열 추가해보기.
db.users2.updateOne(
  { name: "이상용 수정3" }, // 조건   수정
  // { $set: { name: '이상용 수정3' } } // 수정할 값
  {
    $set: {
      favorite: ["돼지국밥 수정2", "비빔밥 수정2"],
      birth: "1984-12-06 수정예시",
    },
  }
  // 수정할 값
);

// -- 퀴즈3,
// -- users2 에서, 등록한 항목 삭제 해보기.
db.users2.deleteOne({ name: "이상용 수정3" }); // 조건에 맞는 첫 번째 문서 삭제
// ===========================================================
db.users2.find(); // 전체 조회

// ==========================================================
db.serverStatus();
