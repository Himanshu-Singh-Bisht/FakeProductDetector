// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.4.25;

/**
 * @title Detector
 * @dev Store & retrieve value in a variable
 */
 
 /*
    user 1: "Ishaan","Mumbai"
          : "Shubh", "Kolkata"
          : "Aman", "Pune"
    company: "Nike", "NikeKaOwner", 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
           : "Puma", "PumaKaOwner", 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
    product 1: ,"Shoes"
    product 2: ,"Jeans"
    product 3: ,"Shirt"
 */
contract FakeProductDetector{
    address owner;
    constructor () public {
        owner= msg.sender;
    }
    struct Product{
        uint productId;
        uint companyId;
        string companyName;
        string productName;
        address currentOwner;
        bool inMarket;
        string ownerName;
    }
    struct Company{
        uint companyId;
        string companyName;
        string ownerName;
        address companyManager;
        uint[] productList;
    }
     struct User {
        address userAdd; 
        string userName;
        string userLocation;
        uint[] userProductList;
        bool exist;
    }
    mapping(uint => Company) companyList;
    mapping(address => User) userList;
    mapping(uint => Product) allProductList; 
    mapping (address=> uint) managerList;
    
    modifier restricted(){
        require(msg.sender==owner);
        _;
    }
    function addNewCompany(string memory _companyName,string memory _ownerName,address _manager) public restricted{
        Company memory comp;
        uint id=uint(keccak256(abi.encode(_companyName,_ownerName,block.timestamp,block.difficulty)));
        comp.companyId=id;
        comp.companyName=_companyName;
        comp.ownerName=_ownerName;
        comp.companyManager=_manager;
        companyList[id]=comp;
        managerList[_manager]=id;
    }
    function addNewProduct(uint _companyId,string memory _productName) public returns (uint){
        
        Company storage com =companyList[_companyId];
        require(msg.sender==com.companyManager);
        uint proId=uint(keccak256(abi.encode(_productName,_companyId,block.timestamp,block.difficulty)));
        Product memory pro= Product({
            productId:proId,
            companyId:_companyId,
            companyName:com.companyName,
            productName:_productName,
            currentOwner:com.companyManager,
            inMarket:false,
            ownerName:com.companyName
        });
        com.productList.push(proId);
        allProductList[proId]=pro;

        return proId;
    }

    function createUser(string memory _userName,string memory _userlocation) public {
        require(!userList[msg.sender].exist);
        User memory newUser;
        newUser.userAdd=msg.sender;
        newUser.userName=_userName;
        newUser.userLocation=_userlocation;
        newUser.exist=true;
        userList[msg.sender]=newUser;
    }
    function getCompanyDetails(address _manager) public view returns(uint,string memory,string memory,address,uint[] memory){
        uint tempId=managerList[_manager];
        Company memory comp=companyList[tempId];
        return(comp.companyId,comp.companyName,comp.ownerName,_manager,comp.productList);
    }
    function getProductDetails(uint _productId) public view returns(uint,uint,string memory,string memory,address,string memory , bool){
        Product memory p=allProductList[_productId];
        return(_productId,p.companyId,p.companyName,p.productName,p.currentOwner, p.ownerName , p.inMarket);
    }

    function getUserDetails(address _userAddress) public view returns(address,string memory,string memory,uint[] memory){
        require(userList[_userAddress].exist);
        User memory u = userList[_userAddress];
        return(_userAddress,u.userName,u.userLocation,u.userProductList);
    }

    function transferOwnership(uint index,address _currentOwner,address _newOwner) public {
        require(userList[_newOwner].exist);
        User storage userNext=userList[_newOwner];
        User storage userCurr=userList[_currentOwner];
        uint reqProductId= userCurr.userProductList[index];
        //Last Product Id to update the array of products for currOwner 
        uint lastId=userCurr.userProductList[userCurr.userProductList.length-1];
        //Updating current productId with last and removing last index value from array
        userCurr.userProductList[index]=lastId;
        delete userCurr.userProductList[userCurr.userProductList.length-1];
        userCurr.userProductList.length--;
        Product storage pro=allProductList[reqProductId];
        pro.currentOwner=_newOwner;
        pro.ownerName=userNext.userName;
        userNext.userProductList.push(reqProductId);
    }

    function companyTransferOwnership(uint _companyId,uint index,address _newOwner) public{
        require(msg.sender==companyList[_companyId].companyManager&&userList[_newOwner].exist);
        User storage userNew= userList[_newOwner];
        Company memory comp=companyList[_companyId];
        uint pId=comp.productList[index];
        Product storage p=allProductList[pId];
        p.inMarket=true;
        p.currentOwner=_newOwner;
        p.ownerName=userNew.userName;
        userNew.userProductList.push(pId);
    }


}