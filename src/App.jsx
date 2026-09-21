import { useState } from "react";
import "./App.css";

function App() {
  const [tab, setTab] = useState("revenue");

  const [members, setMembers] = useState([
    {
      id: 1,
      name: "",
      price: "",
      total: "",
      used: "",
      fee: "",
    },
  ]);

  const [balance, setBalance] = useState("");
  const [refund, setRefund] = useState("");
  const [fixed, setFixed] = useState("");

  // 회원 추가
  const addMember = () => {
    setMembers([
      ...members,
      {
        id: Date.now(),
        name: "",
        price: "",
        total: "",
        used: "",
        fee: "",
      },
    ]);
  };

  // 회원 정보 수정
  const updateMember = (id, field, value) => {
    setMembers(
      members.map((member) =>
        member.id === id
          ? { ...member, [field]: value }
          : member
      )
    );
  };

  // 회원 삭제
  const deleteMember = (id) => {
    setMembers(
      members.filter((member) => member.id !== id)
    );
  };

  // 숫자 변환
  const num = (value) => Number(value) || 0;

  // 실제 수익
  const actualRevenue = members.reduce((sum, m) => {
    const price = num(m.price);
    const total = num(m.total);
    const used = num(m.used);

    return sum + (total > 0 ? (price / total) * used : 0);
  }, 0);

  // 남은 수업
  const remainingCount = members.reduce((sum, m) => {
    return sum + Math.max(num(m.total) - num(m.used), 0);
  }, 0);

  // 남은 서비스 금액
  const remainingValue = members.reduce((sum, m) => {
    const price = num(m.price);
    const total = num(m.total);
    const used = num(m.used);

    const revenue =
      total > 0 ? (price / total) * used : 0;

    return sum + Math.max(price - revenue, 0);
  }, 0);

  // 미래 강사비
  const futureCost = members.reduce((sum, m) => {
    const remaining =
      Math.max(num(m.total) - num(m.used), 0);

    return sum + remaining * num(m.fee);
  }, 0);

  // 지금 써도 되는 돈
  const availableCash =
    num(balance) -
    futureCost -
    num(refund) -
    num(fixed);

  const money = (value) =>
    `${Math.round(value).toLocaleString()}원`;

  return (
    <div className="app">

      {/* 제목 */}
      <header>
        <h1>
          PASS<span>BALANCE</span>
        </h1>

        <p className="subtitle">
          선결제 횟수권 사업장을 위한 재무관리
        </p>
      </header>

      {/* 회원 정보 입력 */}
      <div className="inputBox">

        <div className="titleRow">
          <h2>회원권 정보</h2>

          <button
            className="addButton"
            onClick={addMember}
          >
            + 회원 추가
          </button>
        </div>

        {members.map((member, index) => (
          <div
            className="memberBox"
            key={member.id}
          >

            <div className="memberTitle">
              <b>회원 {index + 1}</b>

              {members.length > 1 && (
                <button
                  className="deleteButton"
                  onClick={() =>
                    deleteMember(member.id)
                  }
                >
                  삭제
                </button>
              )}
            </div>

            <div className="inputs">

              <label>
                회원 이름
                <input
                  type="text"
                  value={member.name}
                  placeholder="이름을 입력하세요"
                  onChange={(e) =>
                    updateMember(
                      member.id,
                      "name",
                      e.target.value
                    )
                  }
                />
              </label>

              <label>
                회원권 가격
                <input
                  type="number"
                  value={member.price}
                  placeholder="ex) 500000"
                  onChange={(e) =>
                    updateMember(
                      member.id,
                      "price",
                      e.target.value
                    )
                  }
                />
              </label>

              <label>
                총 수업 횟수
                <input
                  type="number"
                  value={member.total}
                  placeholder="ex) 10"
                  onChange={(e) =>
                    updateMember(
                      member.id,
                      "total",
                      e.target.value
                    )
                  }
                />
              </label>

              <label>
                사용한 횟수
                <input
                  type="number"
                  value={member.used}
                  placeholder="ex) 3"
                  onChange={(e) =>
                    updateMember(
                      member.id,
                      "used",
                      e.target.value
                    )
                  }
                />
              </label>

              <label>
                회당 강사비
                <input
                  type="number"
                  value={member.fee}
                  placeholder="ex) 30000"
                  onChange={(e) =>
                    updateMember(
                      member.id,
                      "fee",
                      e.target.value
                    )
                  }
                />
              </label>

            </div>
          </div>
        ))}
      </div>

      {/* 메뉴 */}
      <nav>

        <button
          className={
            tab === "revenue" ? "active" : ""
          }
          onClick={() => setTab("revenue")}
        >
          실제 수익
        </button>

        <button
          className={
            tab === "service" ? "active" : ""
          }
          onClick={() => setTab("service")}
        >
          잔여 서비스
        </button>

        <button
          className={
            tab === "cost" ? "active" : ""
          }
          onClick={() => setTab("cost")}
        >
          미래 비용
        </button>

      </nav>

      {/* 실제 수익 */}
      {tab === "revenue" && (
        <section>

          <h2>전체 실제 수익</h2>

          <div className="cards">

            <div className="card">
              <small>
                현재까지 실제로 번 돈
              </small>

              <strong>
                {money(actualRevenue)}
              </strong>
            </div>

            <div className="card">
              <small>
                아직 제공하지 않은 서비스
              </small>

              <strong>
                {money(remainingValue)}
              </strong>
            </div>

          </div>

          <div className="resultBox">

            <h3>회원별 실제 수익</h3>

            {members.map((member) => {

              const price = num(member.price);
              const total = num(member.total);
              const used = num(member.used);

              const revenue =
                total > 0
                  ? (price / total) * used
                  : 0;

              return (
                <div
                  className="resultRow"
                  key={member.id}
                >

                  <span>
                    {member.name || "이름 없음"}
                  </span>

                  <span>
                    {used}/{total}회
                  </span>

                  <b>
                    {money(revenue)}
                  </b>

                </div>
              );
            })}

          </div>
        </section>
      )}

      {/* 잔여 서비스 */}
      {tab === "service" && (
        <section>

          <h2>잔여 서비스</h2>

          <div className="cards">

            <div className="card">
              <small>전체 남은 수업</small>

              <strong>
                {remainingCount}회
              </strong>
            </div>

            <div className="card">
              <small>남은 서비스 금액</small>

              <strong>
                {money(remainingValue)}
              </strong>
            </div>

          </div>

          <div className="resultBox">

            <h3>회원별 잔여 서비스</h3>

            {members.map((member) => {

              const total = num(member.total);
              const used = num(member.used);

              const left =
                Math.max(total - used, 0);

              const progress =
                total > 0
                  ? (used / total) * 100
                  : 0;

              return (
                <div
                  className="serviceRow"
                  key={member.id}
                >

                  <div className="serviceInfo">

                    <b>
                      {member.name || "이름 없음"}
                    </b>

                    <span>
                      {used}회 사용 · {left}회 남음
                    </span>

                  </div>

                  <div className="progress">

                    <div
                      style={{
                        width: `${Math.min(
                          progress,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>
        </section>
      )}

      {/* 미래 비용 */}
      {tab === "cost" && (
        <section>

          <h2>미래 비용 예측</h2>

          <div className="inputBox">

            <label>
              현재 통장 잔액

              <input
                type="number"
                value={balance}
                placeholder="ex) 60000000"
                onChange={(e) =>
                  setBalance(e.target.value)
                }
              />
            </label>

            <br />

            <label>
              환불 대비금

              <input
                type="number"
                value={refund}
                placeholder="ex) 4000000"
                onChange={(e) =>
                  setRefund(e.target.value)
                }
              />
            </label>

            <br />

            <label>
              다음 달 고정비

              <input
                type="number"
                value={fixed}
                placeholder="ex) 3500000"
                onChange={(e) =>
                  setFixed(e.target.value)
                }
              />
            </label>

          </div>

          <div className="costBox">

            <div>
              <span>현재 통장 잔액</span>

              <b className="plus">
                {money(num(balance))}
              </b>
            </div>

            <div>
              <span>미래 강사비</span>

              <b>
                - {money(futureCost)}
              </b>
            </div>

            <div>
              <span>환불 대비금</span>

              <b>
                - {money(num(refund))}
              </b>
            </div>

            <div>
              <span>다음 달 고정비</span>

              <b>
                - {money(num(fixed))}
              </b>
            </div>

            <hr />

            <div className="available">

              <span>
                지금 써도 되는 돈
              </span>

              <strong>
                {money(availableCash)}
              </strong>

            </div>

          </div>
        </section>
      )}

    </div>
  );
}

export default App;