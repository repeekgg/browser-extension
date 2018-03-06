import React from 'react'
import List from 'material-ui/List'
import AppBar from './components/AppBar'
import Tabs from './components/Tabs';
import OptionSwitch from './components/OptionSwitch'
import Loading from './components/Loading'
import storage from '../storage'

export default class App extends React.Component {
  state = {
    options: {},
    loading: true,
    edited: false,
    saved: false,
    tabIndex: 0
  }

  async componentDidMount() {
    const options = await storage.get()
    this.setState({ options, loading: false })
  }

  onChangeOption = value => () => {
    this.setState(({ options }) => ({
      options: {
        ...options,
        [value]: !options[value]
      },
      edited: true,
      saved: false
    }))
  }

  onSave = () => {
    chrome.storage.sync.set(this.state.options, () => this.setState({ saved: true, edited: false }))
  }

  onChangeTab = (e, value) => this.setState(() => ({ tabIndex: value }))

  isTabIndex = index => this.state.tabIndex === index

  render() {
    const { tabIndex, loading, edited, saved } = this.state
    return (
      <React.Fragment>
        <AppBar onClickSave={this.onSave} saved={saved} savedDisabled={!edited} />
        {loading ? (
          <Loading />
        ) : (
          <React.Fragment>
            <Tabs
              tabs={['General']}
              activeIndex={tabIndex}
              onChange={this.onChangeTab}
            />
            <div>
              {this.isTabIndex(0) && (
                <List>
                  <OptionSwitch
                    label="Auto Accept Party Invite"
                    onClick={this.onChangeOption('autoAcceptPartyInvite')}
                    checked={this.state.options.autoAcceptPartyInvite}
                  />
                  <OptionSwitch
                    label="Auto Ready Match"
                    onClick={this.onChangeOption('autoReadyMatch')}
                    checked={this.state.options.autoReadyMatch}
                  />
                </List>
              )}
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}
