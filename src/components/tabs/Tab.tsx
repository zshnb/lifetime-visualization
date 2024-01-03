import {styled} from "@mui/material";
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';

const Tab = styled(BaseTab)`
  font-family: 'IBM Plex Sans', sans-serif;
  color: #333;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  background-color: transparent;
  width: 60px;
  line-height: 28px;
  padding: 10px 12px;
  margin: 6px;
  border: none;
  border-radius: 14px;
  display: flex;
  justify-content: center;

  &.${tabClasses.selected} {
    background-color: #fff;
    color: #333333;
  }
`;

export default Tab