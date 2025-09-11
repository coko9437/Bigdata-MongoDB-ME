db.by_road_type.find(
  { county: "강릉시" },
  { "교차로내.accident_count": 1, "기타단일로.accident_count": 1 }
);

//전국에서 도로 종류중에 ‘기타단일로’에서 사망자 지수가 0인 지역을출력한다
db.by_road_type.find(
  { "기타단일로.death_toll": 0 },
  { city_or_province: 1, county: 1, "기타단일로.death_toll": 1 }
);

// 전국에서, 도로 종류가 : 기타 단일로, 사망자수가 최대인 지역 상위 5개 출력
// sort({ "기타단일로.death_toll": -1 }) : 사망률로 내림차순, 가장 높은 지수 부터 차례대로 출력.

db.by_road_type
  .find(
    {}, // 모든 문서를 대상으로 검색
    { city_or_province: 1, county: 1, "기타단일로.death_toll": 1, _id: 0 }
  )
  .sort({ "기타단일로.death_toll": -1 })
  .limit(10);
