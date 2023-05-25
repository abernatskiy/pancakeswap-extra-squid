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

export interface StakingDepositEventData extends BaseEventData {
    user: string
    pid: number
    amount: AmountType
}

const staking_Deposit = new Table(
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

export interface StakingWithdrawEventData extends BaseEventData {
    user: string
    pid: number
    amount: AmountType
}

const staking_Withdraw = new Table(
    'staking.Withdraw.parquet',
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

export interface CakePoolWithdrawEventData extends BaseEventData {
    sender: string
    amount: AmountType
    shares: AmountType
}

const cakePool_Withdraw = new Table(
    'cakePool.Withdraw.parquet',
    {
        sender: Column(Types.String()),
        amount: amountColumn(),
        shares: amountColumn(),
        ...commonEventFields()
    },
    {
	    compression: 'GZIP'
    }
)

export interface CakePoolHarvestEventData extends BaseEventData {
    sender: string
    amount: AmountType
}

const cakePool_Harvest = new Table(
    'cakePool.Harvest.parquet',
    {
        sender: Column(Types.String()),
        amount: amountColumn(),
        ...commonEventFields()
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

export const tables = {
    cakePool_Harvest,
    cakePool_Withdraw,
    cakePool_withdrawAll,
    cakePool_withdrawByAmount,
    router_addLiquidity,
    router_removeLiquidityWithPermit,
    staking_Deposit,
    staking_Withdraw,
    staking_deposit,
    staking_withdraw,
    unparseableTransactions
}
