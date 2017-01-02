pragma solidity ^0.4.2;


contract Election {

    address owner;

	
    bool public open;
    uint public deadline;

	
	uint public numCandidates;
	Candidate[] public candidates;
	
	mapping (address => uint) public memberId;
    Member[] public members;
	
    
    event MembershipChanged(address memAddr, bool flag); // 當修改MEMBER時的事件
    event CandidateAdded(address candAddr, uint timestamp); // 當增加候選人時的事件
    event Voted(address memAddr,uint timestamp);//當投票時的事件

    //每一筆候選人資料的結構
    struct Candidate {
        address candAddr;
        string description;
        bool elected;
        uint numberOfVotes;
        int currentResult;
        bytes32 proposalHash;
        Vote[] votes;
        mapping (address => bool) voted;
    }

    //每一筆投票人資料的結構
    struct Member {
        address member;
        bool canVote;
        string name;
        uint memberSince;
    }

    //每一筆投票資料的結構
    struct Vote {
        address voter;
        string justification;
    }
    
    //修飾字用來判斷是否為合約佈署者以控制某些權限
    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    //修飾字用來判斷是否為有投票權限者
    modifier onlyMembers {
        if (memberId[msg.sender] == 0
        || !members[memberId[msg.sender]].canVote)
        throw;
        _;
    }

    /* 建構子進行合約初始設定，只有第一次跑 */
    function Election() {
        //設定合約佈署者為owner
        owner = msg.sender;
    
        //changeVotingState(true);
    }

    function getAddr() returns(address){
        return msg.sender;
    }
    /*新增/修改member的投票權限,targetMember 要新增/修改member的投票人位址,memberName 投票人名字, canVote true有投票權,false則無投票權*/
    function changeMembership(address targetMember, string memberName, bool canVote)  {
        
        uint id;
        //如果member不存在，則新增
        if (memberId[targetMember] == 0) {
           memberId[targetMember] = members.length;
           id = members.length++;
           members[id] = Member({member: targetMember, canVote: canVote, memberSince: now, name: memberName});
        //如果member存在，則修改
        } else {
            id = memberId[targetMember];
            Member m = members[id];
            m.canVote = canVote;
        }
        //修改投票人權限觸發事件
        MembershipChanged(targetMember, canVote);

    }

    /*修改投選舉的狀態,flag true可投票 false則無法再投票*/
    function changeVotingState(
        bool flag
    )  {
        open = flag;
        //預設投票截止時間為開始後100秒
        deadline = now + 600;
    }

    /* 只有佈署者可增加候選人,candAddr候選人位址,description候選人名字 */
    function addCandidate(
        address candAddr,
        string description
    )
        
        returns (uint candID)
    {
        bool exist = false;
        Candidate c ;
        //檢查候選人是否已存在
        for(uint i=0;i<candidates.length;i++){
            c = candidates[i];
            if(c.candAddr==candAddr)
                exist = true;
        }
        //如果不存在才新增，避免重覆
        if(!exist){
            candID = candidates.length++;
            c = candidates[candID];
            c.candAddr = candAddr;
            c.description = description;
            c.elected = false;
            c.numberOfVotes = 0;
            numCandidates = candID+1;
            CandidateAdded(candAddr,now);
        }
    }
    

    //進行投票,candidateNumber為候選人順序,comment 備註
    function vote(
        uint candidateNumber,
        string comment
    )
        onlyMembers
        returns (uint voteID)
    {
        //判斷選舉是否已截止或被關閉了
        if(now>deadline || !open){
            open = false;
            throw;
        }
        Candidate c = candidates[candidateNumber];         // Get the proposal
        if (c.voted[msg.sender] == true) throw;         // If has already voted, cancel
        c.voted[msg.sender] = true;                     // Set this voter as having voted
        c.numberOfVotes++;                              // Increase the number of votes
        c.currentResult++;                          // Increase score
        Voted(msg.sender,now);
       
    }

    //檢查候選人得票數及是否當選，candidateNumber為候選人順序
    function checkCandidate(uint candidateNumber) returns (uint,uint,bool) {
        Candidate c = candidates[candidateNumber];
        bool bResult = false;
        //判斷投票是否已截止
        if (now < deadline)
            throw;
        //檢查候選人得票數是否超過總票數的(1/2)+1
        uint votes = members.length/2+1;
        if(uint(c.currentResult)>=votes)
            bResult = true;
        return (votes,uint(c.currentResult),bResult);
       
    }
}