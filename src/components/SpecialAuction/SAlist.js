import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import SAitem from './SAitem';
import '../../css/SpecialAuction/SAlist.css';

const socket = io('http://localhost:3000'); // 백엔드 주소

function SAlist() {
  const [showEndPopup, setShowEndPopup] = useState(false); // 팝업 상태 추가
  const [nickname, setNickname] = useState('User'); // 기본 닉네임은 'User'
  const [messages, setMessages] = useState([]); // 채팅 메시지 배열 상태
  const [inputMessage, setInputMessage] = useState(''); // 채팅 입력 메세지 상태
  const [userType, setUserType] = useState('buyer'); // 판매자/구매자 여부 저장
  const [showBuyerPopup, setShowBuyerPopup] = useState(false); // 구매자 페이지 로딩 팝업 상태
  const [showSellerPopup, setShowSellerPopup] = useState(false); // 판매자 페이지 팝업 상태
  const [showAuctionScreen, setShowAuctionScreen] = useState(false); // 경매 화면 팝업 상태
  const [remainingTime, setRemainingTime] = useState('');
  const [hasAuctionEnded, setHasAuctionEnded] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(735000); // 현재가 (최초 현재가 설정)
  const [bidAmount, setBidAmount] = useState(736000); // 입찰가 상태

  const messagesEndRef = useRef(null); // 메세지 채팅 내용 마지막 위치


  // 경매 시작 시간 설정
  const auctionStartTime = new Date('2024-10-02T12:00:00');
  const formattedAuctionStartTime = auctionStartTime.toLocaleString();
  
  // 경매 종료 시간 설정
  const auctionEndTime = new Date('2024-10-03T12:00:00');
  const formattedAuctionEndTime = auctionEndTime.toLocaleString();

  // 시간 차이를 시간, 분, 초로 변환하는 함수
  const formatTimeDifference = (timeDiff) => {
    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
  };

  // 현재 시간과의 차이 계산
  const now = new Date();
  const timeDifference = auctionEndTime - now;
  const formattedTimeDifference = formatTimeDifference(timeDifference);

  const SAauctionData = [
    // 경매 데이터가 없을 경우 빈 배열로 설정하여 확인할 수 있습니다.
    // 데이터가 있을 경우 주석을 제거하세요.
  
    {
      imageSrc: '/images/SA_camera_img.png',
      title: 'PEARL RIVER 1900년대 카메라',
      auctionDate: ' 2024.09.05',
      auctionTime: ' 17:00 ~ 17:30',
      linkText: '바로가기',
      alertText: '* 알림은 경매 시작 30분 전에 발송됩니다.\n* 실시간 경매는 참여 인원수가 5000명으로 제한됩니다.',
    },
    {
      imageSrc: '/images/SA_sunglasses_img.png',
      title: 'OM + AASTHMA — GAFF 미드나잇 블루',
      auctionDate: ' 2024.09.13',
      auctionTime: ' 20:00 ~ 20:30',
      linkText: '바로가기',
      alertText: '* 알림은 경매 시작 30분 전에 발송됩니다.\n* 실시간 경매는 참여 인원수가 5000명으로 제한됩니다.',
    },
    {
      imageSrc: '/images/SA_genesis_welcome_kit_img.png',
      title: '제네시스 G80 웰컴 키트',
      auctionDate: ' 2024.09.19',
      auctionTime: ' 19:30 ~ 20:00',
      linkText: '바로가기',
      alertText: '* 알림은 경매 시작 30분 전에 발송됩니다.\n* 실시간 경매는 참여 인원수가 5000명으로 제한됩니다.',
    }
  
  ];

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

  // Enter 키로 전송 가능하게 하는 핸들러
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // 백엔드에서 userindex 받아서 userType 설정
  useEffect(() => {
    async function fetchUserType() {
      try {
        // 예시: 백엔드에서 userindex 받아오기 (실제 API 경로와 로직으로 변경)
        const response = await fetch('/api/user-type');
        const data = await response.json();

        setUserType(data.userType); // 'seller' or 'buyer'
        setNickname(data.userType === 'seller' ? '판매자' : '구매자');
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    }

    fetchUserType();
  }, []);

  const handleGoButtonClick = () => {
    const now = new Date();
    if (userType === 'seller') {
      setShowSellerPopup(true);
    } else if (userType === 'buyer') {
      if (now < auctionStartTime) {
        setShowBuyerPopup(true);
      } else {
        setShowAuctionScreen(true);
      }
    }
  };

  // 구매자 페이지 팝업 닫기
  const closeBuyerPopup = () => {
    setShowBuyerPopup(false);
    setShowAuctionScreen(false);
  };

  // 판매자 페이지 닫기
  const closeSellerPage = () => setShowSellerPopup(false);

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

  useEffect(() => {
    // 타이머 설정
    const interval = setInterval(() => {
      const now = new Date();
      const timeDifference = auctionEndTime - now;

      setRemainingTime(formatTimeDifference(timeDifference));

      // 경매 종료 시 팝업을 한 번만 띄움
      if (timeDifference <= 0 && !hasAuctionEnded) {
        clearInterval(interval);
        setHasAuctionEnded(true);
        setShowEndPopup(true); // 팝업 띄움
      }
    }, 1000);

    return () => {
      clearInterval(interval); // 정리
    };
  }, [hasAuctionEnded]);

  const handleCloseEndPopup = () => {
    setShowEndPopup(false); // 팝업 닫기
  };


  return (
    <div className="SAauctionList">
      {SAauctionData.length > 0 ? (
        SAauctionData.map((item, index) => (
          <SAitem 
            key={index} 
            imageSrc={item.imageSrc} 
            title={item.title} 
            auctionDate={item.auctionDate} 
            auctionTime={item.auctionTime} 
            linkText={item.linkText}
            alertText={item.alertText}
            handleGoButtonClick={handleGoButtonClick} // 이 부분 확인
          />
        ))
      ) : (
        // 데이터가 없을 때 표시할 내용
        <div className="SAnoAuction">
          <p>현재 진행중인 실시간 경매가 없습니다.</p>
          <p>추후 진행하게 될 실시간 경매에서 만나요!</p>
        </div>
      )}

        {/* 구매자 로딩 팝업 */}
        {showBuyerPopup && !showAuctionScreen && (
        <div className="SAoverlay">
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
        <div className="SAoverlay">
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
                            <p>{remainingTime}</p> 
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
        <div className="SAoverlay">
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
        <div className="SAoverlay">
          <div className='SAtotalPopup'>
            <div className="SAendPopup">
              <h2>경매 마감 안내</h2>
              <p>OM + AASTHMA — GAFF - 미드나잇 블루 <br/>상품의 실시간 경매가 마감되었습니다.</p>
              <p id='SAsuccessfulBidderName'>최종 낙찰자 : <strong>**낙찰자 이름**</strong>님</p>
              <p id='SAsuccessfulBidderPrice'>낙찰 금액 : <strong>**낙찰 금액**원</strong></p>
              <p id='SAendAuctionMent'>참여해 주신 모든 분들께 감사드리며, <br/> 다음 경매에도 많은 관심 부탁드립니다!</p>
              <button className='SAendOkbttn' onClick={handleCloseEndPopup}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SAlist;