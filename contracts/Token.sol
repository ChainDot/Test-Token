// SPDX-License-Identifier: MIT

import "hardhat/console.sol";

pragma solidity ^0.8.0;

contract Token {
    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(address => uint256) private _balances;

    address private _owner;

    string private _name;
    string private _symbol;

    uint256 private _totalSupply;

    /// Event
    event transfered(address indexed recipient, uint256 amount);
    event transferedFrom(
        address indexed from,
        address indexed to,
        uint256 amount
    );
    event supplied(
        address indexed sender,
        address indexed recipient,
        uint256 amount
    );
    event Approval(address indexed sender, uint256 amount);

    ///Constructor
    constructor(
        address owner_,
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_
    ) {
        _name = name_;
        _symbol = symbol_;
        _balances[owner_] = totalSupply_;
        emit supplied(address(0), owner_, totalSupply_);
    }

    /// Modifiers

    /// Setters

    function transfer(address recipient, uint256 amount) public {
        require(
            _balances[msg.sender] >= amount,
            "Token: insufficient balance."
        );
        require(recipient != address(0), "Token: Transfer to the zero address");
        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        emit transfered(recipient, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public {
        require(
            _allowances[from][msg.sender] >= amount,
            "Token: insufficient allowance"
        );
        _balances[from] -= amount;
        _balances[to] += amount;
        uint256 updateAmount = _allowances[from][msg.sender] - amount;
        approve(from, msg.sender, updateAmount);
        emit transferedFrom(from, to, updateAmount);
    }

    function approve(
        address owner_,
        address spender,
        uint256 amount
    ) private {
        require(spender != address(0), "Token: Transfer to the zero address");

        _allowances[owner_][spender] += amount;
        emit Approval(spender, amount);
    }

    /// Getters

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function allowance(address owner_, address spender)
        public
        view
        returns (uint256)
    {
        return _allowances[owner_][spender];
    }
}
