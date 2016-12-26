pragma solidity ^0.4.2;
contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}

contract tokenRecipient { 
    //event receivedEther(address sender, uint amount);
    event receivedTokens(address _from, uint256 _value, address _token, bytes _extraData);

    function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData){
        Token t = Token(_token);
        if (!t.transferFrom(_from, this, _value)) throw;
        receivedTokens(_from, _value, _token, _extraData);
    }

    function () {
        //receivedEther(msg.sender, msg.value);
    }
}

contract Token {
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
    
}

contract Congress is owned, tokenRecipient {

    /* Contract Variables and events */
    uint public minimumQuorum;
    uint public debatingPeriodInMinutes;
    int public majorityMargin;
    uint votingDeadline;
    Candidate[] public candidates;
    uint public numCandidates;
    mapping (address => uint) public memberId;
    Member[] public members;

    event CandidateAdded(uint candidateID, address recipient,  string description);
    event Voted(uint candidateID, address voter, string justification);
    event CandidateTallied(uint candidateID, int result, uint quorum, bool active);
    event MembershipChanged(address member, bool isMember);
    event ChangeOfRules(uint minimumQuorum, uint debatingPeriodInMinutes, int majorityMargin);

    struct Candidate {
        address recipient;
        //uint amount;
        string description;
        
        bool executed;
        bool candidatePassed;
        uint numberOfVotes;
        int currentResult;
        bytes32 candidateHash;
        Vote[] votes;
        mapping (address => bool) voted;
    }

    struct Member {
        address member;
        string name;
        uint memberSince;
    }

    struct Vote {
        bool inSupport;
        address voter;
        string justification;
    }

    /* modifier that allows only shareholders to vote and create new candidates */
    modifier onlyMembers {
        if (memberId[msg.sender] == 0)
        throw;
        _;
    }

    /* First time setup */
    function Congress(uint minimumQuorumForCandidates,uint minutesForDebate,int marginOfVotesForMajority, address congressLeader)  {
        changeVotingRules(minimumQuorumForCandidates, minutesForDebate, marginOfVotesForMajority);
        //if (congressLeader != 0) owner = congressLeader;
        // It¡¦s necessary to add an empty first member
        owner = msg.sender;
        votingDeadline = now + 86400;
        addMember(0, ''); 
        // and let's add the founder, to save a step later       
        addMember(owner, 'founder');        
    }

function getSender() returns(address){
        return msg.sender;
    }
    /*make member*/
    function addMember(address targetMember, string memberName) onlyOwner {
        uint id;
        if (memberId[targetMember] == 0) {
           memberId[targetMember] = members.length;
           id = members.length++;
           members[id] = Member({member: targetMember, memberSince: now, name: memberName});
        } else {
            id = memberId[targetMember];
            Member m = members[id];
        }

        MembershipChanged(targetMember, true);
    }

    function removeMember(address targetMember) onlyOwner {
        if (memberId[targetMember] == 0) throw;

        for (uint i = memberId[targetMember]; i<members.length-1; i++){
            members[i] = members[i+1];
        }
        delete members[members.length-1];
        members.length--;
    }

    /*change rules*/
    function changeVotingRules(uint minimumQuorumForCandidates,uint minutesForDebate,int marginOfVotesForMajority) onlyOwner {
        minimumQuorum = minimumQuorumForCandidates;
        debatingPeriodInMinutes = minutesForDebate;
        majorityMargin = marginOfVotesForMajority;

        ChangeOfRules(minimumQuorum, debatingPeriodInMinutes, majorityMargin);
    }

    // Function to create a new candidate 
   
    function newCandidate( address candAddr,string candName) onlyOwner returns (uint candidateID){
        candidateID = candidates.length++;
        Candidate c = candidates[candidateID];
        c.recipient = candAddr;
        //c.amount = etherAmount;
        c.description = candName;
        //c.candidateHash = sha3(candAddr, etherAmount, transactionBytecode);
        //c.votingDeadline = now + debatingPeriodInMinutes * 1 minutes;
        //c.executed = false;
        //c.candidatePassed = false;
        c.numberOfVotes = 0;
        CandidateAdded(candidateID, candAddr, candName);
        numCandidates = candidateID+1;
    }

    /* function to check if a candidate code matches */
    function checkCandidateCode(uint candidateNumber,address candAddr,uint etherAmount,bytes transactionBytecode) constant returns (bool codeChecksOut){
        Candidate c = candidates[candidateNumber];
        return c.candidateHash == sha3(candAddr, etherAmount, transactionBytecode);
    }

    function vote(uint candidateNumber,string justificationText) onlyMembers returns (uint voteID){
        Candidate c = candidates[candidateNumber];         // Get the candidate
        if (c.voted[msg.sender] == true) throw;         // If has already voted, cancel
        c.voted[msg.sender] = true;                     // Set this voter as having voted
        c.numberOfVotes++;                              // Increase the number of votes
        c.currentResult++;                          // Increase score
        // Create a log of this event
        Voted(candidateNumber, msg.sender, justificationText);
    }

    function countVotes(uint candidateNumber) returns (int result){
        Candidate c = candidates[candidateNumber];
        return c.currentResult;
    }
    
    function electedCandidate(uint candidateNumber) returns (int result) {
        Candidate c = candidates[candidateNumber];
        /* Check if the candidate can be executed:
           - Has the voting deadline arrived?
           - Has it been already executed or is it being executed?
           - Does the transaction code match the candidate?
           - Has a minimum quorum?
        */

        if (now < votingDeadline || c.executed || c.numberOfVotes < minimumQuorum)
            throw;

        /* execute result */
        /* If difference between support and opposition is larger than margin */
        if (c.currentResult > majorityMargin) {
            // Avoid recursive calling
            c.executed = true;
            
            c.candidatePassed = true;
        } else {
            c.candidatePassed = false;
        }
        // Fire Events
        CandidateTallied(candidateNumber, c.currentResult, c.numberOfVotes, c.candidatePassed);
    }
}