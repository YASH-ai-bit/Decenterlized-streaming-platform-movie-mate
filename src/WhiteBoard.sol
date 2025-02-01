// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Room {
    uint constant MAX_CAPACITY = 20;

    struct Room {
        bytes32 roomCode;
        address creator;
    }

    error Room__InvalidRoomCode();
    error Room__AlreadyJoined();
    error Room__RoomFull();
    error Room__NotOwner();

    event RoomCreated(bytes32 indexed roomCode, address indexed creator);
    event RoomDeleted(bytes32 indexed roomCode, address indexed creator);

    mapping(bytes32 => address) public creators;
    mapping(bytes32 => address[]) public participants;
    mapping(bytes32 => mapping(address => bool)) public hasJoined;  // Track if an address joined the room
    mapping(bytes32 => uint) public participantCount;  // Track participant count for each room
    mapping(bytes32 => Room) public rooms;

    function createRoom() public returns (bytes32) {
        bytes32 roomCode = keccak256(abi.encodePacked(block.timestamp, msg.sender, block.number));
        // Listing room creators
        creators[roomCode] = msg.sender;
        rooms[roomCode] = Room(roomCode, msg.sender);
        // Emitting Room Creation event
        emit RoomCreated(roomCode, msg.sender);
        participants[roomCode].push(msg.sender);
        hasJoined[roomCode][msg.sender] = true;
        participantCount[roomCode] +=1;
        
        return roomCode;
    }

    function joinRoom(bytes32 _roomCode) public {
        if (creators[_roomCode] == address(0)) {
            revert Room__InvalidRoomCode();
        }

        if (hasJoined[_roomCode][msg.sender]) {
            revert Room__AlreadyJoined();
        }

        if (participantCount[_roomCode] >= MAX_CAPACITY) {
            revert Room__RoomFull();
        }

        participants[_roomCode].push(msg.sender);
        hasJoined[_roomCode][msg.sender] = true;  
        participantCount[_roomCode] += 1;  
    }

    function getParticipantCount(bytes32 _roomCode) public view returns (uint) {
        return participantCount[_roomCode];  
    }

    function deleteRoom(bytes32 _roomCode) public onlyOwner(_roomCode) {
        delete participants[_roomCode];
        delete creators[_roomCode];
        delete participantCount[_roomCode];
        
        emit RoomDeleted(_roomCode, msg.sender);
    }

    modifier onlyOwner(bytes32 _roomCode) {
        if (creators[_roomCode] != msg.sender) {
            revert Room__NotOwner();
        }
        _;
    }
}
