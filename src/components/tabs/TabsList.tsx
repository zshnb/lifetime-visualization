import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import {styled} from "@mui/material";
const TabsList = styled(BaseTabsList)(
  ({ theme }) => `
  width: 270px;
  background-color: #E8E3D8;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  `,
);

export default TabsList