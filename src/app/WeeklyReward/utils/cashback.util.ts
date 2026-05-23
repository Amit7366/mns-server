export const getCashbackPercent = (tier: string, netLoss: number): number => {
  switch (tier) {
    case 'Normal':
      if (netLoss >= 10000 && netLoss < 35000) return 0.005;
      if (netLoss >= 35000 && netLoss < 100000) return 0.01;
      if (netLoss >= 100000 && netLoss < 500000) return 0.015;
      if (netLoss >= 500000) return 0.02;
      return 0;
    case 'Bronze':
      if (netLoss >= 35000 && netLoss < 100000) return 0.005;
      if (netLoss >= 100000 && netLoss < 500000) return 0.01;
      if (netLoss >= 500000) return 0.02;
      return 0;
    case 'Silver':
      if (netLoss >= 8000 && netLoss < 35000) return 0.005;
      if (netLoss >= 35000 && netLoss < 100000) return 0.01;
      if (netLoss >= 100000 && netLoss < 500000) return 0.02;
      if (netLoss >= 500000) return 0.03;
      return 0;
    case 'Gold':
      if (netLoss >= 8000 && netLoss < 35000) return 0.01;
      if (netLoss >= 35000 && netLoss < 100000) return 0.02;
      if (netLoss >= 100000 && netLoss < 500000) return 0.03;
      if (netLoss >= 500000) return 0.08;
      return 0;
    case 'Platinum':
      if (netLoss >= 8000 && netLoss < 35000) return 0.03;
      if (netLoss >= 35000 && netLoss < 100000) return 0.05;
      if (netLoss >= 100000 && netLoss < 500000) return 0.08;
      if (netLoss >= 500000) return 0.10;
      return 0;
    default:
      return 0;
  }
};
