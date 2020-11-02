import React, { useState } from 'react';
import { Navbar, NavbarToggler, Nav, NavItem, NavLink } from 'reactstrap';

const DetailNavbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="lg">
        <NavbarToggler onClick={toggle} />
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink href="/">휴게소 정보</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">ex-food</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">매출 Top 5</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">대표음식</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">편의시설</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">영업시간</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/">사용자 후기</NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  );
};

export default DetailNavbar;
// import NavBar, { ElementsWrapper } from 'react-scrolling-nav';

// class DetailNavbar extends Component {
//   render() {
//     const navbarItems = [
//       {
//         label: '휴게소 정보',
//         target: 'item-1',
//       },
//       {
//         label: 'ex-food',
//         target: 'item-2',
//       },
//       {
//         label: '매출 Top 5',
//         target: 'item-3',
//       },
//       {
//         label: '대표음식',
//         target: 'item-4',
//       },
//       {
//         label: '편의시설',
//         target: 'item-5',
//       },
//       {
//         label: '영업시간',
//         target: 'item-6',
//       },
//       {
//         label: '사용자 후기',
//         target: 'item-7',
//       },
//     ];
//     return (
//       <div>
//         <Nav variant="pills" defaultActiveKey="/home">
//           <Nav.Item>
//             <Nav.Link href="/home">Active</Nav.Link>
//           </Nav.Item>
//           <Nav.Item>
//             <Nav.Link eventKey="link-1">Option 2</Nav.Link>
//           </Nav.Item>
//           <Nav.Item>
//             <Nav.Link eventKey="disabled" disabled>
//               Disabled
//             </Nav.Link>
//           </Nav.Item>
//         </Nav>
//       </div>
//     );
//   }
// }

// export default DetailNavbar;
