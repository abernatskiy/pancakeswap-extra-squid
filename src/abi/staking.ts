import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './staking.abi'

export const abi = new ethers.utils.Interface(ABI_JSON);

export const events = {
    AddPool: new LogEvent<([pid: ethers.BigNumber, allocPoint: ethers.BigNumber, lpToken: string, isRegular: boolean] & {pid: ethers.BigNumber, allocPoint: ethers.BigNumber, lpToken: string, isRegular: boolean})>(
        abi, '0x18caa0724a26384928efe604ae6ddc99c242548876259770fc88fcb7e719d8fa'
    ),
    Deposit: new LogEvent<([user: string, pid: ethers.BigNumber, amount: ethers.BigNumber] & {user: string, pid: ethers.BigNumber, amount: ethers.BigNumber})>(
        abi, '0x90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15'
    ),
    EmergencyWithdraw: new LogEvent<([user: string, pid: ethers.BigNumber, amount: ethers.BigNumber] & {user: string, pid: ethers.BigNumber, amount: ethers.BigNumber})>(
        abi, '0xbb757047c2b5f3974fe26b7c10f732e7bce710b0952a71082702781e62ae0595'
    ),
    Init: new LogEvent<[]>(
        abi, '0x57a86f7d14ccde89e22870afe839e3011216827daa9b24e18629f0a1e9d6cc14'
    ),
    OwnershipTransferred: new LogEvent<([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})>(
        abi, '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0'
    ),
    SetPool: new LogEvent<([pid: ethers.BigNumber, allocPoint: ethers.BigNumber] & {pid: ethers.BigNumber, allocPoint: ethers.BigNumber})>(
        abi, '0xc0cfd54d2de2b55f1e6e108d3ec53ff0a1abe6055401d32c61e9433b747ef9f8'
    ),
    UpdateBoostContract: new LogEvent<([boostContract: string] & {boostContract: string})>(
        abi, '0x4c0c07d0b548b824a1b998eb4d11fccf1cfbc1e47edcdb309970ba88315eb303'
    ),
    UpdateBoostMultiplier: new LogEvent<([user: string, pid: ethers.BigNumber, oldMultiplier: ethers.BigNumber, newMultiplier: ethers.BigNumber] & {user: string, pid: ethers.BigNumber, oldMultiplier: ethers.BigNumber, newMultiplier: ethers.BigNumber})>(
        abi, '0x01abd62439b64f6c5dab6f94d56099495bd0c094f9c21f98f4d3562a21edb4ba'
    ),
    UpdateBurnAdmin: new LogEvent<([oldAdmin: string, newAdmin: string] & {oldAdmin: string, newAdmin: string})>(
        abi, '0xd146fe330fdddf682413850a35b28edfccd4c4b53cfee802fd24950de5be1dbe'
    ),
    UpdateCakeRate: new LogEvent<([burnRate: ethers.BigNumber, regularFarmRate: ethers.BigNumber, specialFarmRate: ethers.BigNumber] & {burnRate: ethers.BigNumber, regularFarmRate: ethers.BigNumber, specialFarmRate: ethers.BigNumber})>(
        abi, '0xae2d2e7d1ae84564fc72227253ce0f36a007209f7fd5ec414dea80e5af2fb5b0'
    ),
    UpdatePool: new LogEvent<([pid: ethers.BigNumber, lastRewardBlock: ethers.BigNumber, lpSupply: ethers.BigNumber, accCakePerShare: ethers.BigNumber] & {pid: ethers.BigNumber, lastRewardBlock: ethers.BigNumber, lpSupply: ethers.BigNumber, accCakePerShare: ethers.BigNumber})>(
        abi, '0x3be3541fc42237d611b30329040bfa4569541d156560acdbbae57640d20b8f46'
    ),
    UpdateWhiteList: new LogEvent<([user: string, isValid: boolean] & {user: string, isValid: boolean})>(
        abi, '0xc551bbb22d0406dbfb8b6b7740cc521bcf44e1106029cf899c19b6a8e4c99d51'
    ),
    Withdraw: new LogEvent<([user: string, pid: ethers.BigNumber, amount: ethers.BigNumber] & {user: string, pid: ethers.BigNumber, amount: ethers.BigNumber})>(
        abi, '0xf279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b568'
    ),
}

