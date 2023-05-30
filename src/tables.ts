import {
    Table,
    Column,
    Types
} from '@subsquid/file-store-parquet'

type AmountType = string

function amountColumn() {
    return Column(Types.String())
}

function commonTransactionFields() {
    return {
        block: Column(Types.Uint32()),
        timestamp: Column(Types.Timestamp()),
        hash: Column(Types.String()),
        txFrom: Column(Types.String()),
        txTo: Column(Types.String())
    }
}

export interface BaseTransactionData {
    block: number
    timestamp: Date
    hash: string
    txFrom: string
    txTo: string
}

function commonEventFields() {
    return {
        block: Column(Types.Uint32()),
        timestamp: Column(Types.Timestamp()),
        eventAddress: Column(Types.String()),
        parentTransactionHash: Column(Types.String())
    }
}

export interface BaseEventData {
    block: number
    timestamp: Date
    eventAddress: string
    parentTransactionHash: string
}

/****************** TX STRUCTURES ******************/

export interface RouterRemoveLiquidityWithPermitTransactionData extends BaseTransactionData {
    tokenA: string
    tokenB: string
    liquidity: AmountType
    amountAMin: AmountType
    amountBMin: AmountType
    to: string
    deadline: string
    approveMax: boolean
    v: number
    r: string
    s: string
}

const router_removeLiquidityWithPermit = new Table(
    'router.removeLiquidityWithPermit.parquet',
    {
        tokenA: Column(Types.String()),
        tokenB: Column(Types.String()),
        liquidity: amountColumn(),
        amountAMin: amountColumn(),
        amountBMin: amountColumn(),
        to: Column(Types.String()),
        deadline: Column(Types.String()),
        approveMax: Column(Types.Boolean()),
        v: Column(Types.Uint32()),
        r: Column(Types.String()),
        s: Column(Types.String()),
        ...commonTransactionFields()
    },
    {
	    compression: 'GZIP'
    }
)

export interface RouterAddLiquidityTransactionData extends BaseTransactionData {
    tokenA: string
    tokenB: string
    amountADesired: AmountType
    amountBDesired: AmountType
    amountAMin: AmountType
    amountBMin: AmountType
    to: string
    deadline: string
}

const router_addLiquidity = new Table(
    'router.addLiquidity.parquet',
    {
        tokenA: Column(Types.String()),
        tokenB: Column(Types.String()),
        amountADesired: amountColumn(),
        amountBDesired: amountColumn(),
        amountAMin: amountColumn(),
        amountBMin: amountColumn(),
        to: Column(Types.String()),
        deadline: Column(Types.String()),
        ...commonTransactionFields()
    },
    {
	    compression: 'GZIP'
    }
)

export interface StakingDepositTransactionData extends BaseTransactionData {
    pid: number
    amount: AmountType
}

const staking_deposit = new Table(
    'staking.deposit.parquet',
    {
        pid: Column(Types.Uint32()),
        amount: amountColumn(),
        ...commonTransactionFields()
    },
    {
	    compression: 'GZIP'
    }
)

export interface StakingWithdrawTransactionData extends BaseTransactionData {
    pid: number
    amount: AmountType
}

const staking_withdraw = new Table(
    'staking.withdraw.parquet',
    {
        pid: Column(Types.Uint32()),
        amount: amountColumn(),
        ...commonTransactionFields()
    },
    {
	    compression: 'GZIP'
    }
)

export interface CakePoolWithdrawAllTransactionData extends BaseTransactionData {}

const cakePool_withdrawAll = new Table(
    'cakePool.withdrawAll.parquet',
    {
        ...commonTransactionFields()
    },
    {
	    compression: 'GZIP'
    }
)

export interface CakePoolWithdrawByAmountTransactionData extends BaseTransactionData {
    amount: AmountType
}

const cakePool_withdrawByAmount = new Table(
    'cakePool.withdrawByAmount.parquet',
    {
        amount: amountColumn(),
        ...commonTransactionFields()
    },
    {
	    compression: 'GZIP'
    }
)

const unparseableTransactions = new Table(
    'unparseableTransactions.parquet',
    {
        input: Column(Types.String()),
        ...commonTransactionFields()
    },
    {
        compression: 'GZIP'
    }
)

/****************** EVENT STRUCTURES ******************/

export interface BurnEventData extends BaseEventData {
    sender: string
    amount0: AmountType
    amount1: AmountType
    to: string
}

const router_removeLiquidityWithPermit_Burn = new Table(
    'router.Burn.parquet',
    {
        sender: Column(Types.String()),
        amount0: amountColumn(),
        amount1: amountColumn(),
        to: Column(Types.String()),
        ...commonEventFields()
    },
    {
	    compression: 'GZIP'
    }
)

export interface MintEventData extends BaseEventData {
    sender: string
    amount0: AmountType
    amount1: AmountType
}

