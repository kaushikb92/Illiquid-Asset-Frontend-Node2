import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import hashFnv32a from './hash';
import {assetAbi, atokenAbi, assetAddr, atokenAddr, txAbi, txAddr} from './constants'
import Web3 from 'web3'

var web3 = new Web3(new Web3.providers.HttpProvider("http://cilblockchain2.uksouth.cloudapp.azure.com/api"));

var assetCon = web3.eth.contract(assetAbi).at(assetAddr);
var atokenCon = web3.eth.contract(atokenAbi).at(atokenAddr);
var txCon = web3.eth.contract(txAbi).at(txAddr);

var walletAddr = web3.eth.accounts[0];

export default class AssetView extends Component {
  constructor(props) {
    super(props);

    this.state = { asset: [] }
  }
  componentWillMount() {
    var data =[] ;

    var assetIds = assetCon.getAssetIdsByAddress(walletAddr);
    var len = assetIds.length;
    var i;
    for (i = 0; i < len; i++) {
      var assetTs;
      var assetDetails = assetCon.getAssetDetailsByAssetIdAndAddress(walletAddr,assetIds[i]);
      var assetQty = atokenCon.getATBalanceOfUser(walletAddr,assetIds[i]);
      var ownerOfAsset = assetCon.getHolderOfAsset(assetIds[i]);
      if (ownerOfAsset == walletAddr){
      var timeOA = assetCon.getTimeStampByAssetID(assetIds[i]);
      var time1 = new Date(timeOA * 1000);
      assetTs = time1.toLocaleString();
    }
    else{
      var tradeDetails = txCon.getAllTx();
      var len = tradeDetails.length;
      for (i = 0; i < len; i++) {
      if(walletAddr == tradeDetails[3][i]){
                var blckNum = web3.eth.getTransactionReceipt(tradeDetails[0][i]).blockNumber;
                var time = web3.eth.getBlock(blckNum).timestamp;
                var time1 = new Date(time * 1000);
                assetTs = time1.toLocaleString();
      }
    }
    }

 data.push({ assetName: web3.toAscii(assetDetails[0]), pricePerAsset: assetDetails[3].c[0], quantity: assetQty.c[0], assetType: web3.toAscii(assetDetails[1]), assetTime: assetTs})
}

  this.setState({ asset: data });
}

  render() {
    return (

      <div id="Asset-View" className="col-md-10 noPadding">
        <div className="row">
          <div id="header">
            <span id="Heading-name">My Holdings ></span>
          </div>
        </div>

        <form>
          <div className="row">
            <div className="addAssetButtonDiv">
              <Link to="assetRegister"><button id="addAssetButton" type="button"><p id="addAssetButtonInner">+</p></button></Link>
              <p id="addAssetButtonText">Click to add new asset</p>
            </div>
          </div>


        </form>
        <div className="tablediv">
          <table className="myTable">
            <thead className="tablehead-blc-exp">
              <tr id="tablerow">
                <th className="tableHeading width20">Asset Name</th>
                <th className="tableHeading width20">Asset Type</th>
                <th className="tableHeading width20">Price per asset</th>
                <th className="tableHeading width20">Quantity</th>
                <th className="tableHeading width20">Time Stamp</th>


              </tr>
            </thead>
            <tbody className="tableBody-blc-exp">
              {
                this.state.asset.map(function (emp, i) {
                  return (<tr className="table-style-menu" key={i}>

                    <td className="tableData width20">{emp.assetName}</td>
                    <td className="tableData width20">{emp.assetType}</td>
                    <td id="amtRightViewPrice" className="tableData width20">{emp.pricePerAsset.toLocaleString()}</td>
                    <td id="amtRightViewQty" className="tableData width20 amtRightView">{emp.quantity}</td>
                    <td className="tableData width20">{emp.assetTime}</td>

                  </tr>);
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

// //////// Deleted codes***************......................//////////
//
// //***********LEFT PANNEL BOX***********************
// <div id="search-box">
//   <input className="assetSearch" type="text" placeholder="Search..."
//     value={this.props.filterText}
//     ref="filterTextInput"
//     onChange={this.handleChange}
//   />
// </div>
// //***********LEFT PANNEL BOX***********************
// ******************8X MARK*******************************
//  <th className="tableHeading width20"></th>
//  <td className="tableData "><button className="deleteAsset" type="button">X</button></td>
// ******************8X MARK*******************************
