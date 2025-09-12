잘못 설정된 Replica Set을 바로잡는 방법은 크게 두 가지가 있습니다.

1.  **Reconfig (재설정) 사용**: 기존 설정을 수정하는 가장 '정석적인' 방법입니다. 데이터 손실 없이 멤버의 주소 등을 변경할 수 있습니다.
2.  **완전 초기화 (삭제 후 재시작)**: 현재 실습 중이고 저장된 데이터가 중요하지 않을 때 가장 간단하고 확실한 방법입니다.

각 방법에 대해 자세히 설명해 드리겠습니다.

---

### **방법 1: `rs.reconfig()`를 사용한 '정석적인' 수정 방법**

이 방법은 운영 중인 서비스에서 데이터 손실 없이 Replica Set의 구성을 변경할 때 사용하는 표준 절차입니다.

**개념**: `rs.conf()` 명령어로 현재 Replica Set의 설정 객체(Configuration Object)를 가져온 뒤, 그 객체의 내용을 수정하고 `rs.reconfig()` 명령어로 다시 적용하는 방식입니다.

**단계별 실행 방법:**

1.  **먼저, `shard0`의 Primary 멤버에 접속합니다.**
    어떤 멤버가 Primary인지 모른다면, 아무 멤버에나 접속해서 `db.isMaster()`를 실행하여 `ismaster: true`인 멤버를 찾으면 됩니다. (아마도 27021 포트일 것입니다.)

    ```bash
    mongosh --port 27021
    ```

2.  **현재 설정을 변수에 저장합니다.**
    `rs.conf()`를 실행하면 현재 설정이 JSON 형태로 출력됩니다. 이것을 `cfg`라는 변수에 저장합니다.

    ```javascript
    cfg = rs.conf();
    ```

3.  **(선택) `cfg` 변수의 내용을 확인합니다.**
    `cfg`를 입력하고 엔터를 치면, `members` 배열 안에 `host`가 IP 주소로 되어 있는 것을 볼 수 있습니다.

    ```javascript
    // cfg를 출력했을 때 보이는 내용 (예시)
    {
      _id: 'shard0',
      version: 1,
      protocolVersion: 1,
      members: [
        { _id: 0, host: '10.100.201.4:27021', ... },
        { _id: 1, host: '10.100.201.4:27022', ... },
        { _id: 2, host: '10.100.201.4:27023', arbiterOnly: true, ... }
      ],
      ...
    }
    ```

4.  **변수에 저장된 `host` 주소를 `localhost`로 변경합니다.**
    자바스크립트 문법을 사용하여 배열의 각 요소를 직접 수정합니다.

    ```javascript
    cfg.members[0].host = "localhost:27021";
    cfg.members[1].host = "localhost:27022";
    cfg.members[2].host = "localhost:27023";
    ```

5.  **수정한 설정으로 Replica Set을 재설정합니다.**
    `rs.reconfig()` 명령어에 수정한 `cfg` 변수를 전달합니다.

    ```javascript
    rs.reconfig(cfg);
    ```

    성공적으로 실행되면 `{ "ok" : 1 }` 메시지가 출력됩니다.

6.  **마지막으로 변경이 잘 되었는지 확인합니다.**
    다시 `rs.status()`나 `rs.conf()`를 실행하여 `host` 부분이 `localhost`로 변경되었는지 확인합니다.

    ```javascript
    rs.status();
    ```

이 과정을 거치면 `shard0` Replica Set은 `config0`와 동일하게 `localhost` 기반으로 동작하게 됩니다.

---

### **방법 2: '깨끗하게' 완전 초기화하는 방법**

이 방법은 현재 `shard0`에 중요한 데이터가 전혀 없고, 처음부터 다시 시작하는 것이 더 빠르다고 판단될 때 사용합니다. **⚠️ 주의: 이 방법은 해당 샤드의 모든 데이터를 삭제합니다.**

**단계별 실행 방법:**

1.  **`shard0`에 속한 모든 `mongod` 프로세스를 중지시킵니다.**
    `mongod`를 실행했던 3개의 명령어 창(27021, 27022, 27023 포트)에서 각각 `Ctrl + C`를 눌러 서버를 종료합니다.

2.  **`shard0`의 데이터 폴더를 모두 삭제합니다.**
    파일 탐색기를 열거나 `rmdir` (또는 `rd /s /q`) 명령어를 사용하여 아래 폴더들을 완전히 삭제합니다.

    - `c:\db2\data\shard0-0`
    - `c:\db2\data\shard0-1`
    - `c:\db2\data\shard0-2`

3.  **데이터 폴더를 다시 생성합니다.**
    깨끗한 상태에서 다시 시작하기 위해 빈 폴더들을 다시 만들어 줍니다.

    ```bash
    mkdir c:\db2\data\shard0-0
    mkdir c:\db2\data\shard0-1
    mkdir c:\db2\data\shard0-2
    ```

4.  **`mongod` 프로세스들을 다시 실행합니다.**
    원래 실행했던 `mongod --shardsvr ...` 명령어 3개를 각 창에서 다시 실행합니다.

5.  **이제 `shard0`는 아무 설정도 없는 '미개척 상태'가 되었습니다.**
    27021 포트로 다시 접속하여, 이번에는 원했던 `localhost` 기반의 `rs.initiate()` 명령어를 실행합니다.

    ```bash
    mongosh --port 27021
    ```

    ```javascript
    rs.initiate({
      _id: "shard0",
      members: [
        { _id: 0, host: "localhost:27021" },
        { _id: 1, host: "localhost:27022" },
        { _id: 2, host: "localhost:27023", arbiterOnly: true },
      ],
    });
    ```

이제 `shard0`가 원하시는 `localhost` 구성으로 깨끗하게 초기화되었습니다.

---

### **어떤 방법을 선택해야 할까요?**

- **지금과 같은 학습 환경에서는** 데이터가 없으므로 **방법 2 (완전 초기화)**가 더 직관적이고 간단할 수 있습니다.
- **하지만 실무 환경을 연습하고 싶다면** **방법 1 (`rs.reconfig()`)**을 꼭 한번 시도해보시는 것을 강력히 추천합니다. MongoDB 관리자로서 반드시 알아야 할 중요한 명령어입니다.

**참고**: 왜 `localhost`와 IP를 구분해서 사용할까요?

- `localhost` (또는 `127.0.0.1`): "바로 이 컴퓨터 자신"을 의미합니다. 한 컴퓨터 안에서 모든 서버를 실행하는 테스트 환경에서는 `localhost`로 통일하는 것이 간단하고 좋습니다.
- IP 주소 (`10.100.201.4`): 네트워크상의 고유한 주소입니다. 여러 대의 실제 서버로 클러스터를 구성할 때는 각 서버가 서로를 찾아갈 수 있도록 반드시 IP 주소(또는 DNS 호스트명)를 사용해야 합니다.
