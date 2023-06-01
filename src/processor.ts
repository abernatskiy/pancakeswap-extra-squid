import {
    DataHandlerContext,
    EvmBatchProcessor,
    BlockData,
    BlockHeader,
    Log,
    Transaction
} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'
import {Store, Database} from '@subsquid/file-store'
import {S3Dest} from '@subsquid/file-store-s3'
import {assertNotNull} from '@subsquid/util-internal'
import {ethers} from 'ethers'

import {
    tables,
    BaseTransactionData,
    BaseEventData,
    RouterRemoveLiquidityWithPermitTransactionData,
    RouterAddLiquidityTransactionData,
    StakingDepositTransactionData,
    StakingWithdrawTransactionData,
    CakePoolWithdrawAllTransactionData,
    CakePoolWithdrawByAmountTransactionData,
    BurnEventData,
    MintEventData,
    TransferEventData,
    DepositEventData,
    WithdrawEventData,
    CakePoolWithdrawEventData,
    HarvestEventData
} from './tables'
import * as routerAbi from './abi/router'
import * as stakingAbi from './abi/staking'
import * as cakePoolAbi from './abi/cakePool'
import * as erc20Abi from './abi/erc20'
import * as pairAbi from './abi/pair'
import assert from 'assert'

import {LocalDest} from '@subsquid/file-store'

const ROUTER_V2_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E'.toLowerCase()
const MAIN_STAKING_V2_ADDRESS = '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652'.toLowerCase()
const CAKE_POOL_ADDRESS = '0x45c54210128a065de780C4B0Df3d16664f7f859e'.toLowerCase()

let fieldSelection = {
    log: {
        transactionHash: true
    },
    transaction: {
        input: true,
        sighash: true
    }
} as const

let processor = new EvmBatchProcessor()
    .setFields(fieldSelection)
    .setDataSource({
        archive: 'https://v2.archive.subsquid.io/network/binance-mainnet',
        chain: process.env.RPC_BSC_HTTP
    })
    .setBlockRange({
        from: 25_500_000,
    })
    .addTransaction({
        to: [ROUTER_V2_ADDRESS],
        sighash: [
            routerAbi.functions.removeLiquidityWithPermit.sighash,
            routerAbi.functions.addLiquidity.sighash
        ],
        logs: true
    })
    .addTransaction({
        to: [MAIN_STAKING_V2_ADDRESS],
        sighash: [
            stakingAbi.functions.deposit.sighash,
            stakingAbi.functions.withdraw.sighash
        ],
        logs: true
    })
    .addTransaction({
        to: [CAKE_POOL_ADDRESS],
        sighash: [
            cakePoolAbi.functions.withdrawAll.sighash,
            cakePoolAbi.functions.withdrawByAmount.sighash
        ],
        logs: true
    })

let db = new Database({
    tables: tables,
    dest: new S3Dest(
        'pancake-deposits-and-withdrawals-full-v2',
        assertNotNull(process.env.S3_BUCKET_NAME),
        {
            region: 'us-east-1',
            endpoint: 'https://s3.filebase.com',
            credentials: {
                accessKeyId: assertNotNull(process.env.S3_ACCESS_KEY_ID),
                secretAccessKey: assertNotNull(process.env.S3_SECRET_ACCESS_KEY)
            }
        }
    ),
    chunkSizeMb: 20
})

type Ctx = DataHandlerContext<Store<typeof tables>, typeof fieldSelection>
type DecodableLog = Log<typeof fieldSelection>
type DecodableTransaction = Transaction<typeof fieldSelection>
type DecodableBlockHeader = BlockHeader<typeof fieldSelection>

