import {
    BatchHandlerContext,
    BatchProcessorItem,
    EvmBatchProcessor,
    EvmBlock,
} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'
import {LogItem, TransactionItem} from '@subsquid/evm-processor/lib/interfaces/dataSelection'
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
    CakePoolWithdrawByAmountTransactionData,
    TransferEventData
} from './tables'
import * as routerAbi from './abi/router'
import * as stakingAbi from './abi/staking'
import * as cakePoolAbi from './abi/cakePool'
import * as factoryAbi from './abi/factory'
import * as erc20Abi from './abi/erc20'
import assert from 'assert'

import {LocalDest} from '@subsquid/file-store'

const ROUTER_V2_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E'.toLowerCase()
const MAIN_STAKING_V2_ADDRESS = '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652'.toLowerCase()
const CAKE_POOL_ADDRESS = '0x45c54210128a065de780C4B0Df3d16664f7f859e'.toLowerCase()
const FACTORY_ADDRESSES = new Set([
  '0xBCfCcbde45cE874adCB698cC183deBcF17952812'.toLowerCase(),
  '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'.toLowerCase() // v2
])

const logData = {
    evmLog: {
        address: true,
        topics: true,
        data: true
    },
    transaction: {
        hash: true,
        input: true,
        to: true
    }
} as const

const transactionData = {
    transaction: {
        from: true,
        to: true,
        input: true,
        hash: true
    }
} as const

let processor = new EvmBatchProcessor()
    .setDataSource({
        archive: lookupArchive('binance')
    })
    .setBlockRange({
        from: 25_500_000,
    })
    .addTransaction([ROUTER_V2_ADDRESS], {
        sighash: routerAbi.functions.removeLiquidityWithPermit.sighash,
        data: transactionData
    })
    .addTransaction([ROUTER_V2_ADDRESS], {
        sighash: routerAbi.functions.addLiquidity.sighash,
        data: transactionData
    })
    .addLog([MAIN_STAKING_V2_ADDRESS], {
        filter: [[
            stakingAbi.events.Deposit.topic,
            stakingAbi.events.Withdraw.topic
        ]],
        data: logData
    })
    .addTransaction([MAIN_STAKING_V2_ADDRESS], {
        sighash: stakingAbi.functions.deposit.sighash,
        data: transactionData
    })
    .addTransaction([MAIN_STAKING_V2_ADDRESS], {
        sighash: stakingAbi.functions.withdraw.sighash,
        data: transactionData
    })
    .addLog([CAKE_POOL_ADDRESS], {
        filter: [[
            cakePoolAbi.events.Withdraw.topic,
            cakePoolAbi.events.Harvest.topic
        ]],
        data: logData
    })
    .addTransaction([CAKE_POOL_ADDRESS], {
        sighash: cakePoolAbi.functions.withdrawAll.sighash,
        data: transactionData
    })
    .addTransaction([CAKE_POOL_ADDRESS], {
        sighash: cakePoolAbi.functions.withdrawByAmount.sighash,
        data: transactionData
    })
    .addLog([], {
        filter: [[
            erc20Abi.events.Transfer.topic
        ]],
        data: logData
    })