export const functions = {
    ACC_CAKE_PRECISION: new Func<[], {}, ethers.BigNumber>(
        abi, '0x7398b7ea'
    ),
    BOOST_PRECISION: new Func<[], {}, ethers.BigNumber>(
        abi, '0xcc6db2da'
    ),
    CAKE: new Func<[], {}, string>(
        abi, '0x4ca6ef28'
    ),
    CAKE_RATE_TOTAL_PRECISION: new Func<[], {}, ethers.BigNumber>(
        abi, '0xe39e1323'
    ),
    MASTERCHEF_CAKE_PER_BLOCK: new Func<[], {}, ethers.BigNumber>(
        abi, '0x39aae5ba'
    ),
    MASTER_CHEF: new Func<[], {}, string>(
        abi, '0xedd8b170'
    ),
    MASTER_PID: new Func<[], {}, ethers.BigNumber>(
        abi, '0x61621aaa'
    ),
    MAX_BOOST_PRECISION: new Func<[], {}, ethers.BigNumber>(
        abi, '0x69b02128'
    ),
    add: new Func<[_allocPoint: ethers.BigNumber, _lpToken: string, _isRegular: boolean, _withUpdate: boolean], {_allocPoint: ethers.BigNumber, _lpToken: string, _isRegular: boolean, _withUpdate: boolean}, []>(
        abi, '0xc507aeaa'
    ),
    boostContract: new Func<[], {}, string>(
        abi, '0xdfcedeee'
    ),
    burnAdmin: new Func<[], {}, string>(
        abi, '0x81bdf98c'
    ),
    burnCake: new Func<[_withUpdate: boolean], {_withUpdate: boolean}, []>(
        abi, '0x777a97f8'
    ),
    cakePerBlock: new Func<[_isRegular: boolean], {_isRegular: boolean}, ethers.BigNumber>(
        abi, '0x1e9b828b'
    ),
    cakePerBlockToBurn: new Func<[], {}, ethers.BigNumber>(
        abi, '0x9dcc1b5f'
    ),
    cakeRateToBurn: new Func<[], {}, ethers.BigNumber>(
        abi, '0xe0f91f6c'
    ),
    cakeRateToRegularFarm: new Func<[], {}, ethers.BigNumber>(
        abi, '0xaa47bc8e'
    ),
    cakeRateToSpecialFarm: new Func<[], {}, ethers.BigNumber>(
        abi, '0x1ce06d57'
    ),
    deposit: new Func<[_pid: ethers.BigNumber, _amount: ethers.BigNumber], {_pid: ethers.BigNumber, _amount: ethers.BigNumber}, []>(
        abi, '0xe2bbb158'
    ),
    emergencyWithdraw: new Func<[_pid: ethers.BigNumber], {_pid: ethers.BigNumber}, []>(
        abi, '0x5312ea8e'
    ),
    getBoostMultiplier: new Func<[_user: string, _pid: ethers.BigNumber], {_user: string, _pid: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0x033186e8'
    ),
    harvestFromMasterChef: new Func<[], {}, []>(
        abi, '0x4f70b15a'
    ),
    init: new Func<[dummyToken: string], {dummyToken: string}, []>(
        abi, '0x19ab453c'
    ),
    lastBurnedBlock: new Func<[], {}, ethers.BigNumber>(
        abi, '0x78db4c34'
    ),
    lpToken: new Func<[_: ethers.BigNumber], {}, string>(
        abi, '0x78ed5d1f'
    ),
    massUpdatePools: new Func<[], {}, []>(
        abi, '0x630b5ba1'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    pendingCake: new Func<[_pid: ethers.BigNumber, _user: string], {_pid: ethers.BigNumber, _user: string}, ethers.BigNumber>(
        abi, '0x1175a1dd'
    ),
    poolInfo: new Func<[_: ethers.BigNumber], {}, ([accCakePerShare: ethers.BigNumber, lastRewardBlock: ethers.BigNumber, allocPoint: ethers.BigNumber, totalBoostedShare: ethers.BigNumber, isRegular: boolean] & {accCakePerShare: ethers.BigNumber, lastRewardBlock: ethers.BigNumber, allocPoint: ethers.BigNumber, totalBoostedShare: ethers.BigNumber, isRegular: boolean})>(
        abi, '0x1526fe27'
    ),
    poolLength: new Func<[], {}, ethers.BigNumber>(
        abi, '0x081e3eda'
    ),
    renounceOwnership: new Func<[], {}, []>(
        abi, '0x715018a6'
    ),
    set: new Func<[_pid: ethers.BigNumber, _allocPoint: ethers.BigNumber, _withUpdate: boolean], {_pid: ethers.BigNumber, _allocPoint: ethers.BigNumber, _withUpdate: boolean}, []>(
        abi, '0x64482f79'
    ),
    totalRegularAllocPoint: new Func<[], {}, ethers.BigNumber>(
        abi, '0xc40d337b'
    ),
    totalSpecialAllocPoint: new Func<[], {}, ethers.BigNumber>(
        abi, '0x99d7e84a'
    ),
    transferOwnership: new Func<[newOwner: string], {newOwner: string}, []>(
        abi, '0xf2fde38b'
    ),
    updateBoostContract: new Func<[_newBoostContract: string], {_newBoostContract: string}, []>(
        abi, '0x9dd2fcc3'
    ),
    updateBoostMultiplier: new Func<[_user: string, _pid: ethers.BigNumber, _newMultiplier: ethers.BigNumber], {_user: string, _pid: ethers.BigNumber, _newMultiplier: ethers.BigNumber}, []>(
        abi, '0x041a84c9'
    ),
    updateBurnAdmin: new Func<[_newAdmin: string], {_newAdmin: string}, []>(
        abi, '0x0bb844bc'
    ),
    updateCakeRate: new Func<[_burnRate: ethers.BigNumber, _regularFarmRate: ethers.BigNumber, _specialFarmRate: ethers.BigNumber, _withUpdate: boolean], {_burnRate: ethers.BigNumber, _regularFarmRate: ethers.BigNumber, _specialFarmRate: ethers.BigNumber, _withUpdate: boolean}, []>(
        abi, '0xdc6363df'
    ),
    updatePool: new Func<[_pid: ethers.BigNumber], {_pid: ethers.BigNumber}, ([accCakePerShare: ethers.BigNumber, lastRewardBlock: ethers.BigNumber, allocPoint: ethers.BigNumber, totalBoostedShare: ethers.BigNumber, isRegular: boolean] & {accCakePerShare: ethers.BigNumber, lastRewardBlock: ethers.BigNumber, allocPoint: ethers.BigNumber, totalBoostedShare: ethers.BigNumber, isRegular: boolean})>(
        abi, '0x51eb05a6'
    ),
    updateWhiteList: new Func<[_user: string, _isValid: boolean], {_user: string, _isValid: boolean}, []>(
        abi, '0xac1d0609'
    ),
    userInfo: new Func<[_: ethers.BigNumber, _: string], {}, ([amount: ethers.BigNumber, rewardDebt: ethers.BigNumber, boostMultiplier: ethers.BigNumber] & {amount: ethers.BigNumber, rewardDebt: ethers.BigNumber, boostMultiplier: ethers.BigNumber})>(
        abi, '0x93f1a40b'
    ),
    whiteList: new Func<[_: string], {}, boolean>(
        abi, '0x372c12b1'
    ),
    withdraw: new Func<[_pid: ethers.BigNumber, _amount: ethers.BigNumber], {_pid: ethers.BigNumber, _amount: ethers.BigNumber}, []>(
        abi, '0x441a3e70'
    ),
}

export class Contract extends ContractBase {

    ACC_CAKE_PRECISION(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.ACC_CAKE_PRECISION, [])
    }

    BOOST_PRECISION(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.BOOST_PRECISION, [])
    }

    CAKE(): Promise<string> {
        return this.eth_call(functions.CAKE, [])
    }

    CAKE_RATE_TOTAL_PRECISION(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.CAKE_RATE_TOTAL_PRECISION, [])
    }

    MASTERCHEF_CAKE_PER_BLOCK(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.MASTERCHEF_CAKE_PER_BLOCK, [])
    }

    MASTER_CHEF(): Promise<string> {
        return this.eth_call(functions.MASTER_CHEF, [])
    }

    MASTER_PID(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.MASTER_PID, [])
    }

    MAX_BOOST_PRECISION(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.MAX_BOOST_PRECISION, [])
    }

    boostContract(): Promise<string> {
        return this.eth_call(functions.boostContract, [])
    }

    burnAdmin(): Promise<string> {
        return this.eth_call(functions.burnAdmin, [])
    }

    cakePerBlock(_isRegular: boolean): Promise<ethers.BigNumber> {
        return this.eth_call(functions.cakePerBlock, [_isRegular])
    }

    cakePerBlockToBurn(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.cakePerBlockToBurn, [])
    }

    cakeRateToBurn(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.cakeRateToBurn, [])
    }

    cakeRateToRegularFarm(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.cakeRateToRegularFarm, [])
    }

    cakeRateToSpecialFarm(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.cakeRateToSpecialFarm, [])
    }

    getBoostMultiplier(_user: string, _pid: ethers.BigNumber): Promise<ethers.BigNumber> {
        return this.eth_call(functions.getBoostMultiplier, [_user, _pid])
    }

    lastBurnedBlock(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.lastBurnedBlock, [])
    }

    lpToken(arg0: ethers.BigNumber): Promise<string> {
        return this.eth_call(functions.lpToken, [arg0])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    pendingCake(_pid: ethers.BigNumber, _user: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.pendingCake, [_pid, _user])
    }

    poolInfo(arg0: ethers.BigNumber): Promise<([accCakePerShare: ethers.BigNumber, lastRewardBlock: ethers.BigNumber, allocPoint: ethers.BigNumber, totalBoostedShare: ethers.BigNumber, isRegular: boolean] & {accCakePerShare: ethers.BigNumber, lastRewardBlock: ethers.BigNumber, allocPoint: ethers.BigNumber, totalBoostedShare: ethers.BigNumber, isRegular: boolean})> {
        return this.eth_call(functions.poolInfo, [arg0])
    }

    poolLength(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.poolLength, [])
    }

    totalRegularAllocPoint(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.totalRegularAllocPoint, [])
    }

    totalSpecialAllocPoint(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.totalSpecialAllocPoint, [])
    }

    userInfo(arg0: ethers.BigNumber, arg1: string): Promise<([amount: ethers.BigNumber, rewardDebt: ethers.BigNumber, boostMultiplier: ethers.BigNumber] & {amount: ethers.BigNumber, rewardDebt: ethers.BigNumber, boostMultiplier: ethers.BigNumber})> {
        return this.eth_call(functions.userInfo, [arg0, arg1])
    }

    whiteList(arg0: string): Promise<boolean> {
        return this.eth_call(functions.whiteList, [arg0])
    }
}
