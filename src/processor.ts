import {
    BatchHandlerContext,
    BatchProcessorItem,
    EvmBatchProcessor,
    EvmBlock,
} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'
import {LogItem} from '@subsquid/evm-processor/lib/interfaces/dataSelection'
import {Store, Database} from '@subsquid/file-store'
import {S3Dest} from '@subsquid/file-store-s3'
import {assertNotNull} from '@subsquid/util-internal'

import {Pools, Swaps} from './tables'
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
        topics: true,
        data: true
    }
} as const

const txData = {
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
        data: txData
    })
    .addTransaction([ROUTER_V2_ADDRESS], {
        sighash: routerAbi.functions.addLiquidity.sighash,
        data: txData
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
        data: txData
    })
    .addTransaction([MAIN_STAKING_V2_ADDRESS], {
        sighash: stakingAbi.functions.withdraw.sighash,
        data: txData
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
        data: txData
    })
    .addTransaction([CAKE_POOL_ADDRESS], {
        sighash: cakePoolAbi.functions.withdrawByAmount.sighash,
        data: txData
    })
    .addLog([], {
        filter: [[
            erc20Abi.events.Transfer.topic
        ]],
        data: logData
    })
    .addLog([...FACTORY_ADDRESSES], {
        filter: [[factoryAbi.events.PairCreated.topic]],
        data: logData
    })

let tables = { Pools, Swaps }
interface Metadata {
    height: number
    pools: string[]
}
let factoryPools: Set<string>
let db = new Database({
    tables: tables,
    dest: new LocalDest('/mirrorstorage/tst'),
/*new S3Dest(
        'pancakeswaps',
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
    chunkSizeMb: 20,
    hooks: {
        async onConnect(dest) {
            if (await dest.exists('status.json')) {
                let {height, pools}: Metadata = await dest.readFile('status.json').then(JSON.parse)
                assert(Number.isSafeInteger(height))
                factoryPools = new Set<string>([...pools])
                return height
            } else {
                factoryPools = new Set<string>()
                return -1
            }
        },
        async onFlush(dest, range) {
            console.log(factoryPools.size)
            let metadata: Metadata = {
                height: range.to,
                pools: [...factoryPools],
            }
            await dest.writeFile('status.json', JSON.stringify(metadata))
        },
    },
})

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchHandlerContext<Store<typeof tables>, Item>

let usedContracts = new Map<string, number>()
let unusedContracts = new Map<string, number>()

processor.run(db, async (ctx) => {
    assert(factoryPools)

    let poolCreationsData: PoolCreationData[] = []
    let swapsData: SwapData[] = []

    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.kind !== 'evmLog') continue

            let itemAddr = item.address.toLowerCase()
            if (FACTORY_ADDRESSES.has(itemAddr)) {
                let pcd = handlePoolCreation(ctx, item)
                factoryPools.add(pcd.address)
                poolCreationsData.push(pcd)
            }
// else if (factoryPools.has(itemAddr)) {
//                swapsData.push(handleSwap(ctx, block.header, item))
//            }
        }
    }

    ctx.store.Pools.writeMany(poolCreationsData)
    ctx.store.Swaps.writeMany(swapsData)
})

interface PoolCreationData {
    factory: string
    address: string
    token0: string
    token1: string
}

function handlePoolCreation(
    ctx: Ctx,
    item: LogItem<{evmLog: {topics: true; data: true}}>
): PoolCreationData {
    let event = factoryAbi.events.PairCreated.decode(item.evmLog)
    return {
        factory: item.address.toLowerCase(),
        address: event.pair.toLowerCase(),
        token0: event.token0.toLowerCase(),
        token1: event.token1.toLowerCase()
    }
}

interface SwapData {
    txHash: string
    blockNumber: bigint
    timestamp: Date
    pool: string
    sender: string
    amount0In: string
    amount1In: string
    amount0Out: string
    amount1Out: string
    to: string
}
/*
function handleSwap(
    ctx: Ctx,
    block: EvmBlock,
    item: LogItem<{evmLog: {topics: true; data: true}; transaction: {hash: true}}>
): SwapData {
    let event = pairAbi.events.Swap.decode(item.evmLog)
    return {
        txHash: item.transaction.hash,
        blockNumber: BigInt(block.height),
        timestamp: new Date(block.timestamp),
        pool: item.evmLog.address,
        sender: event.sender.toLowerCase(),
        amount0In: event.amount0In.toString(),
        amount1In: event.amount1In.toString(),
        amount0Out: event.amount0Out.toString(),
        amount1Out: event.amount1Out.toString(),
        to: event.to.toLowerCase()
    }
}
*/
