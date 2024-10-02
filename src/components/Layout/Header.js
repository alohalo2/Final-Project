import React,{useState} from 'react';
import '../../css/Layout/Header.css';
import '../../css/Layout/MediaQuery.css';

const Header = () => {

    const [boxHeight, setBoxHeight] = useState('auto'); // 초기 높이 설정

    const handleMouseOver = (e) => {
        document.querySelector(".HDnavbarMenuDetailBox").style.display = 'block';
    }

    const handleMouseLeave = (e) => {
        document.querySelector(".HDnavbarMenuDetailBox").style.display = 'none';
        document.querySelector(".HDnavbarMenuDetailCategory").style.display = 'none';
        setBoxHeight('auto')
    };

    const handleMouseOverCate = (e) => {
        document.querySelector(".HDarrowIcon").style.opacity = '1';
    }

    const handleMouseLeaveCate = (e) => {
        document.querySelector(".HDarrowIcon").style.opacity = '0';
    }

    let clickCate = true;

    const handleMouseClick = (e) => {
        if(clickCate) {
            document.querySelector(".HDnavbarMenuDetailCategory").style.display = 'flex'
            setBoxHeight('22.5rem')
            clickCate = false;
        } else {
            document.querySelector(".HDnavbarMenuDetailCategory").style.display = 'none'
            setBoxHeight('auto')
            clickCate = true;
        }
    }

  return (
    <header>
        <nav className="HDnavbar">
            <div className="HDnavbarLogo">
                <img src="../images/logo.svg" alt="navbarLogo"></img>
            </div>
            <div className="HDnavbarMenuWrapper" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
                <ul className="HDnavbarMenu">
                    <li className="HDnavbarMenuItem">
                        <a href='#'>특수경매</a>
                    </li>
                    <li className="HDnavbarMenuItem">
                        <a href='#'>일반경매</a> 
                    </li>
                    <li className="HDnavbarMenuItem"><a href="#">물품등록</a></li>
                </ul>

                <div className="HDnavbarMenuDetailBox" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} style={{height: boxHeight}}>
                    <div className='HDnavbarMenuDetailFlex'>
                        <ul className="HDnavbarMenuDetail">
                            <li><a href="#">실시간</a></li>
                            <li><a href="#">블라인드</a></li>
                        </ul>
                        <ul className="HDnavbarMenuDetail">
                            <li><a href="#">전체보기</a></li>
                            <li id='HDnavbarMenuDetailCate' onClick={handleMouseClick} onMouseOver={handleMouseOverCate} onMouseLeave={handleMouseLeaveCate}><a href='#'>카테고리</a></li>
                        </ul>
                        <div className='HDarrowIcon'>
                            <img src='/images/right_arrow_icon.svg'></img>
                        </div>
                        <div className="HDnavbarMenuDetailCategoryBox">
                            <ul className="HDnavbarMenuDetailCategory">
                                <li><a href="#">의류/잡화</a></li>
                                <li><a href="#">취미/수집</a></li>
                                <li><a href="#">도서</a></li>
                                <li><a href="#">예술품</a></li>
                                <li><a href="#">전자제품</a></li>
                                <li><a href="#">사진</a></li>
                                <li><a href="#">골동품</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="HDnavbarSearchbar">
                <input type="text"></input>
            </div>
            <ul className="HDnavbarMember">
                <li><a href="#">로그인</a></li>
                <li><a href="#">회원가입</a></li>
            </ul>
            <div className="HDnavbarAlarm">
                <img src="../images/alarm.svg" alt="alarm"></img>
            </div>
            <a href="#" className="HDnavbarToggleBtn">
                <img src="../images/hamburger_icon.svg" alt="hamburger_icon"></img>
            </a>
        </nav>
    </header>
  );
};

export default Header;