interface Metadata {
    height: number
    pools: string[]
}
let factoryPools: Set<string>
let db = new Database({
    tables: tables,
    dest: new S3Dest(
        'pancake-deposits-and-withdrawals-full-v1',
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

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchHandlerContext<Store<typeof tables>, Item>
type DecodableLogItem = LogItem<typeof logData>
type DecodableTransactionItem = TransactionItem<typeof transactionData>

let usedContracts = new Map<string, number>()
let unusedContracts = new Map<string, number>()

processor.run(db, async (ctx) => {
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.kind==='transaction') {
                if (item.transaction.to===ROUTER_V2_ADDRESS) {
                    switch (getSighash(item)) {
                        case routerAbi.functions.removeLiquidityWithPermit.sighash: {
                            let txn = decodeTransactionSafely(ctx, block.header, item, decodeRouterRemoveLiquidityWithPermitTransaction)
                            if (txn) { ctx.store.router_removeLiquidityWithPermit.write(txn) }
                            break
                        }
                        case routerAbi.functions.addLiquidity.sighash: {
                            let txn = decodeTransactionSafely(ctx, block.header, item, decodeRouterAddLiquidityTransaction)
                            if (txn) { ctx.store.router_addLiquidity.write(txn) }
                            break
                        }
                    }
                }
                if (item.transaction.to===MAIN_STAKING_V2_ADDRESS) {
                    switch (getSighash(item)) {
                        case stakingAbi.functions.deposit.sighash: {
                            let txn = decodeTransactionSafely(ctx, block.header, item, decodeStakingDepositTransaction)
                            if (txn) { ctx.store.staking_deposit.write(txn) }
                            break
                        }
                        case stakingAbi.functions.withdraw.sighash: {
                            let txn = decodeTransactionSafely(ctx, block.header, item, decodeStakingWithdrawTransaction)
                            if (txn) { ctx.store.staking_withdraw.write(txn) }
                            break
                        }
                    }
                }
                if (item.transaction.to===CAKE_POOL_ADDRESS) {
                    switch (getSighash(item)) {
                        case cakePoolAbi.functions.withdrawAll.sighash: {
                            let txn = decodeTransactionSafely(ctx, block.header, item, decodeCakePoolWithdrawAllTransaction)
                            if (txn) { ctx.store.cakePool_withdrawAll.write(txn) }
                            break
                        }
                        case cakePoolAbi.functions.withdrawByAmount.sighash: {
                            let txn = decodeTransactionSafely(ctx, block.header, item, decodeCakePoolWithdrawByAmountTransaction)
                            if (txn) { ctx.store.cakePool_withdrawByAmount.write(txn) }
                            break
                        }
                    }
                }
            }
            if (item.kind==='evmLog') {
                if (item.evmLog.address===MAIN_STAKING_V2_ADDRESS) {
                    switch (item.evmLog.topics[0]) {
                        case stakingAbi.events.Deposit.topic: {
                            let event = decodeEventSafely(ctx, block.header, item, decodeStakingDepositEvent)
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

                if (item.evmLog.topics[0]===erc20Abi.events.Transfer.topic) {
                    if (item.transaction.to===ROUTER_V2_ADDRESS) {
                        switch (getSighash(item)) {
                            case routerAbi.functions.removeLiquidityWithPermit.sighash: {
                                let event = decodeEventSafely(ctx, block.header, item, decodeTransferEvent)
                                if (event) { ctx.store.router_removeLiquidityWithPermit_Transfer.write(event) }
                                break
                            }
                            case routerAbi.functions.addLiquidity.sighash: {
                                let event = decodeEventSafely(ctx, block.header, item, decodeTransferEvent)
                                if (event) { ctx.store.router_addLiquidity_Transfer.write(event) }
                                break
                            }
                        }
                    }
                    if (item.transaction.to===MAIN_STAKING_V2_ADDRESS) {
                        let event = decodeEventSafely(ctx, block.header, item, decodeTransferEvent)
                        switch (getSighash(item)) {
                            case stakingAbi.functions.withdraw.sighash: {
                                let event = decodeEventSafely(ctx, block.header, item, decodeTransferEvent)
                                if (event) { ctx.store.staking_withdraw_Transfer.write(event) }
                                break
                            }
                            case stakingAbi.functions.deposit.sighash: {
                                let event = decodeEventSafely(ctx, block.header, item, decodeTransferEvent)
                                if (event) { ctx.store.staking_deposit_Transfer.write(event) }
                                break
                            }
                        }
                    }
                }
            }
        }
    }
})

function decodeEventSafely<T>(ctx: Ctx, header: EvmBlock, item: DecodableLogItem, decoder: (header: EvmBlock, item: DecodableLogItem) => T): T | undefined {
    let out: T | undefined
    try {
        out = decoder(header, item)
    }
    catch (error) {
        ctx.log.error({error, blockNumber: header.height, blockHash: header.hash, address: item.evmLog.address}, `Unable to decode event at ${decoder.name}`)
        ctx.log.error(`Offending item:`)
        ctx.log.error(item)
        ctx.store.unparseableEvents.write({
            topic0: item.evmLog.topics[0],
            topic1: item.evmLog.topics[1],
            topic2: item.evmLog.topics[2],
            topic3: item.evmLog.topics[3],
            data: item.evmLog.data,
            ...decodeBaseEventData(header, item)
        })
    }
    return out
}

function decodeTransactionSafely<T>(ctx: Ctx, header: EvmBlock, item: DecodableTransactionItem, decoder: (header: EvmBlock, item: DecodableTransactionItem) => T): T | undefined {
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

function getSighash(item: DecodableLogItem): string;
function getSighash(item: DecodableTransactionItem): string;
function getSighash(item: DecodableLogItem | DecodableTransactionItem): string {
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

function decodeTransferEvent(header: EvmBlock, item: DecodableLogItem): TransferEventData {
    let baseData = decodeBaseEventData(header, item)
    let log = erc20Abi.events.Transfer.decode(item.evmLog)
    return {
        from: log.from,
        to: log.to,
        value: normalizeAmount(log.value),
        ...baseData
    }
}
