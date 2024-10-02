import React,{useState} from 'react';
import SAlist from '../SpecialAuction/SAlist';
import '../../css/SpecialAuction/SAtab.css';

const SAtab = () => {

    const [activeTab, setActiveTab] = useState('realtime'); // 초기값을 'realtime'으로 설정

    // 탭을 클릭했을 때 activeTab 상태를 변경
    const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    };

  return (
    <div>
        {/* 탭 버튼들 */}
        <div className="SAtabs">
            <div>
                <button
                    className={`${"SAliveAuctionBox"} ${activeTab === 'realtime' ? 'active' : ''}`}
                    onClick={() => handleTabClick('realtime')}
                >
                    실시간 경매
                </button>
                <button
                    className={`${"SAblindAuctionBox"} ${activeTab === 'blind' ? 'active' : ''}`}
                    onClick={() => handleTabClick('blind')}
                >
                    블라인드 경매
                </button>
            </div>
            {/* 추가 알림 텍스트 */}
            <p className="SAnote">
            * 실시간 경매, 블라인드 경매는 항상 있는 경매가 아니기 때문에 관심 있으신 분들은 별도 알림 신청 필요
            </p>
        </div>

        <div className='SAauctionTotalBox'>
                {/* 탭에 따라 보여줄 내용 */}
                {activeTab === 'realtime' && (
                    <div>
                        <SAlist /> {/* 실시간 경매 내용 */}
                    </div>
                )}
                {activeTab === 'blind' && (
                    <div>
                        <SAlist /> {/* 블라인드 경매 내용 */}
                    </div>
                )}
        </div>
    </div>
  );
};

export default SAtab;