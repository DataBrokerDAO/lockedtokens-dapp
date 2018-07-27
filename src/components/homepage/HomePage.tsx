import { Contract, providers as ethersProviders } from 'ethers';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import { IReduxState } from '../../redux/configureStore';

interface IOwnProps {
  provider: ethersProviders.Web3Provider;
}

interface IStateProps {}

interface IDispatchProps {}

type Props = IStateProps & IDispatchProps & IOwnProps;

interface IState {
  account?: string;
  buttonActive?: boolean;
  contract?: Contract;
  transaction?: any;
}

class HomePage extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      buttonActive: true
    };
  }

  public async componentDidMount() {
    const data: IState = await this.getData();
    this.setState(data);
  }

  public withdrawTokens = async () => {
    this.setState({ buttonActive: false });
    const { contract, account } = this.state;
    if (contract) {
      try {
        const transaction = await contract.claimLockedTokens(account);
        this.setState({
          transaction
        });
      } finally {
        this.setState({ buttonActive: true });
      }
    } else {
      this.setState({ buttonActive: true });
    }
  };

  public render() {
    const { account, buttonActive, transaction } = this.state;
    return (
      <div className="Page">
        <h2>Hi {account},</h2>
        <div>
          <p style={{ marginTop: '2em' }}>
            End of May 2018, the DataBrokerDAO team{' '}
            <a href="https://medium.com/databrokerdao/next-steps-for-databrokerdao-and-the-ecosystem-de6770b5a567">
              decided to distribute
            </a>{' '}
            a large portion of the unsold tokens to the supporters by doubling
            all tokens. These double tokens are however locked until October
            1st. While the smart contract does not allow us to show you how much
            your address might have locked up, you will have if you held DTX
            tokens in your address on the 4th of July 2018. If you have
            questions about this, please get in contact via the{' '}
            <a href="https://t.me/DataBrokerDAO">Telegram channel</a>.
          </p>
          <p>
            You can withdraw them, <strong>after October 1st</strong>, by
            pressing the button below. Pressing this button will send a
            transaction via MetaMask to the smart contract transferring the DTX
            tokens to your account.
          </p>
          <p>
            <em>
              ps. you might have locked tokens for another reason. This dAPP
              works for you too, just keep in mind your personal lockup dates.
            </em>
          </p>
          {!transaction &&
            buttonActive && (
              <button
                disabled={!buttonActive}
                type="button"
                className="btn btn-primary btn-block"
                onClick={this.withdrawTokens}
              >
                Unlock my DTX tokens
              </button>
            )}
          {!transaction &&
            !buttonActive && (
              <div>
                <div className="progress" style={{ marginBottom: '2em' }}>
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{ width: '75%' }}
                  />
                </div>
                <p style={{ fontWeight: 700 }}>
                  Your transaction has been sent to the chain and is waiting to
                  be accepted in the transaction pool. This might take a few
                  minutes. This page will update when completed.
                </p>
              </div>
            )}
          {transaction && (
            <div>
              <div className="progress" style={{ marginBottom: '2em' }}>
                <div
                  className="progress-bar progress-bar-striped"
                  role="progressbar"
                  style={{ width: '100%' }}
                />
              </div>
              <p style={{ fontWeight: 700 }}>
                Your transaction has been sent to the chain and you can follow
                along with{' '}
                <a href={`https://etherscan.io/tx/${transaction.hash}`}>
                  the processing of this transaction on Etherscan
                </a>.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  public async getData(): Promise<IState> {
    const { provider } = this.props;
    if (provider) {
      const accounts = await provider.listAccounts();
      const account = accounts[0];

      const contract = new Contract(
        '0x439b54caf661c21e6b231d972d7eaa98f199590f',
        abi,
        provider.getSigner()
      );
      return {
        account,
        contract
      };
    }
    return {};
  }
}

function mapStateToProps(state: IReduxState, ownProps: IOwnProps): IStateProps {
  return {};
}

function mapDispatchToProps(
  dispatch: Redux.Dispatch,
  ownProps: IOwnProps
): IDispatchProps {
  return {};
}

export default connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);

const abi = [
  {
    constant: false,
    inputs: [
      { name: '_startPresaleTime', type: 'uint256' },
      { name: '_endPresaleTime', type: 'uint256' },
      { name: '_startDayOneTime', type: 'uint256' },
      { name: '_endDayOneTime', type: 'uint256' },
      { name: '_startTime', type: 'uint256' },
      { name: '_endTime', type: 'uint256' }
    ],
    name: 'updateDates',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'lockedTokens',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'TOKENS_PER_ETHER_EARLYSALE',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'endPresaleTime',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalVested',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'claimLockedTokens',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'endTime',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'HARD_CAP',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_newController', type: 'address' }],
    name: 'changeController',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'vaultAddress',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '', type: 'address' },
      { name: '', type: 'uint256' }
    ],
    name: 'onTransfer',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'pauseContribution',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'TOKENS_PER_ETHER_PRESALE',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'tokenContract',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'finalizeSale',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalIssuedEarlySale',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'makeTransferable',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'TOKENS_PER_ETHER',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'startTime',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_recipients', type: 'address[]' },
      { name: '_ethAmounts', type: 'uint256[]' }
    ],
    name: 'handleEarlySaleBuyers',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_recipients', type: 'address[]' },
      { name: '_free', type: 'uint256[]' },
      { name: '_locked', type: 'uint256[]' },
      { name: '_cliffs', type: 'uint256[]' }
    ],
    name: 'handleExternalBuyers',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'transferable',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'finalized',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'resumeContribution',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'startPresaleTime',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_newController', type: 'address' }],
    name: 'changeTokenController',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '', type: 'address' },
      { name: '', type: 'uint256' }
    ],
    name: 'onApprove',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'TOKENS_PER_ETHER_DAY_ONE',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'MAX_TOKENS',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'proxyPayment',
    outputs: [{ name: 'success', type: 'bool' }],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalIssued',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'controller',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'endDayOneTime',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'startDayOneTime',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: '_startPresaleTime', type: 'uint256' },
      { name: '_endPresaleTime', type: 'uint256' },
      { name: '_startDayOneTime', type: 'uint256' },
      { name: '_endDayOneTime', type: 'uint256' },
      { name: '_startTime', type: 'uint256' },
      { name: '_endTime', type: 'uint256' },
      { name: '_vaultAddress', type: 'address' },
      { name: '_tokenAddress', type: 'address' }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' }
];
