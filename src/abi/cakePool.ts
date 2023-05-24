import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './cakePool.abi'

export const abi = new ethers.utils.Interface(ABI_JSON);

export const events = {
    Deposit: new LogEvent<([sender: string, amount: ethers.BigNumber, shares: ethers.BigNumber, duration: ethers.BigNumber, lastDepositedTime: ethers.BigNumber] & {sender: string, amount: ethers.BigNumber, shares: ethers.BigNumber, duration: ethers.BigNumber, lastDepositedTime: ethers.BigNumber})>(
        abi, '0x7162984403f6c73c8639375d45a9187dfd04602231bd8e587c415718b5f7e5f9'
    ),
    FreeFeeUser: new LogEvent<([user: string, free: boolean] & {user: string, free: boolean})>(
        abi, '0x3d7902bc9a6665bd7caf4240b834bb805d3cd68256889e9f8d2e40a10be41d44'
    ),
    Harvest: new LogEvent<([sender: string, amount: ethers.BigNumber] & {sender: string, amount: ethers.BigNumber})>(
        abi, '0xc9695243a805adb74c91f28311176c65b417e842d5699893cef56d18bfa48cba'
    ),
    Init: new LogEvent<[]>(
        abi, '0x57a86f7d14ccde89e22870afe839e3011216827daa9b24e18629f0a1e9d6cc14'
    ),
    Lock: new LogEvent<([sender: string, lockedAmount: ethers.BigNumber, shares: ethers.BigNumber, lockedDuration: ethers.BigNumber, blockTimestamp: ethers.BigNumber] & {sender: string, lockedAmount: ethers.BigNumber, shares: ethers.BigNumber, lockedDuration: ethers.BigNumber, blockTimestamp: ethers.BigNumber})>(
        abi, '0x2b943276e5d747f6f7dd46d3b880d8874cb8d6b9b88ca1903990a2738e7dc7a1'
    ),
    NewAdmin: new LogEvent<([admin: string] & {admin: string})>(
        abi, '0x71614071b88dee5e0b2ae578a9dd7b2ebbe9ae832ba419dc0242cd065a290b6c'
    ),
    NewBoostContract: new LogEvent<([boostContract: string] & {boostContract: string})>(
        abi, '0x8f49a182922022d9119a1a6aeeca151b4a5665e86bd61c1ff32e152d459558b2'
    ),
    NewBoostWeight: new LogEvent<([boostWeight: ethers.BigNumber] & {boostWeight: ethers.BigNumber})>(
        abi, '0x7666dfff8c3377938e522b4eed3aff079973a976f95969db60a406d49f40da4e'
    ),
    NewDurationFactor: new LogEvent<([durationFactor: ethers.BigNumber] & {durationFactor: ethers.BigNumber})>(
        abi, '0x9478eb023aac0a7d58a4e935377056bf27cf5b72a2300725f831817a8f62fbde'
    ),
    NewDurationFactorOverdue: new LogEvent<([durationFactorOverdue: ethers.BigNumber] & {durationFactorOverdue: ethers.BigNumber})>(
        abi, '0x18b6d179114082d7eda9837e15a39eb30032d5f3df00487a67541398f48fabfe'
    ),
    NewMaxLockDuration: new LogEvent<([maxLockDuration: ethers.BigNumber] & {maxLockDuration: ethers.BigNumber})>(
        abi, '0xcab2f3455b51b6ca5377e84fccd0f890b6f6ca36c02e18b6d36cb34f469fe4fe'
    ),
    NewOperator: new LogEvent<([operator: string] & {operator: string})>(
        abi, '0xda12ee837e6978172aaf54b16145ffe08414fd8710092ef033c71b8eb6ec189a'
    ),
    NewOverdueFee: new LogEvent<([overdueFee: ethers.BigNumber] & {overdueFee: ethers.BigNumber})>(
        abi, '0xf4bd1c5978320077e792afbb3911e8cab1325ce28a6b3e67f9067a1d80692961'
    ),
    NewPerformanceFee: new LogEvent<([performanceFee: ethers.BigNumber] & {performanceFee: ethers.BigNumber})>(
        abi, '0xefeafcf03e479a9566d7ef321b4816de0ba19cfa3cd0fae2f8c5f4a0afb342c4'
    ),
    NewPerformanceFeeContract: new LogEvent<([performanceFeeContract: ethers.BigNumber] & {performanceFeeContract: ethers.BigNumber})>(
        abi, '0xc5d25457b67b87678c987375af13f6e50beb3ad7bfd009da26766ae986eaa20d'
    ),
    NewTreasury: new LogEvent<([treasury: string] & {treasury: string})>(
        abi, '0xafa147634b29e2c7bd53ce194256b9f41cfb9ba3036f2b822fdd1d965beea086'
    ),
    NewUnlockFreeDuration: new LogEvent<([unlockFreeDuration: ethers.BigNumber] & {unlockFreeDuration: ethers.BigNumber})>(
        abi, '0xf84bf2b901cfc02956d4e69556d7448cef4ea13587e7714dba7c6d697091e7ad'
    ),
    NewVCakeContract: new LogEvent<([VCake: string] & {VCake: string})>(
        abi, '0x5352e27b0414343d9438a1c6e9d04c65c7cb4d91f44920afee588f91717893f1'
    ),
    NewWithdrawFee: new LogEvent<([withdrawFee: ethers.BigNumber] & {withdrawFee: ethers.BigNumber})>(
        abi, '0xd5fe46099fa396290a7f57e36c3c3c8774e2562c18ed5d1dcc0fa75071e03f1d'
    ),
    NewWithdrawFeeContract: new LogEvent<([withdrawFeeContract: ethers.BigNumber] & {withdrawFeeContract: ethers.BigNumber})>(
        abi, '0xcab352e118188b8a2f20a2e8c4ce1241ce2c1740aac4f17c5b0831e65824d8ef'
    ),
    NewWithdrawFeePeriod: new LogEvent<([withdrawFeePeriod: ethers.BigNumber] & {withdrawFeePeriod: ethers.BigNumber})>(
        abi, '0xb89ddaddb7435be26824cb48d2d0186c9525a2e1ec057abcb502704cdc0686cc'
    ),
    OwnershipTransferred: new LogEvent<([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})>(
        abi, '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0'
    ),
    Pause: new LogEvent<[]>(
        abi, '0x6985a02210a168e66602d3235cb6db0e70f92b3ba4d376a33c0f3d9434bff625'
    ),
    Paused: new LogEvent<([account: string] & {account: string})>(
        abi, '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258'
    ),
    Unlock: new LogEvent<([sender: string, amount: ethers.BigNumber, blockTimestamp: ethers.BigNumber] & {sender: string, amount: ethers.BigNumber, blockTimestamp: ethers.BigNumber})>(
        abi, '0xf7870c5b224cbc19873599e46ccfc7103934650509b1af0c3ce90138377c2004'
    ),
    Unpause: new LogEvent<[]>(
        abi, '0x7805862f689e2f13df9f062ff482ad3ad112aca9e0847911ed832e158c525b33'
    ),
    Unpaused: new LogEvent<([account: string] & {account: string})>(
        abi, '0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa'
    ),
    Withdraw: new LogEvent<([sender: string, amount: ethers.BigNumber, shares: ethers.BigNumber] & {sender: string, amount: ethers.BigNumber, shares: ethers.BigNumber})>(
        abi, '0xf279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b568'
    ),
}

