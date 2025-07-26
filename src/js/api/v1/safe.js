import fetch from "@/js/api/fetch";

export const getAssets = async (chainId, address) => {
  const res = await fetch({
    url: `/v1/chains/${chainId}/safes/${address}/balances/usd?trusted=true`,
    method: "get",
  });
  return res;
};
