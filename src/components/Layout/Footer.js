import React from 'react';
import '../../css/Layout/Footer.css';
import '../../css/Layout/MediaQuery.css';

const Footer = () => {
  return (
    <footer>
        <div className="FTcontents">
            <div className="FTcontentsBody">
                <div className="FTcontentsBody_logo">
                    <img id="FTlogo" src="../images/logo_white.svg" alt="FTlogo"></img>
                </div>
                <div className="FTcontentsBodyContent">
                    <div className="FTcontentsBodyContentMenu">
                        <p>회사소개</p>
                        <div className="FTcontour"></div>
                        <p>이용약관</p>
                        <div className="FTcontour"></div>
                        <p>개인정보취급방침</p>
                        <div className="FTcontour"></div>
                        <p>이메일무단수집거부</p>
                        <div className="FTcontour"></div>
                        <p>고객센터</p>
                    </div>
                    <div className="FTcontentsBodyContentDetail">
                        <p>상호명: 원티드</p>
                        <div className="FTcontour"></div>
                        <p>주소: 서울특별시 강남구 819 3 삼오빌딩 5-8층</p>
                        <p>Tel: 010-1234-5678</p>
                        <div className="FTcontour"></div>
                        <p>E-mail: bitcamp502@bitcamp.com</p>
                    </div>
                    <div className="FTcontentsBodyContentMember">
                        <p>Lee Jusung</p>
                        <div className="FTcontour"></div>
                    </div>
                </div>
            </div>
            <div className="FTcontentsBttm">
                <p>© {new Date().getFullYear()} WANTED All picture cannot be copied without permission.</p>
            </div>
        </div>
        <div className="FTmainContour"></div>
        <div className="FTicons">
            <a href="#"><img src="../images/instagram_icon.svg" alt="instagram"></img></a> 
            <a href="#"><img id="FTfacebookIcon" src="../images/facebook_icon.svg" alt="facebook"></img></a>
            <a href="#"><img src="../images/tiwtter_icon.svg" alt="twitter"></img></a>
            <a href="#"><img src="../images/pinterest_icon.svg" alt="pinterest"></img></a>
        </div>
    </footer>
  );
};

export default Footer;