"use client";

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
    <div className="p-6 bg-white rounded-2xl shadow-lg space-y-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800">Transaction History</h3>
      <ul className="divide-y divide-gray-100">
        {mockTransactions.map((tx) => (
          <li
            key={tx.id}
            className="py-4 flex justify-between items-center transition hover:bg-gray-50 px-2 rounded-md"
          >
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
