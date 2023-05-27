import {
    DataHandlerContext,
    EvmBatchProcessor,
    BlockData,
    Log,
    Transaction
} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'
//import {LogItem, TransactionItem} from '@subsquid/evm-processor/lib/interfaces/dataSelection'
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

let compatDb = {
    ...db,
    supportsHotBlocks: false,
    transactHot: false
}

type Ctx = DataHandlerContext<Store<typeof tables>, typeof fieldSelection>
type DecodableLog = Log<typeof fieldSelection>
type DecodableTransaction = Transaction<typeof fieldSelection>

processor.run(compatDb, async (ctx) => {
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
                    case routerAbi.functions.removeLiquidityWithPermit.sighash: {
                        let decoded = decodeTransactionSafely(ctx, block.header, txn, decodeRouterRemoveLiquidityWithPermitTransaction)
                        if (decoded) { ctx.store.router_removeLiquidityWithPermit.write(decoded) }
                        break
                    }
                    case routerAbi.functions.addLiquidity.sighash: {
                        let decoded = decodeTransactionSafely(ctx, block.header, txn, decodeRouterAddLiquidityTransaction)
                        if (decoded) { ctx.store.router_addLiquidity.write(decoded) }
                        break
                    }
                }
            }
            if (txn.to===MAIN_STAKING_V2_ADDRESS) {
                switch (txn.sighash) {
                    case stakingAbi.functions.deposit.sighash: {
                        let decoded = decodeTransactionSafely(ctx, block.header, txn, decodeStakingDepositTransaction)
                        if (decoded) { ctx.store.staking_deposit.write(decoded) }
                        break
                    }
                    case stakingAbi.functions.withdraw.sighash: {
                        let decoded = decodeTransactionSafely(ctx, block.header, txn, decodeStakingWithdrawTransaction)
                        if (decoded) { ctx.store.staking_withdraw.write(decoded) }
                        break
                    }
                }
            }
            if (txn.to===CAKE_POOL_ADDRESS) {
                switch (txn.sighash) {
                    case cakePoolAbi.functions.withdrawAll.sighash: {
                        let decoded = decodeTransactionSafely(ctx, block.header, txn, decodeCakePoolWithdrawAllTransaction)
                        if (decoded) { ctx.store.cakePool_withdrawAll.write(decoded) }
                        break
                    }
                    case cakePoolAbi.functions.withdrawByAmount.sighash: {
                        let decoded = decodeTransactionSafely(ctx, block.header, txn, decodeCakePoolWithdrawByAmountTransaction)
                        if (decoded) { ctx.store.cakePool_withdrawByAmount.write(decoded) }
                        break
                    }
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

function decodeTransactionSafely<T>(
    ctx: Ctx,
    header: EvmBlock,
    transaction: DecodableTransaction,
    decoder: (header: EvmBlock, txn: DecodableTransaction) => T
): T | undefined {
    let out: T | undefined
    try {
        out = decoder(header, item)
    }
    catch (error) {
        ctx.log.error({error, blockNumber: header.height, blockHash: header.hash, address: item.transaction.to}, `Unable to decode function at ${decoder.name}`)
        ctx.log.error(`Offending item:`)
        ctx.log.error(item)
        ctx.store.unparseableTransactions.write({
            input: item.transaction.input,
            ...decodeBaseTransactionData(header, item)
        })
    }
    return out
}

function getSighash(item: DecodableTransactionItem): string {
    return item.transaction.input.slice(0, 10)
}

function decodeBlockHeader(header: EvmBlock) {
    return {
        block: header.height,
        timestamp: new Date(header.timestamp)
    }
}

function decodeBaseTransactionData(header: EvmBlock, item: DecodableTransactionItem): BaseTransactionData {
    return {
        ...decodeBlockHeader(header),
        hash: item.transaction.hash,
        txFrom: normalizeAddress(item.transaction.from!),
        txTo: normalizeAddress(item.transaction.to!)
    }
}

function decodeBaseEventData(header: EvmBlock, item: DecodableLogItem): BaseEventData {
    return {
        ...decodeBlockHeader(header),
        eventAddress: normalizeAddress(item.evmLog.address),
        parentTransactionHash: item.transaction.hash
    }
}

function normalizeAddress(addr: string) {
    return addr.toLowerCase()
}

function normalizeAmount(amt: ethers.BigNumber) {
    return amt.toString()
}

function decodeRouterRemoveLiquidityWithPermitTransaction(header: EvmBlock, item: DecodableTransactionItem): RouterRemoveLiquidityWithPermitTransactionData {
    let baseData = decodeBaseTransactionData(header, item)
    let txn = routerAbi.functions.removeLiquidityWithPermit.decode(item.transaction.input)
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

function decodeRouterAddLiquidityTransaction(header: EvmBlock, item: DecodableTransactionItem): RouterAddLiquidityTransactionData {
    let baseData = decodeBaseTransactionData(header, item)
    let txn = routerAbi.functions.addLiquidity.decode(item.transaction.input)
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

function decodeStakingDepositTransaction(header: EvmBlock, item: DecodableTransactionItem): StakingDepositTransactionData {
    let baseData = decodeBaseTransactionData(header, item)
    let txn = stakingAbi.functions.deposit.decode(item.transaction.input)
    return {
        pid: txn._pid.toNumber(),
        amount: normalizeAmount(txn._amount),
        ...baseData
    }
}

function decodeStakingWithdrawTransaction(header: EvmBlock, item: DecodableTransactionItem): StakingWithdrawTransactionData {
    let baseData = decodeBaseTransactionData(header, item)
    let txn = stakingAbi.functions.withdraw.decode(item.transaction.input)
    return {
        pid: txn._pid.toNumber(),
        amount: normalizeAmount(txn._amount),
        ...baseData
    }
}

function decodeCakePoolWithdrawEvent(header: EvmBlock, item: DecodableLogItem): CakePoolWithdrawEventData {
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

function decodeCakePoolWithdrawAllTransaction(header: EvmBlock, item: DecodableTransactionItem): CakePoolWithdrawAllTransactionData {
    let baseData = decodeBaseTransactionData(header, item)
    return {
        ...baseData
    }
}

function decodeCakePoolWithdrawByAmountTransaction(header: EvmBlock, item: DecodableTransactionItem): CakePoolWithdrawByAmountTransactionData {
    let baseData = decodeBaseTransactionData(header, item)
    let txn = cakePoolAbi.functions.withdrawByAmount.decode(item.transaction.input)
    return {
        amount: normalizeAmount(txn._amount),
        ...baseData
    }
}