const router_addLiquidity_Mint = new Table(
    'router.Mint.parquet',
    {
        sender: Column(Types.String()),
        amount0: amountColumn(),
        amount1: amountColumn(),
        ...commonEventFields()
    },
    {
	    compression: 'GZIP'
    }
)

export interface DepositEventData extends BaseEventData {
    user: string
    pid: number
    amount: AmountType
}

const staking_deposit_Deposit = new Table(
    'staking.Deposit.parquet',
    {
        user: Column(Types.String()),
        pid: Column(Types.Uint32()),
        amount: amountColumn(),
        ...commonEventFields()
    },
    {
	    compression: 'GZIP'
    }
)

export interface WithdrawEventData extends BaseEventData {
    user: string
    pid: number
    amount: AmountType
}

function withdrawTableArgs() {
    return [
        {
            user: Column(Types.String()),
            pid: Column(Types.Uint32()),
            amount: amountColumn(),
            ...commonEventFields()
        },
        {
	        compression: 'GZIP'
        }
    ] as const
}

const staking_withdraw_Withdraw = new Table('staking.Withdraw.parquet', ...withdrawTableArgs())
const cakePool_withdrawAll_staking_Withdraw = new Table('staking.withdrawAll_Withdraw.fromStaking.parquet', ...withdrawTableArgs())
const cakePool_withdrawByAmount_staking_Withdraw = new Table('staking.withdrawByAmount_Withdraw.fromStaking.parquet', ...withdrawTableArgs())

export interface CakePoolWithdrawEventData extends BaseEventData {
    sender: string
    amount: AmountType
    shares: AmountType
}

function cakePoolWithdrawTableArgs() {
    return [
        {
            sender: Column(Types.String()),
            amount: amountColumn(),
            shares: amountColumn(),
            ...commonEventFields()
        },
        {
	        compression: 'GZIP'
        }
    ] as const
}

const cakePool_withdrawAll_cakePool_Withdraw = new Table('cakePool.withdrawAll_Withdraw.fromCakePool.parquet', ...cakePoolWithdrawTableArgs())
const cakePool_withdrawByAmount_cakePool_Withdraw = new Table('cakePool.withdrawByAmount_Withdraw.fromCakePool.parquet', ...cakePoolWithdrawTableArgs())

export interface HarvestEventData extends BaseEventData {
    sender: string
    amount: AmountType
}

function harvestTableArgs() {
    return [
        {
            sender: Column(Types.String()),
            amount: amountColumn(),
            ...commonEventFields()
        },
        {
	        compression: 'GZIP'
        }
    ] as const
}

const cakePool_withdrawAll_Harvest = new Table('cakePool.withdrawAll_Harvest.parquet', ...harvestTableArgs())
const cakePool_withdrawByAmount_Harvest = new Table('cakePool.withdrawByAmount_Harvest.parquet', ...harvestTableArgs())

export interface TransferEventData extends BaseEventData {
    from: string
    to: string
    value: AmountType
}

function transfersTableArgs() {
    return [
        {
            from: Column(Types.String()),
            to: Column(Types.String()),
            value: amountColumn(),
            ...commonEventFields()
        },
        {
    	    compression: 'GZIP'
        }
    ] as const
}

const router_removeLiquidityWithPermit_Transfer = new Table('router.removeLiquidityWithPermit_Transfer.parquet', ...transfersTableArgs())
const router_addLiquidity_Transfer = new Table('router.addLiquidity_Transfer.parquet', ...transfersTableArgs())
const staking_deposit_Transfer = new Table('staking.deposit_Transfer.parquet', ...transfersTableArgs())
const staking_withdraw_Transfer = new Table('staking.withdraw_Transfer.parquet', ...transfersTableArgs())

const unparseableEvents = new Table(
    'unparseableEvents.parquet',
    {
        topic0: Column(Types.String(), {nullable: true}),
        topic1: Column(Types.String(), {nullable: true}),
        topic2: Column(Types.String(), {nullable: true}),
        topic3: Column(Types.String(), {nullable: true}),
        data: Column(Types.String()),
        ...commonEventFields()
    },
    {
        compression: 'GZIP'
    }
)

export const tables = {
    cakePool_withdrawAll,
    cakePool_withdrawByAmount,
    router_addLiquidity,
    router_removeLiquidityWithPermit,
    staking_deposit,
    staking_withdraw,
    unparseableTransactions,
    router_removeLiquidityWithPermit_Burn,
    router_removeLiquidityWithPermit_Transfer,
    router_addLiquidity_Mint,
    router_addLiquidity_Transfer,
    staking_deposit_Deposit,
    staking_deposit_Transfer,
    staking_withdraw_Withdraw,
    staking_withdraw_Transfer,
    cakePool_withdrawAll_staking_Withdraw,
    cakePool_withdrawAll_cakePool_Withdraw,
    cakePool_withdrawAll_Harvest,
    cakePool_withdrawByAmount_staking_Withdraw,
    cakePool_withdrawByAmount_cakePool_Withdraw,
    cakePool_withdrawByAmount_Harvest,
    unparseableEvents
}
