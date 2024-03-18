import React from "react";
import axios from "axios";

const Payout = () => {
  const handlePayout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/payment/payouts`
      );
      console.log("Payout successful");
      // Optionally, you can perform any other actions upon successful payout
    } catch (error) {
      console.error("Error occurred while processing payout:", error);
      // Optionally, you can display an error message or handle the error in another way
    }
  };
  const createAccount = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/payment/create`
      );
      console.log("Payout successful");
      // Optionally, you can perform any other actions upon successful payout
    } catch (error) {
      console.error("Error occurred while processing payout:", error);
      // Optionally, you can display an error message or handle the error in another way
    }
  };

  return (
    <>
      <button onClick={handlePayout} className="pt-[100px]">
        Payout
      </button>
      <button onClick={createAccount} className="pt-[100px]">
        Create
      </button>
    </>
  );
};

export default Payout;
