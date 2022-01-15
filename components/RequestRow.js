import React, { Component } from 'react'
import {Button, Table} from 'semantic-ui-react'
// import web3 from '../ethereum/web3';
// import Campaign from '../ethereum/campaign'

export default class RequestRow extends Component {
    handleApprove=async ()=>{
        // const accounts=await web3.eth.getAccounts();
        // const campaign=Campaign(this.props.address);
        // await campaign.methods.approveRequest(this.props.id).send({
        //    from:accounts[0] 
        // })
    }
    handleFinalize=async()=>{
        // const accounts=await web3.eth.getAccounts();
        // const campaign=Campaign(this.props.address);
        // await campaign.methods.finalizeRequest(this.props.id).send({
        //    from:accounts[0] 
        // })
    }
    render() {
        const {Row,Cell}=Table;
        const {id,request,approversCount}=this.props
        // const readyToFinalize=request.approvedCount>=approversCount/2;
        return (
            // <Row disabled={request.complete} positive={readyToFinalize&&!request.complete}>
            <Row>
                <Cell>{id+1}</Cell>
                {/* <Cell>{request.description}</Cell> */}
                {/* <Cell>{web3.utils.fromWei(request.value,'ether')}</Cell> */}
                {/* <Cell>{request.recipient}</Cell> */}
                {/* <Cell>{request.approvedCount}/{approversCount}</Cell> */}
                {/* <Cell>{request.complete ?null:(<Button basic color='green' onClick={this.handleApprove}>Approve</Button>)}</Cell> */}
                <Cell>cireco</Cell>
                <Cell>{(<Button basic color='purple' onClick={this.handleFinalize}>Transfer</Button>)}</Cell>
            </Row>
        )
    }
}