export const functions = {
    BOOST_WEIGHT: new Func<[], {}, ethers.BigNumber>(
        abi, '0xbc75f4b8'
    ),
    BOOST_WEIGHT_LIMIT: new Func<[], {}, ethers.BigNumber>(
        abi, '0xfd253b64'
    ),
    DURATION_FACTOR: new Func<[], {}, ethers.BigNumber>(
        abi, '0xe464c623'
    ),
    DURATION_FACTOR_OVERDUE: new Func<[], {}, ethers.BigNumber>(
        abi, '0xacaf88cd'
    ),
    MAX_LOCK_DURATION: new Func<[], {}, ethers.BigNumber>(
        abi, '0x4f1bfc9e'
    ),
    MAX_LOCK_DURATION_LIMIT: new Func<[], {}, ethers.BigNumber>(
        abi, '0x01e81326'
    ),
    MAX_OVERDUE_FEE: new Func<[], {}, ethers.BigNumber>(
        abi, '0x948a03f2'
    ),
    MAX_PERFORMANCE_FEE: new Func<[], {}, ethers.BigNumber>(
        abi, '0xbdca9165'
    ),
    MAX_WITHDRAW_FEE: new Func<[], {}, ethers.BigNumber>(
        abi, '0xd4b0de2f'
    ),
    MAX_WITHDRAW_FEE_PERIOD: new Func<[], {}, ethers.BigNumber>(
        abi, '0x2cfc5f01'
    ),
    MIN_DEPOSIT_AMOUNT: new Func<[], {}, ethers.BigNumber>(
        abi, '0x1ea30fef'
    ),
    MIN_LOCK_DURATION: new Func<[], {}, ethers.BigNumber>(
        abi, '0x78b4330f'
    ),
    MIN_WITHDRAW_AMOUNT: new Func<[], {}, ethers.BigNumber>(
        abi, '0xb6857844'
    ),
    PRECISION_FACTOR: new Func<[], {}, ethers.BigNumber>(
        abi, '0xccd34cd5'
    ),
    PRECISION_FACTOR_SHARE: new Func<[], {}, ethers.BigNumber>(
        abi, '0x731ff24a'
    ),
    UNLOCK_FREE_DURATION: new Func<[], {}, ethers.BigNumber>(
        abi, '0xaaada5da'
    ),
    VCake: new Func<[], {}, string>(
        abi, '0x2d19b982'
    ),
    admin: new Func<[], {}, string>(
        abi, '0xf851a440'
    ),
    available: new Func<[], {}, ethers.BigNumber>(
        abi, '0x48a0d754'
    ),
    balanceOf: new Func<[], {}, ethers.BigNumber>(
        abi, '0x722713f7'
    ),
    boostContract: new Func<[], {}, string>(
        abi, '0xdfcedeee'
    ),
    cakePoolPID: new Func<[], {}, ethers.BigNumber>(
        abi, '0x6d4710b9'
    ),
    calculateOverdueFee: new Func<[_user: string], {_user: string}, ethers.BigNumber>(
        abi, '0x95dc14e1'
    ),
    calculatePerformanceFee: new Func<[_user: string], {_user: string}, ethers.BigNumber>(
        abi, '0xc6ed51be'
    ),
    calculateTotalPendingCakeRewards: new Func<[], {}, ethers.BigNumber>(
        abi, '0x58ebceb6'
    ),
    calculateWithdrawFee: new Func<[_user: string, _shares: ethers.BigNumber], {_user: string, _shares: ethers.BigNumber}, ethers.BigNumber>(
        abi, '0x29a5cfd6'
    ),
    deposit: new Func<[_amount: ethers.BigNumber, _lockDuration: ethers.BigNumber], {_amount: ethers.BigNumber, _lockDuration: ethers.BigNumber}, []>(
        abi, '0xe2bbb158'
    ),
    freeOverdueFeeUsers: new Func<[_: string], {}, boolean>(
        abi, '0x668679ba'
    ),
    freePerformanceFeeUsers: new Func<[_: string], {}, boolean>(
        abi, '0x3fec4e32'
    ),
    freeWithdrawFeeUsers: new Func<[_: string], {}, boolean>(
        abi, '0x87d4bda9'
    ),
    getPricePerFullShare: new Func<[], {}, ethers.BigNumber>(
        abi, '0x77c7b8fc'
    ),
    inCaseTokensGetStuck: new Func<[_token: string], {_token: string}, []>(
        abi, '0xdef68a9c'
    ),
    init: new Func<[dummyToken: string], {dummyToken: string}, []>(
        abi, '0x19ab453c'
    ),
    masterchefV2: new Func<[], {}, string>(
        abi, '0xcb528b52'
    ),
    operator: new Func<[], {}, string>(
        abi, '0x570ca735'
    ),
    overdueFee: new Func<[], {}, ethers.BigNumber>(
        abi, '0xa5834e06'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    pause: new Func<[], {}, []>(
        abi, '0x8456cb59'
    ),
    paused: new Func<[], {}, boolean>(
        abi, '0x5c975abb'
    ),
    performanceFee: new Func<[], {}, ethers.BigNumber>(
        abi, '0x87788782'
    ),
    performanceFeeContract: new Func<[], {}, ethers.BigNumber>(
        abi, '0x3eb78874'
    ),
    renounceOwnership: new Func<[], {}, []>(
        abi, '0x715018a6'
    ),
    setAdmin: new Func<[_admin: string], {_admin: string}, []>(
        abi, '0x704b6c02'
    ),
    setBoostContract: new Func<[_boostContract: string], {_boostContract: string}, []>(
        abi, '0xdef7869d'
    ),
    setBoostWeight: new Func<[_boostWeight: ethers.BigNumber], {_boostWeight: ethers.BigNumber}, []>(
        abi, '0x93c99e6a'
    ),
    setDurationFactor: new Func<[_durationFactor: ethers.BigNumber], {_durationFactor: ethers.BigNumber}, []>(
        abi, '0xa3639b39'
    ),
    setDurationFactorOverdue: new Func<[_durationFactorOverdue: ethers.BigNumber], {_durationFactorOverdue: ethers.BigNumber}, []>(
        abi, '0x35981921'
    ),
    setFreePerformanceFeeUser: new Func<[_user: string, _free: boolean], {_user: string, _free: boolean}, []>(
        abi, '0x423b93ed'
    ),
    setMaxLockDuration: new Func<[_maxLockDuration: ethers.BigNumber], {_maxLockDuration: ethers.BigNumber}, []>(
        abi, '0xf786b958'
    ),
    setOperator: new Func<[_operator: string], {_operator: string}, []>(
        abi, '0xb3ab15fb'
    ),
    setOverdueFee: new Func<[_overdueFee: ethers.BigNumber], {_overdueFee: ethers.BigNumber}, []>(
        abi, '0x0c59696b'
    ),
    setOverdueFeeUser: new Func<[_user: string, _free: boolean], {_user: string, _free: boolean}, []>(
        abi, '0x4e4de1e9'
    ),
    setPerformanceFee: new Func<[_performanceFee: ethers.BigNumber], {_performanceFee: ethers.BigNumber}, []>(
        abi, '0x70897b23'
    ),
    setPerformanceFeeContract: new Func<[_performanceFeeContract: ethers.BigNumber], {_performanceFeeContract: ethers.BigNumber}, []>(
        abi, '0xbb9f408d'
    ),
    setTreasury: new Func<[_treasury: string], {_treasury: string}, []>(
        abi, '0xf0f44260'
    ),
    setUnlockFreeDuration: new Func<[_unlockFreeDuration: ethers.BigNumber], {_unlockFreeDuration: ethers.BigNumber}, []>(
        abi, '0xc54d349c'
    ),
    setVCakeContract: new Func<[_VCake: string], {_VCake: string}, []>(
        abi, '0xd826ed06'
    ),
    setWithdrawFee: new Func<[_withdrawFee: ethers.BigNumber], {_withdrawFee: ethers.BigNumber}, []>(
        abi, '0xb6ac642a'
    ),
    setWithdrawFeeContract: new Func<[_withdrawFeeContract: ethers.BigNumber], {_withdrawFeeContract: ethers.BigNumber}, []>(
        abi, '0x14ff3039'
    ),
    setWithdrawFeePeriod: new Func<[_withdrawFeePeriod: ethers.BigNumber], {_withdrawFeePeriod: ethers.BigNumber}, []>(
        abi, '0x1efac1b8'
    ),
    setWithdrawFeeUser: new Func<[_user: string, _free: boolean], {_user: string, _free: boolean}, []>(
        abi, '0xbeba0fa0'
    ),
    token: new Func<[], {}, string>(
        abi, '0xfc0c546a'
    ),
    totalBoostDebt: new Func<[], {}, ethers.BigNumber>(
        abi, '0xe73008bc'
    ),
    totalLockedAmount: new Func<[], {}, ethers.BigNumber>(
        abi, '0x05a9f274'
    ),
    totalShares: new Func<[], {}, ethers.BigNumber>(
        abi, '0x3a98ef39'
    ),
    transferOwnership: new Func<[newOwner: string], {newOwner: string}, []>(
        abi, '0xf2fde38b'
    ),
    treasury: new Func<[], {}, string>(
        abi, '0x61d027b3'
    ),
    unlock: new Func<[_user: string], {_user: string}, []>(
        abi, '0x2f6c493c'
    ),
    unpause: new Func<[], {}, []>(
        abi, '0x3f4ba83a'
    ),
    userInfo: new Func<[_: string], {}, ([shares: ethers.BigNumber, lastDepositedTime: ethers.BigNumber, cakeAtLastUserAction: ethers.BigNumber, lastUserActionTime: ethers.BigNumber, lockStartTime: ethers.BigNumber, lockEndTime: ethers.BigNumber, userBoostedShare: ethers.BigNumber, locked: boolean, lockedAmount: ethers.BigNumber] & {shares: ethers.BigNumber, lastDepositedTime: ethers.BigNumber, cakeAtLastUserAction: ethers.BigNumber, lastUserActionTime: ethers.BigNumber, lockStartTime: ethers.BigNumber, lockEndTime: ethers.BigNumber, userBoostedShare: ethers.BigNumber, locked: boolean, lockedAmount: ethers.BigNumber})>(
        abi, '0x1959a002'
    ),
    withdraw: new Func<[_shares: ethers.BigNumber], {_shares: ethers.BigNumber}, []>(
        abi, '0x2e1a7d4d'
    ),
    withdrawAll: new Func<[], {}, []>(
        abi, '0x853828b6'
    ),
    withdrawByAmount: new Func<[_amount: ethers.BigNumber], {_amount: ethers.BigNumber}, []>(
        abi, '0x5521e9bf'
    ),
    withdrawFee: new Func<[], {}, ethers.BigNumber>(
        abi, '0xe941fa78'
    ),
    withdrawFeeContract: new Func<[], {}, ethers.BigNumber>(
        abi, '0xe4b37ef5'
    ),
    withdrawFeePeriod: new Func<[], {}, ethers.BigNumber>(
        abi, '0xdf10b4e6'
    ),
}

export class Contract extends ContractBase {

    BOOST_WEIGHT(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.BOOST_WEIGHT, [])
    }

    BOOST_WEIGHT_LIMIT(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.BOOST_WEIGHT_LIMIT, [])
    }

    DURATION_FACTOR(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.DURATION_FACTOR, [])
    }

    DURATION_FACTOR_OVERDUE(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.DURATION_FACTOR_OVERDUE, [])
    }

    MAX_LOCK_DURATION(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.MAX_LOCK_DURATION, [])
    }

    MAX_LOCK_DURATION_LIMIT(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.MAX_LOCK_DURATION_LIMIT, [])
    }

    MAX_OVERDUE_FEE(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.MAX_OVERDUE_FEE, [])
    }

    MAX_PERFORMANCE_FEE(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.MAX_PERFORMANCE_FEE, [])
    }

    MAX_WITHDRAW_FEE(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.MAX_WITHDRAW_FEE, [])
    }

    MAX_WITHDRAW_FEE_PERIOD(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.MAX_WITHDRAW_FEE_PERIOD, [])
    }

    MIN_DEPOSIT_AMOUNT(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.MIN_DEPOSIT_AMOUNT, [])
    }

    MIN_LOCK_DURATION(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.MIN_LOCK_DURATION, [])
    }

    MIN_WITHDRAW_AMOUNT(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.MIN_WITHDRAW_AMOUNT, [])
    }

    PRECISION_FACTOR(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.PRECISION_FACTOR, [])
    }

    PRECISION_FACTOR_SHARE(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.PRECISION_FACTOR_SHARE, [])
    }

    UNLOCK_FREE_DURATION(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.UNLOCK_FREE_DURATION, [])
    }

    VCake(): Promise<string> {
        return this.eth_call(functions.VCake, [])
    }

    admin(): Promise<string> {
        return this.eth_call(functions.admin, [])
    }

    available(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.available, [])
    }

    balanceOf(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.balanceOf, [])
    }

    boostContract(): Promise<string> {
        return this.eth_call(functions.boostContract, [])
    }

    cakePoolPID(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.cakePoolPID, [])
    }

    calculateOverdueFee(_user: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.calculateOverdueFee, [_user])
    }

    calculatePerformanceFee(_user: string): Promise<ethers.BigNumber> {
        return this.eth_call(functions.calculatePerformanceFee, [_user])
    }

    calculateTotalPendingCakeRewards(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.calculateTotalPendingCakeRewards, [])
    }

    calculateWithdrawFee(_user: string, _shares: ethers.BigNumber): Promise<ethers.BigNumber> {
        return this.eth_call(functions.calculateWithdrawFee, [_user, _shares])
    }

    freeOverdueFeeUsers(arg0: string): Promise<boolean> {
        return this.eth_call(functions.freeOverdueFeeUsers, [arg0])
    }

    freePerformanceFeeUsers(arg0: string): Promise<boolean> {
        return this.eth_call(functions.freePerformanceFeeUsers, [arg0])
    }

    freeWithdrawFeeUsers(arg0: string): Promise<boolean> {
        return this.eth_call(functions.freeWithdrawFeeUsers, [arg0])
    }

    getPricePerFullShare(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.getPricePerFullShare, [])
    }

    masterchefV2(): Promise<string> {
        return this.eth_call(functions.masterchefV2, [])
    }

    operator(): Promise<string> {
        return this.eth_call(functions.operator, [])
    }

    overdueFee(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.overdueFee, [])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    paused(): Promise<boolean> {
        return this.eth_call(functions.paused, [])
    }

    performanceFee(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.performanceFee, [])
    }

    performanceFeeContract(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.performanceFeeContract, [])
    }

    token(): Promise<string> {
        return this.eth_call(functions.token, [])
    }

    totalBoostDebt(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.totalBoostDebt, [])
    }

    totalLockedAmount(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.totalLockedAmount, [])
    }

    totalShares(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.totalShares, [])
    }

    treasury(): Promise<string> {
        return this.eth_call(functions.treasury, [])
    }

    userInfo(arg0: string): Promise<([shares: ethers.BigNumber, lastDepositedTime: ethers.BigNumber, cakeAtLastUserAction: ethers.BigNumber, lastUserActionTime: ethers.BigNumber, lockStartTime: ethers.BigNumber, lockEndTime: ethers.BigNumber, userBoostedShare: ethers.BigNumber, locked: boolean, lockedAmount: ethers.BigNumber] & {shares: ethers.BigNumber, lastDepositedTime: ethers.BigNumber, cakeAtLastUserAction: ethers.BigNumber, lastUserActionTime: ethers.BigNumber, lockStartTime: ethers.BigNumber, lockEndTime: ethers.BigNumber, userBoostedShare: ethers.BigNumber, locked: boolean, lockedAmount: ethers.BigNumber})> {
        return this.eth_call(functions.userInfo, [arg0])
    }

    withdrawFee(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.withdrawFee, [])
    }

    withdrawFeeContract(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.withdrawFeeContract, [])
    }

    withdrawFeePeriod(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.withdrawFeePeriod, [])
    }
}
