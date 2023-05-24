export const ABI_JSON = [
    {
        "type": "constructor",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_token"
            },
            {
                "type": "address",
                "name": "_masterchefV2"
            },
            {
                "type": "address",
                "name": "_admin"
            },
            {
                "type": "address",
                "name": "_treasury"
            },
            {
                "type": "address",
                "name": "_operator"
            },
            {
                "type": "uint256",
                "name": "_pid"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Deposit",
        "inputs": [
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "shares",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "duration",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "lastDepositedTime",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "FreeFeeUser",
        "inputs": [
            {
                "type": "address",
                "name": "user",
                "indexed": true
            },
            {
                "type": "bool",
                "name": "free",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Harvest",
        "inputs": [
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Init",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Lock",
        "inputs": [
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "lockedAmount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "shares",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "lockedDuration",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "blockTimestamp",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewAdmin",
        "inputs": [
            {
                "type": "address",
                "name": "admin",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewBoostContract",
        "inputs": [
            {
                "type": "address",
                "name": "boostContract",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewBoostWeight",
        "inputs": [
            {
                "type": "uint256",
                "name": "boostWeight",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewDurationFactor",
        "inputs": [
            {
                "type": "uint256",
                "name": "durationFactor",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewDurationFactorOverdue",
        "inputs": [
            {
                "type": "uint256",
                "name": "durationFactorOverdue",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewMaxLockDuration",
        "inputs": [
            {
                "type": "uint256",
                "name": "maxLockDuration",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewOperator",
        "inputs": [
            {
                "type": "address",
                "name": "operator",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewOverdueFee",
        "inputs": [
            {
                "type": "uint256",
                "name": "overdueFee",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewPerformanceFee",
        "inputs": [
            {
                "type": "uint256",
                "name": "performanceFee",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewPerformanceFeeContract",
        "inputs": [
            {
                "type": "uint256",
                "name": "performanceFeeContract",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewTreasury",
        "inputs": [
            {
                "type": "address",
                "name": "treasury",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewUnlockFreeDuration",
        "inputs": [
            {
                "type": "uint256",
                "name": "unlockFreeDuration",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewVCakeContract",
        "inputs": [
            {
                "type": "address",
                "name": "VCake",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewWithdrawFee",
        "inputs": [
            {
                "type": "uint256",
                "name": "withdrawFee",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewWithdrawFeeContract",
        "inputs": [
            {
                "type": "uint256",
                "name": "withdrawFeeContract",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "NewWithdrawFeePeriod",
        "inputs": [
            {
                "type": "uint256",
                "name": "withdrawFeePeriod",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "OwnershipTransferred",
        "inputs": [
            {
                "type": "address",
                "name": "previousOwner",
                "indexed": true
            },
            {
                "type": "address",
                "name": "newOwner",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Pause",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Paused",
        "inputs": [
            {
                "type": "address",
                "name": "account",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Unlock",
        "inputs": [
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "blockTimestamp",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Unpause",
        "inputs": []
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Unpaused",
        "inputs": [
            {
                "type": "address",
                "name": "account",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "Withdraw",
        "inputs": [
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "amount",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "shares",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "BOOST_WEIGHT",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "BOOST_WEIGHT_LIMIT",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "DURATION_FACTOR",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "DURATION_FACTOR_OVERDUE",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "MAX_LOCK_DURATION",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "MAX_LOCK_DURATION_LIMIT",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "MAX_OVERDUE_FEE",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "MAX_PERFORMANCE_FEE",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "MAX_WITHDRAW_FEE",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "MAX_WITHDRAW_FEE_PERIOD",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "MIN_DEPOSIT_AMOUNT",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "MIN_LOCK_DURATION",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "MIN_WITHDRAW_AMOUNT",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "PRECISION_FACTOR",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "PRECISION_FACTOR_SHARE",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "UNLOCK_FREE_DURATION",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "VCake",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "admin",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "available",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "balanceOf",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "boostContract",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "cakePoolPID",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "calculateOverdueFee",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_user"
            }
        ],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "calculatePerformanceFee",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_user"
            }
        ],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "calculateTotalPendingCakeRewards",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "calculateWithdrawFee",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_user"
            },
            {
                "type": "uint256",
                "name": "_shares"
            }
        ],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "deposit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_amount"
            },
            {
                "type": "uint256",
                "name": "_lockDuration"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "freeOverdueFeeUsers",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address"
            }
        ],
        "outputs": [
            {
                "type": "bool"
            }
        ]
    },
    {
        "type": "function",
        "name": "freePerformanceFeeUsers",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address"
            }
        ],
        "outputs": [
            {
                "type": "bool"
            }
        ]
    },
    {
        "type": "function",
        "name": "freeWithdrawFeeUsers",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address"
            }
        ],
        "outputs": [
            {
                "type": "bool"
            }
        ]
    },
    {
        "type": "function",
        "name": "getPricePerFullShare",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "inCaseTokensGetStuck",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_token"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "init",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "dummyToken"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "masterchefV2",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "operator",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "overdueFee",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "owner",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "pause",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "paused",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bool"
            }
        ]
    },
    {
        "type": "function",
        "name": "performanceFee",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "performanceFeeContract",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "renounceOwnership",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setAdmin",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_admin"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setBoostContract",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_boostContract"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setBoostWeight",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_boostWeight"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setDurationFactor",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_durationFactor"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setDurationFactorOverdue",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_durationFactorOverdue"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setFreePerformanceFeeUser",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_user"
            },
            {
                "type": "bool",
                "name": "_free"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setMaxLockDuration",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_maxLockDuration"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setOperator",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_operator"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setOverdueFee",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_overdueFee"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setOverdueFeeUser",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_user"
            },
            {
                "type": "bool",
                "name": "_free"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPerformanceFee",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_performanceFee"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setPerformanceFeeContract",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_performanceFeeContract"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setTreasury",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_treasury"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setUnlockFreeDuration",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_unlockFreeDuration"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setVCakeContract",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_VCake"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setWithdrawFee",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_withdrawFee"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setWithdrawFeeContract",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_withdrawFeeContract"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setWithdrawFeePeriod",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_withdrawFeePeriod"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setWithdrawFeeUser",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_user"
            },
            {
                "type": "bool",
                "name": "_free"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "token",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "totalBoostDebt",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "totalLockedAmount",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "totalShares",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "transferOwnership",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "newOwner"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "treasury",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "unlock",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_user"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "unpause",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "userInfo",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "shares"
            },
            {
                "type": "uint256",
                "name": "lastDepositedTime"
            },
            {
                "type": "uint256",
                "name": "cakeAtLastUserAction"
            },
            {
                "type": "uint256",
                "name": "lastUserActionTime"
            },
            {
                "type": "uint256",
                "name": "lockStartTime"
            },
            {
                "type": "uint256",
                "name": "lockEndTime"
            },
            {
                "type": "uint256",
                "name": "userBoostedShare"
            },
            {
                "type": "bool",
                "name": "locked"
            },
            {
                "type": "uint256",
                "name": "lockedAmount"
            }
        ]
    },
    {
        "type": "function",
        "name": "withdraw",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_shares"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "withdrawAll",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
    },
    {
        "type": "function",
        "name": "withdrawByAmount",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_amount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "withdrawFee",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "withdrawFeeContract",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "withdrawFeePeriod",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    }
]
