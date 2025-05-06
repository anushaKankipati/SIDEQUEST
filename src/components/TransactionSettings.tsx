// components/Transactions.tsx

interface TransactionSettings {
    id: string;
    questName: string;
    date: string;
    amount: string;
  }
  
  const mockTransactions: TransactionSettings[] = [
    {
      id: "1",
      questName: "Fix bug in homework helper app",
      date: "2025-04-20 14:22",
      amount: "$15.00",
    },
    {
      id: "2",
      questName: "Design profile badge for leaderboard",
      date: "2025-04-22 09:15",
      amount: "$25.00",
    },
  ];
  
  export default function TransactionSettings() {
    return (
      <div className="p-6 bg-gray-100 rounded-2xl space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
        <ul className="divide-y divide-gray-300">
          {mockTransactions.map((tx) => (
            <li key={tx.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="text-gray-900 font-medium">{tx.questName}</p>
                <p className="text-gray-500 text-sm">{tx.date}</p>
              </div>
              <span className="text-green-600 font-semibold">{tx.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  