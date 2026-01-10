# Crypto Investment Platform

## Deposit Flow
1. User connects wallet and views the platform's deposit address.
2. User sends crypto to the deposit address on-chain.
3. Backend monitors the blockchain for incoming transactions to the deposit address.
4. Once confirmed, the backend credits the user's available balance.

## Withdrawal Flow
1. User submits a withdrawal request via the dashboard.
2. Internal available balance is deducted.
3. Admin reviews the request in the Admin Panel.
4. Upon approval, Admin manually signs and broadcasts the transaction.
5. Transaction hash is recorded, and the request is marked as completed.

## Security
- **Custodial Safety**: Funds are held in an EOA wallet controlled by the backend.
- **Manual Verification**: No automatic withdrawals to prevent automated drained-wallet attacks.
- **Internal Ledger**: Investment ROI and balances are managed via a secure internal ledger.
