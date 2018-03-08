import React from 'react'
import List from 'material-ui/List'
import AppBar from './components/AppBar'
import Tabs from './components/Tabs'
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

  onSwitchOption = value => () => {
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
    chrome.storage.sync.set(this.state.options, () =>
      this.setState({ saved: true, edited: false })
    )
  }

  onChangeTab = (e, value) => this.setState(() => ({ tabIndex: value }))

  isTabIndex = index => this.state.tabIndex === index

  render() {
    const { tabIndex, loading, edited, saved } = this.state
    return (
      <React.Fragment>
        <AppBar
          onClickSave={this.onSave}
          saved={saved}
          savedDisabled={!edited}
        />
        {loading ? (
          <Loading />
        ) : (
          <React.Fragment>
            <Tabs
              tabs={['General', 'Advanced']}
              activeIndex={tabIndex}
              onChange={this.onChangeTab}
            />
            <div>
              {this.isTabIndex(0) && (
                <List>
                  <OptionSwitch
                    label="Auto Accept Party Invite"
                    onClick={this.onSwitchOption('autoAcceptPartyInvite')}
                    checked={this.state.options.autoAcceptPartyInvite}
                  />
                  <OptionSwitch
                    label="Auto Ready Match"
                    onClick={this.onSwitchOption('autoReadyMatch')}
                    checked={this.state.options.autoReadyMatch}
                  />
                </List>
              )}
              {this.isTabIndex(1) && (
                <List>
                  <OptionSwitch
                    label="Debug Mode"
                    onClick={this.onSwitchOption('debug')}
                    checked={this.state.options.debug}
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
