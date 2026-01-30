import React, { createContext, useContext, useState } from "react";

const LotteryContext = createContext();
export const useLottery = () => useContext(LotteryContext);

export const LotteryProvider = ({ children }) => {
  /* ===== ADMIN SETTINGS (DEFAULT) ===== */
  const [ticketPrice, setTicketPrice] = useState(10);
  const [rewardCoins, setRewardCoins] = useState(500);
  const [maxWinners, setMaxWinners] = useState(1);
  const [drawStatus, setDrawStatus] = useState("open"); // open | closed

  const [tickets, setTickets] = useState([]);
  const [lastWinners, setLastWinners] = useState([]);
  const [isDrawn, setIsDrawn] = useState(false);

  /* ===== CHECK USER JOIN ===== */
  const hasUserJoined = (userId) =>
    tickets.some((t) => t.userId === userId);

  /* ===== BUY TICKET ===== */
  const buyTicket = (user) => {
    if (drawStatus !== "open") {
      return { success: false, message: "closed" };
    }

    if (hasUserJoined(user.id)) {
      return { success: false, message: "already_joined" };
    }

    const ticket = {
      userId: user.id,
      userName: user.name,
      ticketNumber: Math.floor(100000 + Math.random() * 900000),
    };

    setTickets((prev) => [...prev, ticket]);
    return { success: true };
  };

  /* ===== DRAW WINNERS ===== */
  const drawWinners = () => {
    if (tickets.length === 0) return;

    const shuffled = [...tickets].sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, maxWinners);

    const rewardPerWinner = Math.floor(rewardCoins / maxWinners);

    const finalWinners = winners.map((w) => ({
      ...w,
      coins: rewardPerWinner,
      date: new Date().toLocaleString(),
    }));

    setLastWinners(finalWinners);
    setIsDrawn(true);
    setTickets([]);
    setDrawStatus("closed");
  };

  /* ===== RESET LOTTERY ===== */
  const resetLottery = () => {
    setTickets([]);
    setLastWinners([]);
    setIsDrawn(false);
    setDrawStatus("open");
  };

  /* ===== DERIVED ===== */
  const totalJoinedUsers = tickets.length;
  const totalPoolCoins = totalJoinedUsers * ticketPrice;

  return (
    <LotteryContext.Provider
      value={{
        /* admin settings */
        ticketPrice,
        rewardCoins,
        maxWinners,
        drawStatus,

        setTicketPrice,
        setRewardCoins,
        setMaxWinners,
        setDrawStatus,

        /* runtime */
        totalJoinedUsers,
        totalPoolCoins,
        lastWinners,
        isDrawn,

        /* actions */
        buyTicket,
        drawWinners,
        resetLottery,
        hasUserJoined,
      }}
    >
      {children}
    </LotteryContext.Provider>
  );
};