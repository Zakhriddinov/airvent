import { Dropdown } from "antd";
import styled from "styled-components";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const MoreAction = styled.div`
  font-size: 25px;
  span {
    transform: rotate(90deg);
    cursor: pointer;
  }
`;

const DropdownWrap = styled(Dropdown)``;
export { Header, MoreAction, DropdownWrap };
