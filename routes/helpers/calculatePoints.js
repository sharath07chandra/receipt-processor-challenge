// Function to calculate points for a receipt based on the rules
function calculatePoints(receipt) {
    let totalPoints = 0;

    // Rule: One point for every alphanumeric character in the retailer name
    totalPoints += receipt.retailer.replace(/[^a-zA-Z0-9]/g, '').length;

    // Rule: 50 points if the total is a round dollar amount with no cents
    if (receipt.total == Math.floor(receipt.total)) {
        totalPoints += 50;
    }

    // Rule: 25 points if the total is a multiple of 0.25
    if (receipt.total % 0.25 === 0) {
        totalPoints += 25;
    }

    // Rule: 5 points for every two items on the receipt
    totalPoints += Math.floor(receipt.items.length / 2) * 5;

    // Rule: If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer.
    receipt.items.forEach(item => {
        const trimmedLength = item.shortDescription.trim().length;
        if (trimmedLength % 3 === 0) {
            const pointsForItem = Math.ceil(item.price * 0.2);
            totalPoints += pointsForItem;
        }
    });

    // Rule: 6 points if the day in the purchase date is odd
    const purchaseDate = new Date(receipt.purchaseDate);
    if (purchaseDate.getUTCDate() % 2 !== 0) {
        totalPoints += 6;
    }

    // Rule: 10 points if the time of purchase is after 2:00pm and before 4:00pm
    const purchaseTime = receipt.purchaseTime.split(':');
    if (purchaseTime[0] >= 14 && purchaseTime[0] < 16) {
        totalPoints += 10;
    }

    console.log(totalPoints, 'total points');

    return totalPoints;
}

export default calculatePoints;