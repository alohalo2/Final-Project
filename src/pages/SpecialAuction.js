import React from 'react';
import '../css/SpecialAuction/SpecialAuction.css';
import SAtab from '../components/SpecialAuction/SAtab';

const SpecialAuction = () => {
  return (
    <div>
      <div className='SAheader'>
        <h2>특수경매</h2>
        <div className='SAnoticeBox'>
          <img src='/images/SA_notice_icon.svg'></img>
          <div>
            <p>실시간 경매: 실시간 스트리밍으로 경매가 진행되며 실시간 채팅으로 커뮤니티 형성</p>
            <p>블라인드 경매: 실시간 스트리밍으로 경매가 진행되며 경매 종료 시까지 금액이 보이지 않음</p>
          </div>
        </div>
      </div>
      <SAtab/>
    </div>
  );
};

export default SpecialAuction;