processor.run(db, async (ctx) => {
    let router_removeLiquidityWithPermit_transactions = new Set<string>()
    let router_addLiquidity_transactions = new Set<string>()
    let staking_deposit_transactions = new Set<string>()
    let staking_withdraw_transactions = new Set<string>()
    let cakePool_withdrawAll_transactions = new Set<string>()
    let cakePool_withdrawByAmount_transactions = new Set<string>()

    for (let block of ctx.blocks) {
        for (let txn of block.transactions) {
            if (txn.to===ROUTER_V2_ADDRESS) {
                switch (txn.sighash) {
                    case routerAbi.functions.removeLiquidityWithPermit.sighash:
                        handleTransaction(ctx, block.header, txn, decodeRouterRemoveLiquidityWithPermitTransaction, ctx.store.router_removeLiquidityWithPermit, router_removeLiquidityWithPermit_transactions)
                        break
                    case routerAbi.functions.addLiquidity.sighash:
                        handleTransaction(ctx, block.header, txn, decodeRouterAddLiquidityTransaction, ctx.store.router_addLiquidity, router_addLiquidity_transactions)
                        break
                }
            }
            if (txn.to===MAIN_STAKING_V2_ADDRESS) {
                switch (txn.sighash) {
                    case stakingAbi.functions.deposit.sighash:
                        handleTransaction(ctx, block.header, txn, decodeStakingDepositTransaction, ctx.store.staking_deposit, staking_deposit_transactions)
                        break
                    case stakingAbi.functions.withdraw.sighash:
                        handleTransaction(ctx, block.header, txn, decodeStakingWithdrawTransaction, ctx.store.staking_withdraw, staking_withdraw_transactions)
                        break
                }
            }
            if (txn.to===CAKE_POOL_ADDRESS) {
                switch (txn.sighash) {
                    case cakePoolAbi.functions.withdrawAll.sighash:
                        handleTransaction(ctx, block.header, txn, decodeCakePoolWithdrawAllTransaction, ctx.store.cakePool_withdrawAll, cakePool_withdrawAll_transactions)
                        break
                    case cakePoolAbi.functions.withdrawByAmount.sighash:
                        handleTransaction(ctx, block.header, txn, decodeCakePoolWithdrawByAmountTransaction, ctx.store.cakePool_withdrawByAmount, cakePool_withdrawByAmount_transactions)
                        break
                }
            }
        }

        for (let log of block.logs) {
            if (router_removeLiquidityWithPermit_transactions.has(log.transactionHash)) {
                switch (log.topics[0]) {
                    case pairAbi.events.Burn.topic:
                        handleLog(ctx, block.header, log, decodeBurnEvent, ctx.store.router_removeLiquidityWithPermit_Burn)
                        break
                    case erc20Abi.events.Transfer.topic:
                        handleLog(ctx, block.header, log, decodeTransferEvent, ctx.store.router_removeLiquidityWithPermit_Transfer)
                        break
                }
            }
            if (router_addLiquidity_transactions.has(log.transactionHash)) {
                switch (log.topics[0]) {
                    case pairAbi.events.Mint.topic:
                        handleLog(ctx, block.header, log, decodeMintEvent, ctx.store.router_addLiquidity_Mint)
                        break
                    case erc20Abi.events.Transfer.topic:
                        handleLog(ctx, block.header, log, decodeTransferEvent, ctx.store.router_addLiquidity_Transfer)
                        break
                }
            }
            if (staking_deposit_transactions.has(log.transactionHash)) {
                switch (log.topics[0]) {
                    case stakingAbi.events.Deposit.topic:
                        handleLog(ctx, block.header, log, decodeDepositEvent, ctx.store.staking_deposit_Deposit)
                        break
                    case erc20Abi.events.Transfer.topic:
                        handleLog(ctx, block.header, log, decodeTransferEvent, ctx.store.staking_deposit_Transfer)
                        break
                }
            }
            if (staking_withdraw_transactions.has(log.transactionHash)) {
                switch (log.topics[0]) {
                    case stakingAbi.events.Withdraw.topic:
                        handleLog(ctx, block.header, log, decodeWithdrawEvent, ctx.store.staking_withdraw_Withdraw)
                        break
                    case erc20Abi.events.Transfer.topic:
                        handleLog(ctx, block.header, log, decodeTransferEvent, ctx.store.staking_withdraw_Transfer)
                        break
                }
            }
            if (cakePool_withdrawAll_transactions.has(log.transactionHash)) {
                switch (log.topics[0]) {
                    case stakingAbi.events.Withdraw.topic: {
                        if (log.address===MAIN_STAKING_V2_ADDRESS) {
                            handleLog(ctx, block.header, log, decodeWithdrawEvent, ctx.store.cakePool_withdrawAll_staking_Withdraw)
                        }
                        if (log.address===CAKE_POOL_ADDRESS) {
                            handleLog(ctx, block.header, log, decodeCakePoolWithdrawEvent, ctx.store.cakePool_withdrawAll_cakePool_Withdraw)
                        }
                        break
                    }
                    case cakePoolAbi.events.Harvest.topic:
                        handleLog(ctx, block.header, log, decodeHarvestEvent, ctx.store.cakePool_withdrawAll_Harvest)
                        break
                }
            }
            if (cakePool_withdrawByAmount_transactions.has(log.transactionHash)) {
                switch (log.topics[0]) {
                    case stakingAbi.events.Withdraw.topic: {
                        if (log.address===MAIN_STAKING_V2_ADDRESS) {
                            handleLog(ctx, block.header, log, decodeWithdrawEvent, ctx.store.cakePool_withdrawByAmount_staking_Withdraw)
                        }
                        if (log.address===CAKE_POOL_ADDRESS) {
                            handleLog(ctx, block.header, log, decodeCakePoolWithdrawEvent, ctx.store.cakePool_withdrawByAmount_cakePool_Withdraw)
                        }
                        break
                    }
                    case cakePoolAbi.events.Harvest.topic:
                        handleLog(ctx, block.header, log, decodeHarvestEvent, ctx.store.cakePool_withdrawByAmount_Harvest)
                        break
                }
            }
        }
    }
})

