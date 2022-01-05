// import { style } from '@mui/system';
import React , {Component} from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Button, Card ,Container , Image} from 'semantic-ui-react';
import Detector from "../../ethereum/detector.js";
import QRCode from "qrcode";

// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAAS4SURBVO3BQQ4bSRIEwfAC//9lXx3zVECjk8RIG2b4R6qWnFQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYs+eQnIL6mZgLyhZgLyhJobIE+omYD8kpo3TqoWnVQtOqla9MkyNZuAPKHmCSDfpGYC8oaaTUA2nVQtOqladFK16JMvA/KEmjeATGomIJOaCciNmhsgT6h5A8gTar7ppGrRSdWik6pFn/zl1ExAbtTcqJmATEAmNU+omYBMav5mJ1WLTqoWnVQt+uQvB2RSMwF5Q80E5EbNDZB/2UnVopOqRSdViz75MjXfpGYCMql5AsgEZFJzA+SX1PyXnFQtOqladFK16JNlQH4JyKRmAjKpmYBMaiYgN0AmNROQSc0E5Akg/2UnVYtOqhadVC3CP/J/BMiNmgnIpOYGyBNq/iUnVYtOqhadVC365CUgk5obIN+kZgIyqbkBcgPkCTU3QG7U3ACZ1ExAnlDzxknVopOqRSdViz5ZBmRS84SaTWomIJOaSc0EZFLzBJAbNROQCcjf5KRq0UnVopOqRZ+8pGYCMgGZ1ExAboBMaiYgN2p+Ccgbam6ATGomIJOaXzqpWnRSteikatEnX6bmCSCTmhs1N0AmNW8AmdTcqHkCyBNAboDcqNl0UrXopGrRSdWiT14CMqnZBORGzSYgN2omIJOaCcgTaiYgk5obIJOaCcgEZFLzxknVopOqRSdViz5ZBuRGzY2aTWomIDdqnlBzo2YCMqn5JiA3ajadVC06qVp0UrXok2VqboDcAHlCzQ2QSc0TQDapuQGySc0EZAIyqXnjpGrRSdWik6pFn7yk5gbIE2pugNwAmdRMQCY1E5AbNROQSc0TQCY1TwCZ1ExAJjXfdFK16KRq0UnVIvwji4BMaiYgb6iZgExqJiBPqLkBMqm5ATKpuQEyqXkCyKRmAjKp2XRSteikatFJ1aJPXgJyA+RGzQRkUnOj5kbN30TNDZBJzX/JSdWik6pFJ1WLPvkxNU8AmdRMQN5QMwF5AsgTQCY1E5BNQG6ATGreOKladFK16KRq0SdfpmYCMqm5UTMBeULNDZAbNROQSc0mNROQSc0Tam6AbDqpWnRSteikatEnP6bmCSCTmgnIDZBvAjKpmYBsAvIGkEnNppOqRSdVi06qFuEf+YsBmdTcAJnUTEAmNTdAnlAzAZnUPAHkDTWbTqoWnVQtOqla9MlLQH5JzX+JmgnIpGYC8gSQSc2NmgnIpOabTqoWnVQtOqla9MkyNZuAPAHkl4BMam7UTEBu1DwB5AbIpGbTSdWik6pFJ1WLPvkyIE+o+ZcBuQHyhpoJyA2QSc0bJ1WLTqoWnVQt+uQfp2YC8gSQSc2kZpOaGyA3QJ5Qs+mkatFJ1aKTqkWf/OXUTEAmIE+omYDcAJnU/JKaJ4BMQCY1b5xULTqpWnRSteiTL1PzS2qeADKpmdQ8AeSb1DwB5JdOqhadVC06qVr0yTIgvwTkRs0E5JvU3AB5A8ikZgLyhJpNJ1WLTqoWnVQtwj9SteSkatFJ1aKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWik6pFJ1WLTqoWnVQtOqla9D9d9Q1rw+mgYgAAAABJRU5ErkJggg==

export default class ScanInfo extends Component {
    static async getInitialProps(props) {
        const productId = props.query.proId;
        // const productId = "93113285189684030828287481114935413691752178477598600318490081857950099413619";   //props.query.id
        const productDetails = await Detector.methods.getProductDetails(productId).call();
        const response = await QRCode.toDataURL(productId);
        console.log(response);
        return{
            productId : productDetails[0],
            companyId : productDetails[1],
            companyName : productDetails[2],
            productName : productDetails[3],
            currentOwner : productDetails[4],
            ownerName : productDetails[5],
            imageUrl : response
        };
    }

    constructor(props) {
        super(props);
        this.state = {
          imageUrl : "",
        };
      }

    renderCards=()=>{
        const{
           
            productId,
            companyId,
            companyName,
            productName,
            currentOwner,
            ownerName
        }=this.props;
        const items=[
            {
                header:productId,
                meta:'Product Id',
                description:'This is the Product Id',
                style:{overflowWrap:'break-word'}
            },
            {
                header:companyId,
                meta:'Company Id',
                description:'This is the company Id',
                style:{overflowWrap:'break-word'}
               
            },{
                header:companyName,
                meta:'Company Name',
                description:'Product belongs to this company',
                
            },{
                header: productName,
                meta:'Product Name',
                description:'This is the name under which product is present',
                
            },{
                header: currentOwner,
                meta:'Current Owner Adrress',
                description:'This is the address of the current owner of the product',
                style:{overflowWrap:'break-word'}
            },{
                header: ownerName,
                meta:'Current Owner Name',
                description:'Name of the current owner of the product',
            }
            
        ]
        return <Card.Group items={items} className='purple' itemsPerRow='2' centered /> 
    }
    
    render() {
        
        return(
            <Container>
                <br/>
                <br/>
                
                <div>
                    <a href={this.props.imageUrl} download>
                    <Image centered size = "medium" src={this.props.imageUrl} alt="img" />
                    </a>
                </div>
                <br/>
                <br/>
            {this.renderCards()}
            </Container>
        )

        
    }
}