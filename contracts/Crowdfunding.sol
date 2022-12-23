// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Crowdfunding {
    bool private accomplished = false;
    uint private target;
    string private title;
    string private description;
    address payable private toAddr;

    constructor(
        string memory _title,
        string memory _description,
        uint _target,
        address payable _toAddr
    ) payable {
        // [5.2.1] ここに実装
    }

    // Getters
    function isAccomplished() public view returns (bool) {
        return accomplished;
    }
    function getTitle() public view returns (string memory) {
        return title;
    }
    function getDescription() public view returns (string memory) {
        return description;
    }
    function getToAddress() public view returns (address) {
        return toAddr;
    }
    function getTarget() public view returns (uint) {
        return target;
    }

    // [5.2.2] ここに実装

    // [5.2.3] ここに実装
}