function handleLog<D, T extends {write: (dt: D) => void}>(
    ctx: Ctx,
    header: DecodableBlockHeader,
    log: DecodableLog,
    decoder: (header: DecodableBlockHeader, log: DecodableLog) => D,
    targetTable: T
): void {
    let decodedLog = decodeEventSafely(ctx, header, log, decoder)
    if (decodedLog) {
        targetTable.write(decodedLog)
    }
}

function decodeEventSafely<T>(
    ctx: Ctx,
    header: DecodableBlockHeader,
    log: DecodableLog,
    decoder: (header: DecodableBlockHeader, log: DecodableLog) => T
): T | undefined {
    let out: T | undefined
    try {
        out = decoder(header, log)
    }
    catch (error) {
        ctx.log.error({error, blockNumber: header.height, blockHash: header.hash, address: log.address}, `Unable to decode event at ${decoder.name}`)
        ctx.log.error(`Offending event log:`)
        ctx.log.error(log)
        ctx.store.unparseableEvents.write({
            topic0: log.topics[0],
            topic1: log.topics[1],
            topic2: log.topics[2],
            topic3: log.topics[3],
            data: log.data,
            ...decodeBaseEventData(header, log)
        })
    }
    return out
}

function handleTransaction<D, T extends {write: (dt: D) => void}>(
    ctx: Ctx,
    header: DecodableBlockHeader,
    transaction: DecodableTransaction,
    decoder: (header: DecodableBlockHeader, txn: DecodableTransaction) => D,
    targetTable: T,
    txIndex: Set<string>
): void {
    let decodedTx = decodeTransactionSafely(ctx, header, transaction, decoder)
    if (decodedTx) {
        targetTable.write(decodedTx)
    }
    txIndex.add(transaction.hash)
}


