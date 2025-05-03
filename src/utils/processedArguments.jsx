const processArguments = (argumentsArray, roundsArray, user) => {
  const newTimeStamp = new Date(); // Example UTC timestamp from MongoDB
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
  const currentTime = new Date(
    newTimeStamp.getTime() + istOffset
  ).toISOString();
  // Filter arguments
  const filteredArguments = argumentsArray.filter((arg) => {
    const round = roundsArray.find((r) => r.roundNumber === arg.roundNumber);

    // Keep argument if round has ended
    if (round && round.endDate < currentTime) return true;

    // Keep if the user is a lead for the respective panelSide
    if (
      (user && user?.message?.role === "leadFor" && arg.panelSide === "For") ||
      (user &&
        user?.message?.role === "leadAgainst" &&
        arg.panelSide === "Against")
    ) {
      return true;
    }

    return false; // Remove other arguments
  });

  // Organize arguments by round and panelSide, ensuring only one per category
  const roundMap = new Map();

  filteredArguments.forEach((arg) => {
    const key = `${arg.roundNumber}-${arg.panelSide.toLowerCase()}`;
    if (!roundMap.has(key)) {
      roundMap.set(key, arg); // Store only one argument per category
    }
  });

  // Construct the final ordered array
  const resultArray = [];

  roundsArray.forEach((round) => {
    const againstKey = `${round.roundNumber}-against`;
    const forKey = `${round.roundNumber}-for`;

    if (roundMap.has(againstKey)) {
      resultArray.push(roundMap.get(againstKey));
    }
    if (roundMap.has(forKey)) {
      resultArray.push(roundMap.get(forKey));
    }
  });

  return resultArray;
};
export default processArguments;
