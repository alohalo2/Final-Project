import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import '../../css/SpecialAuction/SAitem.css';

const socket = io('http://localhost:3000'); // 백엔드 주소

function SAitem({ imageSrc, title, auctionDate, auctionTime, linkText, alertText }) {
  const [nickname, setNickname] = useState('User'); // 기본 닉네임은 'User'
  const [messages, setMessages] = useState([]); // 채팅 메시지 배열 상태
  const [isSeller, setIsSeller] = useState(false); // 판매자 여부 상태
  const [inputMessage, setInputMessage] = useState(''); // 채팅 입력 메세지 상태
  const [showPopup, setShowPopup] = useState(false); // 구매자 or 판매자 페이지로 이동 선택 팝업 상태
  const [showBuyerPopup, setShowBuyerPopup] = useState(false); // 구매자 페이지 로딩 팝업 상태
  const [showSellerPopup, setshowSellerPopup] = useState(false); // 판매자 페이지 팝업 상태
  const [showAuctionScreen, setShowAuctionScreen] = useState(false); // 경매 화면 팝업 상태
  const [currentPrice, setCurrentPrice] = useState(735000); // 현재가 (최초 현재가 설정)
  const [bidAmount, setBidAmount] = useState(736000); // 입찰가 상태
  const [remainingTime, setRemainingTime] = useState(''); // 남은 시간 표시 상태
  const [showEndPopup, setShowEndPopup] = useState(false); // 경매 마감 안내 팝업 상태
  const messagesEndRef = useRef(null); // 메세지 채팅 내용 마지막 위치

  // 메시지가 변경될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 메시지 수신 처리
  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => socket.off('receiveMessage');
  }, []);

  // 닉네임 자동 설정 (판매자 페이지 여부에 따라 변경)
  useEffect(() => {
    if (showSellerPopup) {
      setNickname('판매자'); // 판매자 페이지로 이동하면 닉네임 설정
    } else {
      setNickname('User'); // 그 외에는 'User'
    }
  }, [showSellerPopup]);

  // 인풋 메시지 업데이트 시 닉네임 유지
  const handleInputChange = (e) => {
    // 사용자가 기존 닉네임 부분을 지우지 못하도록 방지
    if (!e.target.value.startsWith(nickname + ': ')) return;
    setInputMessage(e.target.value);
  };

  // 메시지 전송 핸들러
  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      // 새로운 메시지 추가
      const messageData = { user: nickname, message: inputMessage }; // 닉네임 사용
      setMessages((prevMessages) => [...prevMessages, messageData]);
      socket.emit('sendMessage', messageData); // 서버로 메시지 전송
      setInputMessage(''); // 인풋 비우기
    }
  };

  // // 메시지 전송 핸들러
  // const sendMessage = () => {
  //   const messageData = { user: 'User', message: inputMessage };
  //   socket.emit('sendMessage', messageData);
  //   setInputMessage('');
  // };

  // Enter 키로 전송 가능하게 하는 핸들러
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // 경매 시작 시간 설정
  const auctionStartTime = new Date('2024-10-01T12:00:00');
  const auctionEndTime = new Date('2024-10-02T12:00:00');
  const formattedAuctionStartTime = auctionStartTime.toLocaleString();
  const formattedAuctionEndTime = auctionEndTime.toLocaleString();

  // 현재 시간과의 차이 계산
  const now = new Date();
  const timeDifference = auctionEndTime - now;

  // 시간 차이를 시간, 분, 초로 변환하는 함수
  const formatTimeDifference = (timeDiff) => {
    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
  };

  const formattedTimeDifference = formatTimeDifference(timeDifference);

  // 팝업 열기
  const openPopup = () => setShowPopup(true);
  // 팝업 닫기
  const closePopup = () => setShowPopup(false);

  // 구매자 페이지 팝업 열기
  const openBuyerPopup = () => {
    setShowPopup(false); // 기존 팝업 닫기
    setShowBuyerPopup(true); // 로딩 팝업 열기
    setIsSeller(false); // 판매자 모드로 전환
    setNickname('구매자'); // 닉네임을 '판매자'로 자동 설정
  };

  // 경매 시작 시간을 확인하여 화면 상태 변경하는 useEffect
  useEffect(() => {
    if (showBuyerPopup) {
      const now = new Date();
      const timeDifference = auctionStartTime - now;

      console.log('Time difference:', timeDifference);
      console.log('Auction start time:', auctionStartTime);
      console.log('Current time:', now);

      // 1. 경매 시작 시간이 미래인 경우 timeDifference 후에 상태 변경
      if (timeDifference > 0) {
        const timer = setTimeout(() => {
          setShowAuctionScreen(false); // 경매 화면으로 전환
          setShowBuyerPopup(true); // 로딩 팝업 종료
          console.log('Auction started, switching to auction screen.');
        }, timeDifference);

        // 컴포넌트 언마운트 시 타이머 클린업
        return () => clearTimeout(timer);
      } else {
        // 2. 경매 시작 시간이 이미 지났을 경우 바로 경매 화면 전환
        setShowAuctionScreen(true);
        setShowBuyerPopup(false);
        console.log('Auction already started, switching to auction screen immediately.');
      }
    }
  }, [showBuyerPopup, auctionStartTime]);

  // 구매자 페이지 팝업 닫기
  const closeBuyerPopup = () => {
    setShowBuyerPopup(false);
    setShowAuctionScreen(false);
  };

  // 판매자 페이지 열기 (로딩 없이 바로 표시)
  const openSellerPage = () => {
    setShowPopup(false); // 기존 팝업 닫기
    setshowSellerPopup(true); // 판매자 페이지 표시
    setIsSeller(true); // 판매자 모드로 전환
    setNickname('판매자'); // 닉네임을 '판매자'로 자동 설정
  };

  // 판매자 페이지 닫기
  const closeSellerPage = () => setshowSellerPopup(false);

  // useEffect로 setInterval 설정
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeDifference = auctionEndTime - now;

      // 남은 시간을 상태로 업데이트하여 실시간 표시
      setRemainingTime(formatTimeDifference(timeDifference));

      // 경매 종료 시점이 되면 팝업 띄우기
      if (timeDifference <= 0) {
        clearInterval(interval); // 타이머 종료
        setShowPopup(false); // 기존 팝업 닫기
        setshowSellerPopup(false); // 판매자 페이지 표시
        setShowAuctionScreen(false);
        setShowEndPopup(true); // 경매 종료 팝업 표시
        setRemainingTime('경매가 종료되었습니다.');
      }
    }, 1000); // 1초마다 업데이트

    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(interval);
  }, [auctionEndTime]);

  const handleBidIncrease = () => setBidAmount(bidAmount + 1000);
  const handleBidDecrease = () => setBidAmount(bidAmount - 1000);

  // 입찰 버튼 클릭 시 현재가 업데이트
  const handleBidSubmit = () => {
    if (bidAmount > currentPrice) {
      setCurrentPrice(bidAmount);
    } else {
      alert('입찰가는 현재가보다 높아야 합니다.');
    }
  };

  // 구매수수료 계산 (10% 후 1,000단위 내림)
  const calculateFee = (price) => Math.floor((price * 0.1) / 1000) * 1000;

  // 예상 구매가 계산
  const purchaseFee = calculateFee(currentPrice);
  const expectedPurchasePrice = currentPrice + purchaseFee;

  // 포맷된 금액들(금액에 1000단위 , 추가)
  const formattedBidAmount = bidAmount.toLocaleString();
  const formattedCurrentPrice = currentPrice.toLocaleString();
  const formattedPurchaseFee = purchaseFee.toLocaleString();
  const formattedExpectedPurchasePrice = expectedPurchasePrice.toLocaleString();

  return (
    <div className="SAauctionItem">
      <img src={imageSrc} alt={title} className="SAauctionImage" />
      <div className="SAauctionDetails">
        <h3>{title}</h3>
        <p><strong>경매 날짜: {auctionDate}</strong></p>
        <p><strong>경매 시간: {auctionTime}</strong></p>
        <p className="SAalertText">{alertText}</p>
      </div>
      <div className="SAauctionButtons">
        <button className="SAgoButton" onClick={openPopup}>{linkText}</button>
        <button className="SAalertButton">알림신청</button>
      </div>

      {/* 구매자, 판매자 선택 팝업 */}
      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <h2>실시간 경매</h2>
            <h3>{title}</h3>
            <p>생성된 실시간 경매를 진행할 페이지로 이동해주세요.</p>
            <div className="popup-buttons">
              <button className="seller-button" onClick={openSellerPage}>판매자<br/>페이지로 이동</button>
              <button className="buyer-button" onClick={openBuyerPopup}>구매자<br />페이지로 이동</button>
            </div>
            <button className="close-button" onClick={closePopup}>
              <img src='/images/white_close_button_icon.svg' alt="close button"/>
            </button>
          </div>
        </div>
      )}

      {/* 구매자 로딩 팝업 */}
      {showBuyerPopup && !showAuctionScreen && (
        <div className="overlay">
          <div className="SAwaitPopup">
            <div className='SAliveOnOffBox'>
              <h3>Live Off</h3>
            </div>
            <div className='SAbuyerWaitCommnetBox'>
              <h1>20,568명 대기중...</h1>
              <p>곧 실시간 경매가 시작될 예정입니다.</p>
              <p>잠시만 대기 해주시면 곧 경매가 시작됩니다.</p>
            </div>
            <button className="close-button" onClick={closeBuyerPopup}>
              <img src='/images/white_close_button_icon.svg' alt="close button"/>
            </button>
          </div>
        </div>
      )}

      {/* 구매자 경매 화면 */}
      { showAuctionScreen && (
        <div className="overlay">
          <div className='SAtotalPopup'>
            <div className="SAbuyerPopup">
              <div className="SAliveAuctionHeader">
                <h3>Live On</h3>
                <h1>구매자</h1>
                <div className="SAviewerCount">
                  <img src='/images/people_icon.svg'></img>
                  <p>20,584</p> 
                </div>
              </div>
              <div className='SAauctionContainer'>
                <div className="SAauctioncontentBox">
                  {/* 기존 경매 화면 구성 */}
                  {/* 경매 화면의 나머지 내용 */}
                  {/* Product Image Section */}
                  <div className="SAproductSection">
                    <div className='SAsoundBttn'>
                      <img id='SAsoundOffIcon' src='/images/sound_off_icon.svg'></img>
                      <img id='SAsoundOnIcon' src='/images/sound_on_icon.svg'></img>
                    </div>
                    <img src="/images/streaming_img.png" alt="Product" className="SAproductImage" />
                    <h2>OM + AASTHMA — GAFF - 미드나잇 블루</h2>
                  </div>

                  {/* Product Information Section */}
                  <div className="SAproductInfo">
                    <div className="SAsellerInfo">
                      <div className='SAsellerProfile'>
                        <img src='/images/seller_img.svg'></img>
                        <div>
                          <h3>Gooood_good </h3>
                          <p>Seller</p>
                        </div>
                      </div>
                      <div className='SAsellerMainInfo'>
                        <div>
                          <p>판매 건수</p>
                          <p>186</p>
                        </div>
                        <div>
                          <p>총 평가 점수</p>
                          <p>4.9</p>
                        </div>
                        <div>
                          <p>주 판매 목록</p>
                          <p>신발</p>
                        </div>
                      </div>
                      <div className='SAsellerEvaluation'>
                        <div className='SAsellerEvaluationDetail'>
                          <p>상품에 대한 설명</p>
                          <p>배송 속도</p>
                          <p>응답 속도</p>
                          <p>친절도</p>
                        </div>
                        <div className='SAsellerEvaluationDetail'>
                          <progress className='SAprogress' value="100" min="0" max="100"></progress>
                          <progress className='SAprogress' value="90" min="0" max="100"></progress>
                          <progress className='SAprogress' value="100" min="0" max="100"></progress>
                          <progress className='SAprogress' value="100" min="0" max="100"></progress>
                        </div>
                        <div className='SAsellerEvaluationDetail'>
                          <p>5.0</p>
                          <p>4.8</p>
                          <p>5.0</p>
                          <p>5.0</p>
                        </div>
                      </div>
                      <div className='SAmoreInfoButtonBox'>
                        <button className="SAmoreInfoButton">판매자 정보 더보기</button>
                      </div>
                    </div>

                    <div className="SAauctionInfoBox">
                      <div className="SAauctionInfo">
                        <div className='SAauctionInfoTitle'>
                          <h3>현재가:</h3>
                          <p>남은시간:</p>
                          <p>경매번호:</p>
                          <p>입찰단위:</p>
                          <p>희망 입찰가:</p>
                          <p>예상 구매가:</p>
                        </div>
                        <div className='SAauctionInfoContents'> 
                          <h3>{formattedCurrentPrice}원</h3>
                          <div className='SAremainingTime'>
                            <p>{formattedTimeDifference}</p> 
                            <p id='SArealEndTime'>({formattedAuctionEndTime})</p>
                          </div>
                          <p>23478023124</p>
                          <p>1,000원</p>
                          <div className='SAbidBox'>
                            <input type="text" id="SAbidInput" value={formattedBidAmount} readOnly /> <p>원</p>
                            <div className='SAbidButtonBox'>
                              <button onClick={handleBidIncrease} className="SAbidButton">+</button>
                              <button onClick={handleBidDecrease} className="SAbidButton">-</button>
                            </div>
                          </div>
                          <div className='SAexpectedPurchase'>
                            <p>{formattedExpectedPurchasePrice}원</p> 
                            <p id='SAexpectedPurchaseCalc'>({formattedCurrentPrice}원 + 구매수수료 {formattedPurchaseFee}원)</p>
                          </div>
                        </div>
                      </div>
                      <div className='SAbidSubmitButtonBox'>
                        <button className="SAbidSubmitButton" onClick={handleBidSubmit}>입찰하기</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Section */}
                <div className="SAchatContainer">
                  <div className="SAchatSection">
                    <div>
                      <ul>
                        {messages.map((msg, index) => (
                          <li key={index}><strong>{msg.user}:</strong> {msg.message}</li>
                        ))}
                        {/* 이 div가 스크롤을 맨 아래로 이동시키는 역할 */}
                        <div ref={messagesEndRef} />
                      </ul>
                    </div>
                  </div>
                  <div>
                    {/* 채팅 입력 */}
                    <input
                      className='SAchatInput'
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="메시지를 입력하세요..."
                    />
                  </div>
                </div>

              </div>
            </div>
            <button className="SAtotalBoxCloseButton" onClick={closeBuyerPopup}>
              <img src='/images/white_close_button_icon.svg' alt="close button"/>
            </button>
          </div>
        </div>
      )}

      {/* 판매자 경매 화면 */}
      {showSellerPopup && (
        <div className="overlay">
          <div className='SAtotalPopup'>
            <div className="SAbuyerPopup">
              <div className="SAsellerLiveAuctionHeader">
                <h3>Live Off</h3>
                <h1>판매자</h1>
              </div>
              <div className='SAauctionContainer'>
                <div className='SAsellerTotalBox'>
                  <div className='SAsellerViewBox'>
                    <div className="SAsellerAuctionContentBox">
                      {/* 기존 경매 화면 구성 */}
                      {/* 경매 화면의 나머지 내용 */}
                      {/* Product Image Section */}
                      <div className="SAsellerProductSection">
                        <div className='SAsoundBttn'>
                          <img id='SAmikeOffIcon' src='/images/mike_off_icon.svg'></img>
                          <img id='SAmikeOnIcon' src='/images/mike_on_icon.svg'></img>
                        </div>
                        <img src="/images/streaming_img.png" alt="Product" className="SAsellerProductImage" />
                      </div>

                      <div className="SAsellerAuctionDetails">
                        <h2>OM + AASTHMA — GAFF - 미드나잇 블루</h2>
                        <div className='SAsellerAuctionDetailsBox'>
                          <div className='SAsellerAuctionContentsTitle'>
                            <p>경매 시작까지<br/>남은 시간</p>
                            <p>입찰단위</p>
                            <p>경매 시작가</p>
                            <p>대기중인 사용자</p>
                          </div>
                          <div className='SAsellerAuctionContentsValue'>
                            <div>
                              <p id='SAsellerAuctionStartRemainTimeDiff'>{formattedTimeDifference}</p>
                              <p id='SAsellerAuctionStartRemainTime'>({formattedAuctionStartTime})</p>
                            </div>
                            <p>1000원</p>
                            <p>735,000원</p>
                            <p>20,584</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="SAsellerStreamingInfo">
                      <p id='SAsellerStreamingNote'>* 경매 시간이 되면 자동으로 스트리밍을 시작합니다.</p>
                      <p id='SAsellerStreamingNoteContent'>실시간 스트리밍을 시작하려면 스트리밍 소프트웨어에서 ____로 동영상을 전송을 시작하세요.</p>
                    </div>
                    <div className='SAsellerSteamingBox'>
                    </div>
                  </div>
                
                  {/* Chat Section */}
                  <div className="SAsellerChatContainer">
                    <div className="SAchatSection">
                      <div>
                        <ul>
                          {messages.map((msg, index) => (
                            <li key={index}><strong>{msg.user}:</strong> {msg.message}</li>
                          ))}
                          {/* 이 div가 스크롤을 맨 아래로 이동시키는 역할 */}
                          <div ref={messagesEndRef} />
                        </ul>
                      </div>
                    </div>
                    <div>
                      {/* 채팅 입력 */}
                      <input
                        className='SAchatInput'
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="메시지를 입력하세요..."
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <button className="SAtotalBoxCloseButton" onClick={closeSellerPage}>
              <img src='/images/white_close_button_icon.svg' alt="close button"/>
            </button>
          </div>
        </div>
      )}

      {/* 경매 종료 팝업 */}
      {showEndPopup && (
        <div className="overlay">
          <div className='SAtotalPopup'>
            <div className="SAendPopup">
              <h2>경매 마감 안내</h2>
              <p>OM + AASTHMA — GAFF - 미드나잇 블루 <br/>상품의 실시간 경매가 마감되었습니다.</p>
              <p id='SAsuccessfulBidderName'>최종 낙찰자 : <strong>**낙찰자 이름**</strong>님</p>
              <p id='SAsuccessfulBidderPrice'>낙찰 금액 : <strong>**낙찰 금액**원</strong></p>
              <p id='SAendAuctionMent'>참여해 주신 모든 분들께 감사드리며, <br/> 다음 경매에도 많은 관심 부탁드립니다!</p>
              <button className='SAendOkbttn' onClick={() => setShowEndPopup(false)}>확인</button>
            </div>
            <button className="close-button" onClick={closeBuyerPopup}>
                <img src='/images/white_close_button_icon.svg' alt="close button"/>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default SAitem;