function decodeTransactionSafely<T>(
    ctx: Ctx,
    header: DecodableBlockHeader,
    transaction: DecodableTransaction,
    decoder: (header: DecodableBlockHeader, txn: DecodableTransaction) => T
): T | undefined {
    let out: T | undefined
    try {
        out = decoder(header, transaction)
    }
    catch (error) {
        ctx.log.error({error, blockNumber: header.height, blockHash: header.hash, address: transaction.to}, `Unable to decode function at ${decoder.name}`)
        ctx.log.error(`Offending transaction:`)
        ctx.log.error(transaction)
        ctx.store.unparseableTransactions.write({
            input: transaction.input,
            ...decodeBaseTransactionData(header, transaction)
        })
    }
    return out
}

function getSighash(txn: DecodableTransaction): string {
    return txn.input.slice(0, 10)
}

function decodeBlockHeader(header: DecodableBlockHeader) {
    return {
        block: header.height,
        timestamp: new Date(header.timestamp)
    }
}

function decodeBaseTransactionData(header: DecodableBlockHeader, txn: DecodableTransaction): BaseTransactionData {
    return {
        ...decodeBlockHeader(header),
        hash: txn.hash,
        txFrom: normalizeAddress(txn.from!),
        txTo: normalizeAddress(txn.to!)
    }
}

function decodeBaseEventData(header: DecodableBlockHeader, log: DecodableLog): BaseEventData {
    return {
        ...decodeBlockHeader(header),
        eventAddress: normalizeAddress(log.address),
        parentTransactionHash: log.transactionHash
    }
}

function normalizeAddress(addr: string) {
    return addr.toLowerCase()
}

function normalizeAmount(amt: ethers.BigNumber) {
    return amt.toString()
}

/*********************** TRANSACTION DECODERS ***********************/

function decodeRouterRemoveLiquidityWithPermitTransaction(header: DecodableBlockHeader, transaction: DecodableTransaction): RouterRemoveLiquidityWithPermitTransactionData {
    let baseData = decodeBaseTransactionData(header, transaction)
    let txn = routerAbi.functions.removeLiquidityWithPermit.decode(transaction.input)
    return {
        tokenA: normalizeAddress(txn.tokenA),
        tokenB: normalizeAddress(txn.tokenB),
        liquidity: normalizeAmount(txn.liquidity),
        amountAMin: normalizeAmount(txn.amountAMin),
        amountBMin: normalizeAmount(txn.amountBMin),
        to: normalizeAddress(txn.to),
        deadline: txn.deadline.toString(),
        approveMax: txn.approveMax,
        v: txn.v,
        r: txn.r,
        s: txn.s,
        ...baseData
    }
}

function decodeRouterAddLiquidityTransaction(header: DecodableBlockHeader, transaction: DecodableTransaction): RouterAddLiquidityTransactionData {
    let baseData = decodeBaseTransactionData(header, transaction)
    let txn = routerAbi.functions.addLiquidity.decode(transaction.input)
    return {
        tokenA: normalizeAddress(txn.tokenA),
        tokenB: normalizeAddress(txn.tokenB),
        amountADesired: normalizeAmount(txn.amountADesired),
        amountBDesired: normalizeAmount(txn.amountBDesired),
        amountAMin: normalizeAmount(txn.amountAMin),
        amountBMin: normalizeAmount(txn.amountBMin),
        to: normalizeAddress(txn.to),
        deadline: txn.deadline.toString(),
        ...baseData
    }
}

function decodeStakingDepositTransaction(header: DecodableBlockHeader, transaction: DecodableTransaction): StakingDepositTransactionData {
    let baseData = decodeBaseTransactionData(header, transaction)
    let txn = stakingAbi.functions.deposit.decode(transaction.input)
    return {
        pid: txn._pid.toNumber(),
        amount: normalizeAmount(txn._amount),
        ...baseData
    }
}

