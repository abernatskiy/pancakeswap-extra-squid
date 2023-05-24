export const ABI_JSON = [
    {
        "type": "constructor",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_MASTER_CHEF"
            },
            {
                "type": "address",
                "name": "_CAKE"
            },
            {
                "type": "uint256",
                "name": "_MASTER_PID"
            },
            {
                "type": "address",
                "name": "_burnAdmin"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "AddPool",
        "inputs": [
            {
                "type": "uint256",
                "name": "pid",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "allocPoint",
                "indexed": false
            },
            {
                "type": "address",
                "name": "lpToken",
                "indexed": true
            },
            {
                "type": "bool",
                "name": "isRegular",
                "indexed": false
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
                "name": "user",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "pid",
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
        "name": "EmergencyWithdraw",
        "inputs": [
            {
                "type": "address",
                "name": "user",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "pid",
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
        "name": "SetPool",
        "inputs": [
            {
                "type": "uint256",
                "name": "pid",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "allocPoint",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "UpdateBoostContract",
        "inputs": [
            {
                "type": "address",
                "name": "boostContract",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "UpdateBoostMultiplier",
        "inputs": [
            {
                "type": "address",
                "name": "user",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "pid",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "oldMultiplier",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "newMultiplier",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "UpdateBurnAdmin",
        "inputs": [
            {
                "type": "address",
                "name": "oldAdmin",
                "indexed": true
            },
            {
                "type": "address",
                "name": "newAdmin",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "UpdateCakeRate",
        "inputs": [
            {
                "type": "uint256",
                "name": "burnRate",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "regularFarmRate",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "specialFarmRate",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "UpdatePool",
        "inputs": [
            {
                "type": "uint256",
                "name": "pid",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "lastRewardBlock",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "lpSupply",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "accCakePerShare",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "UpdateWhiteList",
        "inputs": [
            {
                "type": "address",
                "name": "user",
                "indexed": true
            },
            {
                "type": "bool",
                "name": "isValid",
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
                "name": "user",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "pid",
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
        "type": "function",
        "name": "ACC_CAKE_PRECISION",
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
        "name": "BOOST_PRECISION",
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
        "name": "CAKE",
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
        "name": "CAKE_RATE_TOTAL_PRECISION",
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
        "name": "MASTERCHEF_CAKE_PER_BLOCK",
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
        "name": "MASTER_CHEF",
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
        "name": "MASTER_PID",
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
        "name": "MAX_BOOST_PRECISION",
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
        "name": "add",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_allocPoint"
            },
            {
                "type": "address",
                "name": "_lpToken"
            },
            {
                "type": "bool",
                "name": "_isRegular"
            },
            {
                "type": "bool",
                "name": "_withUpdate"
            }
        ],
        "outputs": []
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
        "name": "burnAdmin",
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
        "name": "burnCake",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bool",
                "name": "_withUpdate"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "cakePerBlock",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bool",
                "name": "_isRegular"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "amount"
            }
        ]
    },
    {
        "type": "function",
        "name": "cakePerBlockToBurn",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "amount"
            }
        ]
    },
    {
        "type": "function",
        "name": "cakeRateToBurn",
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
        "name": "cakeRateToRegularFarm",
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
        "name": "cakeRateToSpecialFarm",
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
        "name": "deposit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_pid"
            },
            {
                "type": "uint256",
                "name": "_amount"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "emergencyWithdraw",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_pid"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "getBoostMultiplier",
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
                "name": "_pid"
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
        "name": "harvestFromMasterChef",
        "constant": false,
        "payable": false,
        "inputs": [],
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
        "name": "lastBurnedBlock",
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
        "name": "lpToken",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "massUpdatePools",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": []
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
        "name": "pendingCake",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_pid"
            },
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
        "name": "poolInfo",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "accCakePerShare"
            },
            {
                "type": "uint256",
                "name": "lastRewardBlock"
            },
            {
                "type": "uint256",
                "name": "allocPoint"
            },
            {
                "type": "uint256",
                "name": "totalBoostedShare"
            },
            {
                "type": "bool",
                "name": "isRegular"
            }
        ]
    },
    {
        "type": "function",
        "name": "poolLength",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256",
                "name": "pools"
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
        "name": "set",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_pid"
            },
            {
                "type": "uint256",
                "name": "_allocPoint"
            },
            {
                "type": "bool",
                "name": "_withUpdate"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "totalRegularAllocPoint",
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
        "name": "totalSpecialAllocPoint",
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
        "name": "updateBoostContract",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_newBoostContract"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updateBoostMultiplier",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_user"
            },
            {
                "type": "uint256",
                "name": "_pid"
            },
            {
                "type": "uint256",
                "name": "_newMultiplier"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updateBurnAdmin",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_newAdmin"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updateCakeRate",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_burnRate"
            },
            {
                "type": "uint256",
                "name": "_regularFarmRate"
            },
            {
                "type": "uint256",
                "name": "_specialFarmRate"
            },
            {
                "type": "bool",
                "name": "_withUpdate"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "updatePool",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_pid"
            }
        ],
        "outputs": [
            {
                "type": "tuple",
                "name": "pool",
                "components": [
                    {
                        "type": "uint256",
                        "name": "accCakePerShare"
                    },
                    {
                        "type": "uint256",
                        "name": "lastRewardBlock"
                    },
                    {
                        "type": "uint256",
                        "name": "allocPoint"
                    },
                    {
                        "type": "uint256",
                        "name": "totalBoostedShare"
                    },
                    {
                        "type": "bool",
                        "name": "isRegular"
                    }
                ]
            }
        ]
    },
    {
        "type": "function",
        "name": "updateWhiteList",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_user"
            },
            {
                "type": "bool",
                "name": "_isValid"
            }
        ],
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
                "type": "uint256"
            },
            {
                "type": "address"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": "amount"
            },
            {
                "type": "uint256",
                "name": "rewardDebt"
            },
            {
                "type": "uint256",
                "name": "boostMultiplier"
            }
        ]
    },
    {
        "type": "function",
        "name": "whiteList",
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
        "name": "withdraw",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_pid"
            },
            {
                "type": "uint256",
                "name": "_amount"
            }
        ],
        "outputs": []
    }
]
