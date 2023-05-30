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
    StakingDepositEventData,
    StakingWithdrawEventData,
    StakingDepositTransactionData,
    StakingWithdrawTransactionData,
    CakePoolWithdrawEventData,
    CakePoolHarvestEventData,
    CakePoolWithdrawAllTransactionData,
    CakePoolWithdrawByAmountTransactionData
} from './tables'
import * as routerAbi from './abi/router'
import * as stakingAbi from './abi/staking'
import * as cakePoolAbi from './abi/cakePool'
import * as erc20Abi from './abi/erc20'
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
        archive: lookupArchive('binance')
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
/*    .addLog({ // I don't think I need this with logs: true in addTransaction below
        address: [MAIN_STAKING_V2_ADDRESS],
        topic0: [
            stakingAbi.events.Deposit.topic,
            stakingAbi.events.Withdraw.topic
        ]
    })*/
    .addTransaction({
        to: [MAIN_STAKING_V2_ADDRESS],
        sighash: [
            stakingAbi.functions.deposit.sighash,
            stakingAbi.functions.withdraw.sighash
        ],
        logs: true
    })
/*    .addLog({
        address: [CAKE_POOL_ADDRESS],
        topic0: [
            cakePoolAbi.events.Withdraw.topic,
            cakePoolAbi.events.Harvest.topic
        ],
    })*/
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
    dest: new LocalDest('/mirrorstorage/tst'),
    /*new S3Dest(
        'pancake-deposits-and-withdrawals-light',
        assertNotNull(process.env.S3_BUCKET_NAME),
        {
            region: 'us-east-1',
            endpoint: 'https://s3.filebase.com',
            credentials: {
                accessKeyId: assertNotNull(process.env.S3_ACCESS_KEY_ID),
                secretAccessKey: assertNotNull(process.env.S3_SECRET_ACCESS_KEY)
            }
        }
    ),*/
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
    let cakePool_withdrawAllByAmount_transactions = new Set<string>()

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
                        handleTransaction(ctx, block.header, txn, decodeCakePoolWithdrawByAmountTransaction, ctx.store.cakePool_withdrawByAmount, cakePool_withdrawAllByAmount_transactions)
                        break
                }
            }
        }

/*
        for (let log of block.logs) {
            if (log.address===MAIN_STAKING_V2_ADDRESS) {
                switch (log.topics[0]) {
                    case stakingAbi.events.Deposit.topic: {
                        let event = decodeEventSafely(ctx, block.header, log, decodeStakingDepositEvent)
                        if (event) { ctx.store.staking_Deposit.write(event) }
                        break
                    }
                    case stakingAbi.events.Withdraw.topic: {
                        let event = decodeEventSafely(ctx, block.header, item, decodeStakingWithdrawEvent)
                        if (event) { ctx.store.staking_Withdraw.write(event) }
                        break
                    }
                }
            }
            if (item.evmLog.address===CAKE_POOL_ADDRESS) {
                switch (item.evmLog.topics[0]) {
                    case cakePoolAbi.events.Withdraw.topic: {
                        let event = decodeEventSafely(ctx, block.header, item, decodeCakePoolWithdrawEvent)
                        if (event) { ctx.store.cakePool_Withdraw.write(event) }
                        break
                    }
                    case cakePoolAbi.events.Harvest.topic: {
                        let event = decodeEventSafely(ctx, block.header, item, decodeCakePoolHarvestEvent)
                        if (event) { ctx.store.cakePool_Harvest.write(event) }
                        break
                    }
                }
            }
        }
*/
    }
})

/*
function decodeEventSafely<T>(ctx: Ctx, header: EvmBlock, item: DecodableLogItem, decoder: (header: EvmBlock, item: DecodableLogItem) => T): T | undefined {
    let out: T | undefined
    try {
        out = decoder(header, item)
    }
    catch (error) {
        ctx.log.error({error, blockNumber: header.height, blockHash: header.hash, address: item.evmLog.address}, `Unable to decode event at ${decoder.name}`)
        ctx.log.error(`Offending item:`)
        ctx.log.error(item)
        process.exit()
    }
    return out
}*/

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
        ctx.log.error(`Offending item:`)
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
/*
function decodeStakingDepositEvent(header: EvmBlock, item: DecodableLogItem): StakingDepositEventData {
    let baseData = decodeBaseEventData(header, item)
    let log = stakingAbi.events.Deposit.decode(item.evmLog)
    return {
        user: normalizeAddress(log.user),
        pid: log.pid.toNumber(),
        amount: normalizeAmount(log.amount),
        ...baseData
    }
}

function decodeStakingWithdrawEvent(header: EvmBlock, item: DecodableLogItem): StakingWithdrawEventData {
    let baseData = decodeBaseEventData(header, item)
    let log = stakingAbi.events.Withdraw.decode(item.evmLog)
    return {
        user: normalizeAddress(log.user),
        pid: log.pid.toNumber(),
        amount: normalizeAmount(log.amount),
        ...baseData
    }
}
*/
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
/*
function decodeCakePoolWithdrawEvent(header: ): CakePoolWithdrawEventData { /////// !!
    let baseData = decodeBaseEventData(header, item)
    let log = cakePoolAbi.events.Withdraw.decode(item.evmLog)
    return {
        sender: normalizeAddress(log.sender),
        amount: normalizeAmount(log.amount),
        shares: normalizeAmount(log.shares),
        ...baseData
    }
}

function decodeCakePoolHarvestEvent(header: EvmBlock, item: DecodableLogItem): CakePoolHarvestEventData {
    let baseData = decodeBaseEventData(header, item)
    let log = cakePoolAbi.events.Harvest.decode(item.evmLog)
    return {
        sender: normalizeAddress(log.sender),
        amount: normalizeAmount(log.amount),
        ...baseData
    }
}
*/
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