function decodeStakingWithdrawTransaction(header: DecodableBlockHeader, transaction: DecodableTransaction): StakingWithdrawTransactionData {
    let baseData = decodeBaseTransactionData(header, transaction)
    let txn = stakingAbi.functions.withdraw.decode(transaction.input)
    return {
        pid: txn._pid.toNumber(),
        amount: normalizeAmount(txn._amount),
        ...baseData
    }
}

function decodeCakePoolWithdrawAllTransaction(header: DecodableBlockHeader, transaction: DecodableTransaction): CakePoolWithdrawAllTransactionData {
    let baseData = decodeBaseTransactionData(header, transaction)
    return {
        ...baseData
    }
}

function decodeCakePoolWithdrawByAmountTransaction(header: DecodableBlockHeader, transaction: DecodableTransaction): CakePoolWithdrawByAmountTransactionData {
    let baseData = decodeBaseTransactionData(header, transaction)
    let txn = cakePoolAbi.functions.withdrawByAmount.decode(transaction.input)
    return {
        amount: normalizeAmount(txn._amount),
        ...baseData
    }
}

/*********************** EVENT DECODERS ***********************/

function decodeBurnEvent(header: DecodableBlockHeader, rawLog: DecodableLog): BurnEventData {
    let baseData = decodeBaseEventData(header, rawLog)
    let log = pairAbi.events.Burn.decode(rawLog)
    return {
        sender: normalizeAddress(log.sender),
        amount0: normalizeAmount(log.amount0),
        amount1: normalizeAmount(log.amount1),
        to: normalizeAddress(log.to),
        ...baseData
    }
}

function decodeMintEvent(header: DecodableBlockHeader, rawLog: DecodableLog): MintEventData {
    let baseData = decodeBaseEventData(header, rawLog)
    let log = pairAbi.events.Mint.decode(rawLog)
    return {
        sender: normalizeAddress(log.sender),
        amount0: normalizeAmount(log.amount0),
        amount1: normalizeAmount(log.amount1),
        ...baseData
    }
}

function decodeTransferEvent(header: DecodableBlockHeader, rawLog: DecodableLog): TransferEventData {
    let baseData = decodeBaseEventData(header, rawLog)
    let log = erc20Abi.events.Transfer.decode(rawLog)
    return {
        from: normalizeAddress(log.from),
        to: normalizeAddress(log.to),
        value: normalizeAmount(log.value),
        ...baseData
    }
}

function decodeDepositEvent(header: DecodableBlockHeader, rawLog: DecodableLog): DepositEventData {
    let baseData = decodeBaseEventData(header, rawLog)
    let log = stakingAbi.events.Deposit.decode(rawLog)
    return {
        user: normalizeAddress(log.user),
        pid: log.pid.toNumber(),
        amount: normalizeAmount(log.amount),
        ...baseData
    }
}

function decodeWithdrawEvent(header: DecodableBlockHeader, rawLog: DecodableLog): WithdrawEventData {
    let baseData = decodeBaseEventData(header, rawLog)
    let log = stakingAbi.events.Withdraw.decode(rawLog)
    return {
        user: normalizeAddress(log.user),
        pid: log.pid.toNumber(),
        amount: normalizeAmount(log.amount),
        ...baseData
    }
}

function decodeCakePoolWithdrawEvent(header: DecodableBlockHeader, rawLog: DecodableLog): CakePoolWithdrawEventData {
    let baseData = decodeBaseEventData(header, rawLog)
    let log = cakePoolAbi.events.Withdraw.decode(rawLog)
    return {
        sender: normalizeAddress(log.sender),
        amount: normalizeAmount(log.amount),
        shares: normalizeAmount(log.shares),
        ...baseData
    }
}

function decodeHarvestEvent(header: DecodableBlockHeader, rawLog: DecodableLog): HarvestEventData {
    let baseData = decodeBaseEventData(header, rawLog)
    let log = cakePoolAbi.events.Harvest.decode(rawLog)
    return {
        sender: normalizeAddress(log.sender),
        amount: normalizeAmount(log.amount),
        ...baseData
    }
}
