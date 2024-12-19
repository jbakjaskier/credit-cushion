const supportedAccounts: SupportedAccount[] = [
  {
    accountId: "1504c7d2-11eb-4c37-b5b6-d83cd72eb735",
    loanProviderName: "MoonRiver Lake Bank",
  }, 
];

type SupportedAccount = {
  accountId: string;
  loanProviderName: string;
};

export default function getSupportedAccountInfo(
  accountId: string
): SupportedAccount | undefined {
  return supportedAccounts.find((x) => x.accountId === accountId);
}
