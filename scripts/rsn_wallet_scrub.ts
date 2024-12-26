import { ErgoClient, ErgoBox, ErgoTransaction } from '@ergolabs/ergo-sdk';

const client = new ErgoClient('https://api.ergoplatform.com');
const rsnTokenId = '8b08cdd5449a9592a9e79711d7d79249d7a03c535d17efaee83e216e80a44c4b';

async function main() {
  const blocks = await client.blocks.getBlocks();
  const rsnInputs = [];

  for (const block of blocks) {
    for (const transaction of block.transactions) {
      for (const input of transaction.inputs) {
        if (input.assets.find((asset) => asset.tokenId === rsnTokenId)) {
          rsnInputs.push({
            transactionId: transaction.id,
            inputId: input.boxId,
            amount: input.assets.find((asset) => asset.tokenId === rsnTokenId).amount,
          });
        }
      }
    }
  }

  const weeklyInflows = {};

  for (const input of rsnInputs) {
    const date = new Date(input.transactionId.timestamp);
    const week = `${date.getFullYear()}-${getWeek(date)}`;

    if (!weeklyInflows[week]) {
      weeklyInflows[week] = 0;
    }

    weeklyInflows[week] += input.amount;
  }

  for (const week in weeklyInflows) {
    console.log(`Week ${week}: ${weeklyInflows[week]}`);
  }
}

function getWeek(date: Date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
}

main();