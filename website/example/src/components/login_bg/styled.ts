import styled, { keyframes } from 'styled-components'

const bgSquare = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }
  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
`

const backgrounds = {
  default: 'https://static.igroupes.com/ovine_bg_default.jpeg',
  cxd: 'https://static.igroupes.com/ovine_bg_cxd.jpeg',
  dark: 'https://static.igroupes.com/ovine_bg_black.jpeg',
  antd: 'https://static.igroupes.com/ovine_bg_cxd.jpeg',
}

export const StyledLoginBg = styled.div`
  .bg-anime {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: url(${(p) => backgrounds[p.theme.name]});
    background-size: cover;
  }

  .bg-anime li {
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    animation: ${bgSquare} 19s linear infinite;
  }

  .bg-anime li:nth-child(0) {
    left: 33%;
    width: 159px;
    height: 159px;
    bottom: -159px;
  }
  .bg-anime li:nth-child(1) {
    left: 5%;
    width: 146px;
    height: 146px;
    bottom: -146px;
    animation-delay: 3s;
  }
  .bg-anime li:nth-child(2) {
    left: 64%;
    width: 150px;
    height: 150px;
    bottom: -150px;
    animation-delay: 5s;
  }
  .bg-anime li:nth-child(3) {
    left: 7%;
    width: 117px;
    height: 117px;
    bottom: -117px;
    animation-delay: 9s;
  }
  .bg-anime li:nth-child(4) {
    left: 79%;
    width: 176px;
    height: 176px;
    bottom: -176px;
    animation-delay: 12s;
  }
  .bg-anime li:nth-child(5) {
    left: 13%;
    width: 174px;
    height: 174px;
    bottom: -174px;
    animation-delay: 5s;
  }
  .bg-anime li:nth-child(6) {
    left: 68%;
    width: 173px;
    height: 173px;
    bottom: -173px;
    animation-delay: 10s;
  }
  .bg-anime li:nth-child(7) {
    left: 80%;
    width: 137px;
    height: 137px;
    bottom: -137px;
    animation-delay: 7s;
  }
  .bg-anime li:nth-child(8) {
    left: 39%;
    width: 104px;
    height: 104px;
    bottom: -104px;
    animation-delay: 19s;
  }
  .bg-anime li:nth-child(9) {
    left: 12%;
    width: 129px;
    height: 129px;
    bottom: -129px;
    animation-delay: 26s;
  }
  .bg-anime li:nth-child(10) {
    left: 2%;
    width: 194px;
    height: 194px;
    bottom: -194px;
    animation-delay: 20s;
  }
  .bg-anime li:nth-child(11) {
    left: 4%;
    width: 173px;
    height: 173px;
    bottom: -173px;
    animation-delay: 42s;
  }
  .bg-anime li:nth-child(12) {
    left: 82%;
    width: 146px;
    height: 146px;
    bottom: -146px;
    animation-delay: 50s;
  }
  .bg-anime li:nth-child(13) {
    left: 69%;
    width: 112px;
    height: 112px;
    bottom: -112px;
    animation-delay: 57s;
  }
  .bg-anime li:nth-child(14) {
    left: 44%;
    width: 123px;
    height: 123px;
    bottom: -123px;
    animation-delay: 65s;
  }
`
