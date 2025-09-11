// #빅데이터_수집_저장 #미니실습, #몽고디비

// 0번,
// user 컬렉션 생성, 샘플 데이터 추가 해보기.
// 필드, name, age, email, hobbies 배열
db.user.insertMany([
    {
        name: "이상용1", age: 25, email: "lsy1@naver.com",
        hobbies: ["game", "swimming", "yutube"]
    },
    {
        name: "이상용2", age: 35, email: "lsy2@naver.com",
        hobbies: ["game", "tv", "baseball"]
    },
    {
        name: "이상용3", age: 45, email: "lsy3@naver.com",
        hobbies: ["game", "webtoon", "boxing"]
    },
])
// 0-2번,
// employees 컬렉션 생성, 샘플 데이터 추가 해보기.
// 필드, name, age, department, skills 배열
db.employees.insertMany([
    {
        name: "이상용1", age: 25, department: "HR",
        skills: ["develope", "operation", "modeling"]
    },
    {
        name: "이상용2", age: 35, department: "Manage",
        skills: ["web", "mobile", "db"]
    },
    {
        name: "이상용3", age: 45, department: "Dev",
        skills: ["aws", "network", "security"]
    },
])

// 1. Capped Collection을 생성하고,
// 컬렉션 명: logs
// size : 5000
// 데이터를 삽입한 후 조회하는 코드를 작성하세요.
// (오래된 데이터 삭제 확인,)
db.createCollection("logs", { capped: true, size: 5000 })
for (i = 0; i < 1000; i++) {
    db.logs.insertOne({ x: i });
}

// 2. use를 사용하여 myDatabase 데이터베이스를 선택하세요.
use("myDatabase")
// 3. students 컬렉션에 { name: "John", age: 22 } 데이터를 삽입하세요.
db.students.insertOne({ name: "John6", age: 44 })

// 4. students 컬렉션에서 모든 데이터를 조회하세요.
db.students.find()

// 5. students 컬렉션에서 name이 "John"인 문서를 조회하세요.
db.students.findOne({ name: "John" })

// 6. students 컬렉션에서 name이 "John"인 문서의 
// age를 23으로 업데이트하세요.
db.students.updateOne({ name: "John" }, { $set: { age: 23 } })

// 7. students 컬렉션에서 age가 20 이상인
// 문서의 status 필드를 "active"로 설정하세요.
db.students.updateMany({ age: { $gte: 20 } }, { $set: { status: "active" } })
db.students.find()

// 8. students 컬렉션에서 name이 "John"인 문서를 삭제하세요.
db.students.deleteOne({ name: "John" })
// 9. students 컬렉션에서 모든 데이터를 삭제하세요.
db.students.deleteMany({})

// 10. students 컬렉션에서 age 기준으로 내림차순 정렬 후
// 3개만 출력하세요.
db.students.find()
db.students.find().sort({ age: -1 }).limit(3);

// 11. students 컬렉션에서 name과 age만 조회하세요 
// (단, _id는 제외).
db.students.find({}, { name: 1, age: 1, _id: 0 })
db.students.find({}, { _id: 0 })


// 14. employees 컬렉션에서 age가 
// 30 이상인 문서의 개수를 확인하세요.
db.employees.countDocuments({ age: { $gte: 30 } })
db.employees.find()
// 15. employees 컬렉션에서 email 필드가 
// 존재하는 문서를 조회하세요.
db.employees.find({ email: { $exists: true } })

// 16. employees 컬렉션에서 department가 
// "HR" 또는 "IT"인 문서를 조회하세요.
db.employees.find({ department: { $in: ["HR", "IT"] } })

// 17. employees 컬렉션에서 age가 25 이상 35
// 이하인 문서를 조회하세요.
db.employees.find({ age: { $gte: 25, $lte: 35 } })

// 18. employees 컬렉션에서 age가 30이거나 department가
// "Finance"인 문서를 조회하세요.
db.employees.find({ $or: [{ age: 25 }, { dedpartment: "Finance" }] })
db.employees.find()
// 19. employees 컬렉션에서 skills 
// 배열에 "Python"을 추가하세요.
db.employees.updateOne(
    { name: "이상용1" }, { $push: { skills: "Python" } }
)

// 20. employees 컬렉션에서 skills 배열에서
// "Python"을 제거하세요.
db.employees.updateOne(
    { name: "이상용1" }, { $pull: { skills: "Python" } }
)