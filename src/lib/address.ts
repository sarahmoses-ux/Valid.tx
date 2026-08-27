export const MOCK_ADDRESS = '0x71F2b93C8A4e2Fc9D71b3Ea56F0Cc9b8AA1E92A8'

export function truncateAddress(address: string, front = 4, back = 4): string {
  if (address.length <= front + back + 2) return address
  return `${address.slice(0, 2 + front)}...${address.slice(-back)}`
}
