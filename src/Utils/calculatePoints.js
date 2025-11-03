const THRESHOLD = 300;
const MAX_DISTANCE = 10300;

export const calculatePoints = (distance, maxPointsPerRound, rounds) => {
    const basePenaltyPerStep = maxPointsPerRound / 100;
    const penaltyReductionFactor = rounds / 10; 
    const penaltyPerStep = basePenaltyPerStep / penaltyReductionFactor;

    if (distance <= THRESHOLD) {
        return maxPointsPerRound;
    } else if (distance > MAX_DISTANCE) {
        return 1;
    } else {
        const steps = Math.floor((distance - THRESHOLD) / 100);
        const pointsLost = steps * penaltyPerStep;
        const points = maxPointsPerRound - pointsLost;
        return Math.min(
            maxPointsPerRound, 
            Math.max(Math.ceil(points), 1) 
        );
    }
};
