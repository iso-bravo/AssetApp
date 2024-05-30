import { useState, useEffect } from "react";
import axios from "axios";
import EmployeeIcon from "../assets/employees_icon.png";
import AssetIcon from "../assets/asset_icon.png";
import { Box, Container } from "@mui/material";
import NavegatorDrawer from "../components/NavegatorDrawer";

export const API = axios.create({ baseURL: "http://localhost:8000" });

function Home() {
  const [assetCount, setAssetCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/asset_employee_count/")
      .then((response) => {
        const { asset_count, employee_count } = response.data;
        setAssetCount(asset_count);
        setEmployeeCount(employee_count);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <NavegatorDrawer />
      <Container>
        <Box
          maxHeight={800}
          minHeight={300}
          marginTop={10}
          marginBottom={10}
          marginLeft={30}
          minWidth={100}
        >
          <div className="">
            <div className="flex gap-5 bg-[#e5e5e5] px-20 py-10 rounded-md">
              <div>
                <img src={AssetIcon} className="w-36" alt="Asset Icon" />
              </div>
              <div className="mt-4 gap-5">
                <h2 className="text-3xl font-bold">Asset</h2>
                <h1 className="text-3xl py-3">{assetCount}</h1>
              </div>
            </div>
            <div className="flex gap-5 bg-[#e5e5e5] px-20 py-10 rounded-md mt-4">
              <div>
                <img src={EmployeeIcon} className="w-36" alt="Employee Icon" />
              </div>
              <div className="mt-5">
                <h2 className="text-3xl font-bold">Employees</h2>
                <h1 className="text-3xl py-3">{employeeCount}</h1>
              </div>
            </div>
          </div>
        </Box>
      </Container>
    </>
  );
}

export default Home;
