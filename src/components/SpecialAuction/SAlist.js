import React from 'react';
import SAitem from '../SpecialAuction/SAitem';
import '../../css/SpecialAuction/SAlist.css';

function list() {
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
          />
        ))
      ) : (
        // 데이터가 없을 때 표시할 내용
        <div className="SAnoAuction">
          <p>현재 진행중인 실시간 경매가 없습니다.</p>
          <p>추후 진행하게 될 실시간 경매에서 만나요!</p>
        </div>
      )}
    </div>
  );
}

export default list;