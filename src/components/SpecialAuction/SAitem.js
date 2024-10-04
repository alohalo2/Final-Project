import React from 'react';
import '../../css/SpecialAuction/SAitem.css';

function SAitem({ imageSrc, title, auctionDate, auctionTime, linkText, alertText, handleGoButtonClick}) {

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
        <button className="SAgoButton" onClick={handleGoButtonClick}>{linkText}</button>
        <button className="SAalertButton">알림신청</button>
      </div>



    </div>
  );
}

export default SAitem;