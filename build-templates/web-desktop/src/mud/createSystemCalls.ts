import { getComponentValue,getComponentValueStrict, Has, Not  } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { singletonEntity } from "@latticexyz/store-sync/recs";


export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldContract, waitForTransaction }: SetupNetworkResult,
  { Counter,GameState,Game,IsPlayer,Player,AssetsList }: ClientComponents
) {
  const increment = async () => {
    const tx = await worldContract.write.increment();
    await waitForTransaction(tx);
    return getComponentValue(Counter, singletonEntity);
  };
  const joinGame = async () => {
    const tx = await worldContract.write.joinGame();
    await waitForTransaction(tx);
    return getComponentValue(IsPlayer, singletonEntity);
  };
  const askStart = async () => {
    const tx = await worldContract.write.askStart();
    await waitForTransaction(tx);
    return getComponentValue(GameState, singletonEntity);
  };

  const move = async (x:number,y:number) => {
    // const tx = await worldSend("move", [x, y]);
    const tx = await worldContract.write.move([x,y]);
    await waitForTransaction(tx);
    return getComponentValue(Player, singletonEntity);
  };

  const pickAsset = async (assetType:number) => {
    const tx = await worldContract.write.pickAsset([assetType]);
    await waitForTransaction(tx);
    return getComponentValue(AssetsList, singletonEntity);
  };

  const pickFund = async () => {
    const tx = await worldContract.write.pickFund();
    await waitForTransaction(tx);
  };

  const trade = async (targetPlayer:string,assetType:number,money:number) => {
    const tx = await worldContract.write.trade([targetPlayer,assetType,money]);
    return await waitForTransaction(tx);
  };

  const acceptTrade = async () => {
    const tx = await worldContract.write.acceptTrade();
    return await waitForTransaction(tx);
  };

  const rejectTrade = async () => {
    const tx = await worldContract.write.rejectTrade();
    return await waitForTransaction(tx);
  };

  const finishGame = async () => {
    const tx = await worldContract.write.finishGame();
    return await waitForTransaction(tx);
  };

  return {
    increment,
    joinGame,
    askStart,
    move,
    pickAsset,
    pickFund,
    trade,
    acceptTrade,
    rejectTrade,
    finishGame
  };
}
